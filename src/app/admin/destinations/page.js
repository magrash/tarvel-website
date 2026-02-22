'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Edit2, Trash2, X, Save, MapPin, Star, Image,
    Search, Globe
} from 'lucide-react';

export default function AdminDestinationsPage() {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingDest, setEditingDest] = useState(null);
    const [form, setForm] = useState({
        name: '', nameAr: '', tagline: '', description: '',
        image: '', highlights: '', rating: 4.5, reviews: 0,
    });

    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';

    const fetchDestinations = async () => {
        try {
            const res = await fetch('/api/admin/destinations', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setDestinations(data.destinations || []);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => { fetchDestinations(); }, []);

    const openAdd = () => {
        setEditingDest(null);
        setForm({ name: '', nameAr: '', tagline: '', description: '', image: '', highlights: '', rating: 4.5, reviews: 0 });
        setShowModal(true);
    };

    const openEdit = (dest) => {
        setEditingDest(dest);
        setForm({
            name: dest.name || '',
            nameAr: dest.nameAr || '',
            tagline: dest.tagline || '',
            description: dest.description || '',
            image: dest.image || '',
            highlights: (dest.highlights || []).join(', '),
            rating: dest.rating || 4.5,
            reviews: dest.reviews || 0,
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        const payload = {
            ...form,
            highlights: form.highlights.split(',').map(h => h.trim()).filter(Boolean),
            rating: parseFloat(form.rating),
            reviews: parseInt(form.reviews),
        };

        try {
            if (editingDest) {
                await fetch(`/api/admin/destinations/${editingDest.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify(payload),
                });
            } else {
                await fetch('/api/admin/destinations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify(payload),
                });
            }
            setShowModal(false);
            fetchDestinations();
        } catch (e) { console.error(e); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this destination?')) return;
        try {
            await fetch(`/api/admin/destinations/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchDestinations();
        } catch (e) { console.error(e); }
    };

    const filtered = destinations.filter(d =>
        d.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="text-4xl text-gold-500">𓂀</motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="font-display text-2xl text-white flex items-center gap-3">
                        <Globe className="w-7 h-7 text-gold-500" />
                        Destinations
                    </h1>
                    <p className="text-white/40 text-sm mt-1">{destinations.length} destinations</p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gold-500 text-obsidian-950 rounded-xl font-medium text-sm hover:bg-gold-400 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Destination
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                    type="text"
                    placeholder="Search destinations..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-obsidian-900/50 border border-gold-500/10 rounded-xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-gold-500/30"
                />
            </div>

            {/* Destinations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(dest => (
                    <motion.div
                        key={dest.id}
                        layout
                        className="bg-obsidian-900/50 border border-gold-500/10 rounded-2xl overflow-hidden hover:border-gold-500/30 transition-colors"
                    >
                        {dest.image && (
                            <div className="h-40 overflow-hidden">
                                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-white font-display text-lg">{dest.name}</h3>
                                    {dest.nameAr && <p className="text-white/30 text-xs">{dest.nameAr}</p>}
                                </div>
                                <div className="flex items-center gap-1 text-gold-500 text-sm">
                                    <Star className="w-3.5 h-3.5 fill-gold-500" />
                                    {dest.rating}
                                </div>
                            </div>
                            {dest.tagline && <p className="text-scarab-400 text-xs">{dest.tagline}</p>}
                            <p className="text-white/50 text-sm line-clamp-2">{dest.description}</p>
                            {dest.highlights?.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {dest.highlights.slice(0, 3).map(h => (
                                        <span key={h} className="text-[10px] px-2 py-0.5 bg-gold-500/10 text-gold-500/80 rounded-full">{h}</span>
                                    ))}
                                    {dest.highlights.length > 3 && (
                                        <span className="text-[10px] px-2 py-0.5 text-white/30">+{dest.highlights.length - 3}</span>
                                    )}
                                </div>
                            )}
                            <div className="flex gap-2 pt-2 border-t border-gold-500/10">
                                <button onClick={() => openEdit(dest)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gold-400 hover:bg-gold-500/10 rounded-lg transition-colors">
                                    <Edit2 className="w-3 h-3" /> Edit
                                </button>
                                <button onClick={() => handleDelete(dest.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                    <Trash2 className="w-3 h-3" /> Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-obsidian-950 border border-gold-500/20 rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-display text-xl text-white">
                                    {editingDest ? 'Edit Destination' : 'Add Destination'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="text-white/30 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-white/50 text-xs mb-1 block">Name *</label>
                                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-3 py-2 bg-obsidian-900/50 border border-gold-500/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/30" />
                                </div>
                                <div>
                                    <label className="text-white/50 text-xs mb-1 block">Arabic Name</label>
                                    <input value={form.nameAr} onChange={e => setForm({ ...form, nameAr: e.target.value })}
                                        className="w-full px-3 py-2 bg-obsidian-900/50 border border-gold-500/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/30" />
                                </div>
                                <div>
                                    <label className="text-white/50 text-xs mb-1 block">Tagline</label>
                                    <input value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })}
                                        className="w-full px-3 py-2 bg-obsidian-900/50 border border-gold-500/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/30" />
                                </div>
                                <div>
                                    <label className="text-white/50 text-xs mb-1 block">Description</label>
                                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                                        className="w-full px-3 py-2 bg-obsidian-900/50 border border-gold-500/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/30 resize-none" />
                                </div>
                                <div>
                                    <label className="text-white/50 text-xs mb-1 block">Image URL</label>
                                    <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                                        className="w-full px-3 py-2 bg-obsidian-900/50 border border-gold-500/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/30" />
                                </div>
                                <div>
                                    <label className="text-white/50 text-xs mb-1 block">Highlights (comma-separated)</label>
                                    <input value={form.highlights} onChange={e => setForm({ ...form, highlights: e.target.value })}
                                        className="w-full px-3 py-2 bg-obsidian-900/50 border border-gold-500/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/30"
                                        placeholder="Egyptian Museum, Khan El-Khalili, Citadel" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-white/50 text-xs mb-1 block">Rating</label>
                                        <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })}
                                            className="w-full px-3 py-2 bg-obsidian-900/50 border border-gold-500/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/30" />
                                    </div>
                                    <div>
                                        <label className="text-white/50 text-xs mb-1 block">Reviews</label>
                                        <input type="number" min="0" value={form.reviews} onChange={e => setForm({ ...form, reviews: e.target.value })}
                                            className="w-full px-3 py-2 bg-obsidian-900/50 border border-gold-500/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/30" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-white/40 hover:text-white text-sm rounded-lg transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-obsidian-950 rounded-lg font-medium text-sm hover:bg-gold-400 transition-colors">
                                    <Save className="w-4 h-4" /> {editingDest ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
