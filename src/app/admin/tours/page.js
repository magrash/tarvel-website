'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Edit3, Trash2, ToggleLeft, ToggleRight,
    X, Save, Loader2, Search, MapPin, Upload, Image as ImageIcon,
    ChevronDown, ChevronUp, GripVertical, Clock, Check, ListX, Camera,
    CalendarDays, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function AdminToursPage() {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [editingTour, setEditingTour] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [saving, setSaving] = useState(false);

    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

    const fetchTours = async () => {
        try {
            const res = await fetch('/api/admin/tours', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setTours(data.tours || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (token) fetchTours(); }, [token]);

    const handleToggle = async (tour) => {
        try {
            await fetch(`/api/admin/tours/${tour.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ enabled: !tour.enabled }),
            });
            fetchTours();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (tourId) => {
        if (!confirm('Permanently delete this tour? This cannot be undone. Use the toggle to disable instead.')) return;
        try {
            await fetch(`/api/admin/tours/${tourId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTours();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async (tourData) => {
        setSaving(true);
        try {
            const isEdit = tourData.id;
            const url = isEdit ? `/api/admin/tours/${tourData.id}` : '/api/admin/tours';
            const method = isEdit ? 'PUT' : 'POST';

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(tourData),
            });

            fetchTours();
            setEditingTour(null);
            setIsCreating(false);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const filteredTours = tours.filter(t =>
        t.title?.toLowerCase().includes(search.toLowerCase()) ||
        t.destination?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="text-4xl text-gold-500">𓂀</motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="font-display text-3xl text-white">Tours Management</h1>
                    <p className="text-white/40 text-sm mt-1">{tours.length} total tours</p>
                </div>
                <motion.button
                    onClick={() => { setIsCreating(true); setEditingTour({ title: '', price: 0, destination: 'Cairo', tourType: 'full-day', description: '', minPax: 1, maxPax: 12, days: 1, nights: 0, highlights: [], itinerary: [], included: [], excluded: [] }); }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-semibold text-sm hover:from-gold-400 hover:to-gold-500 transition-all"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <Plus className="w-4 h-4" />
                    Create Tour
                </motion.button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                    type="text"
                    placeholder="Search tours..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-white text-sm outline-none"
                />
            </div>

            {/* Tours Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTours.map((tour, i) => (
                    <motion.div
                        key={tour.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={`glass-card rounded-2xl border overflow-hidden transition-all
                            ${tour.enabled !== false ? 'border-gold-500/10' : 'border-red-500/10 opacity-60'}`}
                    >
                        {/* Image */}
                        <div className="h-40 bg-obsidian-900 relative overflow-hidden">
                            {tour.image ? (
                                <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="w-10 h-10 text-white/10" />
                                </div>
                            )}
                            <div className="absolute top-3 right-3">
                                <span className={`px-2 py-1 rounded-full text-xs border backdrop-blur-md
                                    ${tour.enabled !== false
                                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                                    }`}>
                                    {tour.enabled !== false ? 'Active' : 'Disabled'}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-3">
                            <div>
                                <h3 className="text-white font-medium text-sm line-clamp-1">{tour.title}</h3>
                                <div className="flex items-center gap-1 text-white/40 text-xs mt-1">
                                    <MapPin className="w-3 h-3" />
                                    {tour.destination} • {tour.tourType} • {tour.days}d{tour.nights > 0 ? `/${tour.nights}n` : ''}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gold-400 font-display text-lg">${tour.price}</span>
                                <span className="text-white/30 text-xs">{tour.minPax}-{tour.maxPax} pax</span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                <button
                                    onClick={() => handleToggle(tour)}
                                    className="text-white/40 hover:text-white transition-colors"
                                >
                                    {tour.enabled !== false ? (
                                        <ToggleRight className="w-6 h-6 text-green-400" />
                                    ) : (
                                        <ToggleLeft className="w-6 h-6" />
                                    )}
                                </button>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => { setEditingTour(tour); setIsCreating(false); }}
                                        className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-gold-400 transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tour.id)}
                                        className="p-2 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Edit/Create Modal */}
            <AnimatePresence>
                {editingTour && (
                    <TourEditModal
                        tour={editingTour}
                        isNew={isCreating}
                        onSave={handleSave}
                        onClose={() => { setEditingTour(null); setIsCreating(false); }}
                        saving={saving}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// =============================================
// REUSABLE: Collapsible Section
// =============================================
function Section({ title, icon: Icon, defaultOpen = false, children, badge }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border border-white/5 rounded-xl overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-gold-500" />}
                    <span className="text-white text-sm font-medium">{title}</span>
                    {badge !== undefined && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20">{badge}</span>
                    )}
                </div>
                {open ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 border-t border-white/5 space-y-3">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// =============================================
// REUSABLE: Dynamic list editor (strings)
// =============================================
function ListEditor({ items = [], onChange, placeholder = 'Add item...' }) {
    const [newItem, setNewItem] = useState('');

    const addItem = () => {
        if (!newItem.trim()) return;
        onChange([...items, newItem.trim()]);
        setNewItem('');
    };

    const removeItem = (index) => {
        onChange(items.filter((_, i) => i !== index));
    };

    const updateItem = (index, value) => {
        const updated = [...items];
        updated[index] = value;
        onChange(updated);
    };

    return (
        <div className="space-y-2">
            {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                    <input
                        value={item}
                        onChange={e => updateItem(i, e.target.value)}
                        className="glass-input flex-1 px-3 py-2 rounded-lg text-white text-sm outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => removeItem(i)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            ))}
            <div className="flex items-center gap-2">
                <input
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
                    placeholder={placeholder}
                    className="glass-input flex-1 px-3 py-2 rounded-lg text-white text-sm outline-none placeholder:text-white/20"
                />
                <button
                    type="button"
                    onClick={addItem}
                    className="p-2 rounded-lg bg-gold-500/10 text-gold-400 hover:bg-gold-500/20 transition-colors flex-shrink-0"
                >
                    <Plus className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}

// =============================================
// REUSABLE: Availability calendar editor
// =============================================
const AVAIL_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const AVAIL_MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function AvailabilityCalendar({ tourId, saveRef }) {
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(today.getFullYear());
    const [available, setAvailable] = useState([]);
    const [unavailable, setUnavailable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

    useEffect(() => {
        if (!tourId) return;
        setLoading(true);
        fetch(`/api/admin/tours/${tourId}/availability`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(data => {
                setAvailable(data.availability?.available || []);
                setUnavailable(data.availability?.unavailable || []);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [tourId]);

    const toggleDate = (dateStr) => {
        setDirty(true);
        if (unavailable.includes(dateStr)) {
            // Move from unavailable to available
            setUnavailable(prev => prev.filter(d => d !== dateStr));
            setAvailable(prev => [...prev, dateStr]);
        } else if (available.includes(dateStr)) {
            // Move from available to unavailable
            setAvailable(prev => prev.filter(d => d !== dateStr));
            setUnavailable(prev => [...prev, dateStr]);
        } else {
            // New date — default to available
            setAvailable(prev => [...prev, dateStr]);
        }
    };

    const setAllDaysInMonth = (makeAvailable) => {
        setDirty(true);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const monthDates = [];
        for (let d = 1; d <= daysInMonth; d++) {
            const dt = new Date(year, month, d);
            if (dt >= new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
                monthDates.push(dt.toISOString().split('T')[0]);
            }
        }
        if (makeAvailable) {
            setUnavailable(prev => prev.filter(d => !monthDates.includes(d)));
            setAvailable(prev => [...new Set([...prev, ...monthDates])]);
        } else {
            setAvailable(prev => prev.filter(d => !monthDates.includes(d)));
            setUnavailable(prev => [...new Set([...prev, ...monthDates])]);
        }
    };

    const handleSave = async () => {
        try {
            await fetch(`/api/admin/tours/${tourId}/availability`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ available, unavailable }),
            });
            setDirty(false);
        } catch { }
    };

    // Expose save function to parent via ref
    useEffect(() => {
        if (saveRef) saveRef.current = handleSave;
    }, [available, unavailable]);

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
        const dt = new Date(year, month, d);
        const dateStr = dt.toISOString().split('T')[0];
        const isPast = dt < new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const isAvail = available.includes(dateStr);
        const isUnavail = unavailable.includes(dateStr);
        cells.push({ day: d, dateStr, isPast, isAvail, isUnavail });
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-gold-400" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Month navigation */}
            <div className="flex items-center justify-between">
                <button type="button" onClick={() => { if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1); }}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-white text-sm font-medium">{AVAIL_MONTHS[month]} {year}</span>
                <button type="button" onClick={() => { if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1); }}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Bulk actions */}
            <div className="flex gap-2">
                <button type="button" onClick={() => setAllDaysInMonth(true)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors">
                    Open All
                </button>
                <button type="button" onClick={() => setAllDaysInMonth(false)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors">
                    Block All
                </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1">
                {AVAIL_DAYS.map(d => (
                    <div key={d} className="text-center text-[10px] text-white/30 font-semibold py-0.5">{d}</div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {cells.map((cell, i) => {
                    if (!cell) return <div key={`e-${i}`} className="h-8" />;
                    return (
                        <button
                            key={cell.dateStr}
                            type="button"
                            disabled={cell.isPast}
                            onClick={() => !cell.isPast && toggleDate(cell.dateStr)}
                            className={`h-8 rounded text-xs font-medium transition-all
                                ${cell.isPast ? 'text-white/10 cursor-not-allowed'
                                    : cell.isUnavail ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                                        : cell.isAvail ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                                            : 'text-white/30 hover:bg-white/5 border border-transparent'}
                            `}
                        >
                            {cell.day}
                        </button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-[10px] text-white/40">
                <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded bg-green-500/30 border border-green-500/40" />
                    Available
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded bg-red-500/30 border border-red-500/40" />
                    Blocked
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded bg-white/5" />
                    Unset
                </div>
            </div>

            {/* Unsaved indicator */}
            {dirty && (
                <p className="text-[10px] text-gold-400/60 text-center">Unsaved changes — click "Save Changes" to apply</p>
            )}
        </div>
    );
}

// =============================================
// REUSABLE: Gallery editor (image URLs)
// =============================================
function GalleryEditor({ images = [], onChange }) {
    const [newUrl, setNewUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    const addImage = () => {
        if (!newUrl.trim()) return;
        onChange([...images, newUrl.trim()]);
        setNewUrl('');
    };

    const removeImage = (index) => {
        onChange(images.filter((_, i) => i !== index));
    };

    const handleFileUpload = async (file) => {
        if (!file) return;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) { alert('Invalid file type'); return; }
        if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return; }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (res.ok && data.url) onChange([...images, data.url]);
            else alert(data.error || 'Upload failed');
        } catch { alert('Upload failed'); }
        finally { setUploading(false); }
    };

    return (
        <div className="space-y-3">
            {/* Thumbnail grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {images.map((img, i) => (
                        <div key={i} className="relative group rounded-lg overflow-hidden aspect-[4/3] bg-obsidian-900">
                            <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="p-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add by URL */}
            <div className="flex items-center gap-2">
                <input
                    value={newUrl}
                    onChange={e => setNewUrl(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImage(); } }}
                    placeholder="Paste image URL..."
                    className="glass-input flex-1 px-3 py-2 rounded-lg text-white text-sm outline-none placeholder:text-white/20"
                />
                <button type="button" onClick={addImage}
                    className="p-2 rounded-lg bg-gold-500/10 text-gold-400 hover:bg-gold-500/20 transition-colors flex-shrink-0">
                    <Plus className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Upload button */}
            <label className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-dashed border-white/10 text-white/30 hover:text-gold-400 hover:border-gold-500/30 transition-colors text-sm cursor-pointer">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e.target.files[0])} />
            </label>
        </div>
    );
}

// =============================================
// TOUR EDIT MODAL — Full tour detail editor
// =============================================
function TourEditModal({ tour, isNew, onSave, onClose, saving }) {
    const [form, setForm] = useState({
        title: tour.title || '',
        subtitle: tour.subtitle || '',
        price: tour.price || 0,
        originalPrice: tour.originalPrice || '',
        destination: tour.destination || 'Cairo',
        tourType: tour.tourType || 'full-day',
        description: tour.description || '',
        minPax: tour.minPax || 1,
        maxPax: tour.maxPax || 12,
        days: tour.days || 1,
        nights: tour.nights || 0,
        image: tour.image || '',
        level: tour.level || 'Explorer',
        rating: tour.rating || 4.9,
        reviews: tour.reviews || 0,
        highlights: tour.highlights || [],
        itinerary: tour.itinerary || [],
        included: tour.included || [],
        excluded: tour.excluded || [],
        gallery: tour.gallery || [],
    });
    const availabilitySaveRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleFileUpload = useCallback(async (file) => {
        if (!file) return;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) { alert('Invalid file type. Allowed: JPG, PNG, WebP, GIF'); return; }
        if (file.size > 5 * 1024 * 1024) { alert('File too large. Maximum size is 5MB'); return; }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (res.ok && data.url) updateField('image', data.url);
            else alert(data.error || 'Upload failed');
        } catch { alert('Upload failed.'); }
        finally { setUploading(false); }
    }, []);

    const handleDrop = useCallback((e) => { e.preventDefault(); setDragOver(false); handleFileUpload(e.dataTransfer.files[0]); }, [handleFileUpload]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            price: parseFloat(form.price) || 0,
            originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
            rating: parseFloat(form.rating) || 0,
            reviews: parseInt(form.reviews) || 0,
            minPax: parseInt(form.minPax) || 1,
            maxPax: parseInt(form.maxPax) || 12,
            days: parseInt(form.days) || 1,
            nights: parseInt(form.nights) || 0,
        };
        // Save availability if calendar has changes
        if (availabilitySaveRef.current) {
            await availabilitySaveRef.current();
        }
        onSave(isNew ? payload : { ...payload, id: tour.id });
    };

    // Itinerary helpers
    const addItineraryItem = () => {
        updateField('itinerary', [...form.itinerary, { time: '', title: '', description: '' }]);
    };
    const updateItineraryItem = (index, field, value) => {
        const updated = [...form.itinerary];
        updated[index] = { ...updated[index], [field]: value };
        updateField('itinerary', updated);
    };
    const removeItineraryItem = (index) => {
        updateField('itinerary', form.itinerary.filter((_, i) => i !== index));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="glass-card rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-gold-500/20 flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gold-500/10 flex-shrink-0">
                    <h2 className="font-display text-xl text-white">{isNew ? 'Create Tour' : 'Edit Tour'}</h2>
                    <button onClick={onClose} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
                </div>

                {/* Scrollable body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">

                    {/* ===== IMAGE ===== */}
                    <div>
                        <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Tour Image</label>
                        <div
                            onDrop={handleDrop}
                            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={e => { e.preventDefault(); setDragOver(false); }}
                            className={`relative rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden
                                ${dragOver ? 'border-gold-500 bg-gold-500/5' : form.image ? 'border-gold-500/20' : 'border-white/10 hover:border-white/20'}`}
                        >
                            {form.image ? (
                                <div className="relative group">
                                    <img src={form.image} alt="Tour preview" className="w-full h-44 object-cover" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <label className="px-4 py-2 rounded-lg bg-gold-500 text-obsidian-950 text-sm font-semibold cursor-pointer hover:bg-gold-400">
                                            Replace
                                            <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e.target.files[0])} />
                                        </label>
                                        <button type="button" onClick={() => updateField('image', '')}
                                            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm border border-red-500/30 hover:bg-red-500/30">
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center py-8 cursor-pointer">
                                    {uploading ? <Loader2 className="w-8 h-8 text-gold-500 animate-spin mb-2" /> : <Upload className={`w-8 h-8 mb-2 ${dragOver ? 'text-gold-500' : 'text-white/20'}`} />}
                                    <span className="text-white/40 text-sm">{uploading ? 'Uploading...' : 'Drag & drop or click to browse'}</span>
                                    <span className="text-white/20 text-xs mt-1">JPG, PNG, WebP, GIF • Max 5MB</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e.target.files[0])} />
                                </label>
                            )}
                        </div>
                        <input value={form.image} onChange={e => updateField('image', e.target.value)}
                            placeholder="Or paste image URL..."
                            className="glass-input w-full p-2 rounded-lg text-white text-xs outline-none mt-2" />
                    </div>

                    {/* ===== BASIC INFO ===== */}
                    <Section title="Basic Information" icon={Edit3} defaultOpen={true}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="md:col-span-2">
                                <label className="block text-white/50 text-xs uppercase tracking-wider mb-1">Title *</label>
                                <input value={form.title} onChange={e => updateField('title', e.target.value)}
                                    className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none" required />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-white/50 text-xs uppercase tracking-wider mb-1">Subtitle</label>
                                <input value={form.subtitle} onChange={e => updateField('subtitle', e.target.value)}
                                    className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none" />
                            </div>
                            <div>
                                <label className="block text-white/50 text-xs uppercase tracking-wider mb-1">Destination</label>
                                <select value={form.destination} onChange={e => updateField('destination', e.target.value)}
                                    className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none bg-transparent">
                                    {['Cairo', 'Giza', 'Luxor', 'Aswan', 'Alexandria', 'Hurghada', 'Sharm El Sheikh', 'Siwa Oasis', 'Fayoum'].map(d => (
                                        <option key={d} value={d} className="bg-obsidian-900">{d}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-white/50 text-xs uppercase tracking-wider mb-1">Tour Type</label>
                                <select value={form.tourType} onChange={e => updateField('tourType', e.target.value)}
                                    className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none bg-transparent">
                                    {['full-day', 'half-day', 'multi-day', 'package'].map(t => (
                                        <option key={t} value={t} className="bg-obsidian-900">{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-white/50 text-xs uppercase tracking-wider mb-1">Level</label>
                                <select value={form.level} onChange={e => updateField('level', e.target.value)}
                                    className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none bg-transparent">
                                    {['Explorer', 'Adventurer', 'Conqueror'].map(l => (
                                        <option key={l} value={l} className="bg-obsidian-900">{l}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-white/50 text-xs uppercase tracking-wider mb-1">Days</label>
                                <input type="number" min="0" value={form.days} onChange={e => updateField('days', e.target.value)}
                                    className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none" />
                            </div>
                            <div>
                                <label className="block text-white/50 text-xs uppercase tracking-wider mb-1">Nights</label>
                                <input type="number" min="0" value={form.nights} onChange={e => updateField('nights', e.target.value)}
                                    className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none" />
                            </div>
                            <div>
                                <label className="block text-white/50 text-xs uppercase tracking-wider mb-1">Min Pax</label>
                                <input type="number" min="1" value={form.minPax} onChange={e => updateField('minPax', e.target.value)}
                                    className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none" />
                            </div>
                            <div>
                                <label className="block text-white/50 text-xs uppercase tracking-wider mb-1">Max Pax</label>
                                <input type="number" min="1" value={form.maxPax} onChange={e => updateField('maxPax', e.target.value)}
                                    className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-white/50 text-xs uppercase tracking-wider mb-1">Description</label>
                                <textarea rows="3" value={form.description} onChange={e => updateField('description', e.target.value)}
                                    className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none resize-none" />
                            </div>
                        </div>
                    </Section>

                    {/* ===== PRICING & RATINGS ===== */}
                    <Section title="Pricing & Ratings" icon={Edit3} defaultOpen={true}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                                <label className="block text-white/50 text-xs uppercase tracking-wider mb-1">Price (USD) *</label>
                                <input type="number" min="0" step="0.01" value={form.price} onChange={e => updateField('price', e.target.value)}
                                    className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none" required />
                            </div>
                            <div>
                                <label className="block text-white/50 text-xs uppercase tracking-wider mb-1">Original Price</label>
                                <input type="number" min="0" step="0.01" value={form.originalPrice} onChange={e => updateField('originalPrice', e.target.value)}
                                    placeholder="For strikethrough"
                                    className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none placeholder:text-white/15" />
                            </div>
                            <div>
                                <label className="block text-white/50 text-xs uppercase tracking-wider mb-1">Rating</label>
                                <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => updateField('rating', e.target.value)}
                                    className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none" />
                            </div>
                            <div>
                                <label className="block text-white/50 text-xs uppercase tracking-wider mb-1">Reviews Count</label>
                                <input type="number" min="0" value={form.reviews} onChange={e => updateField('reviews', e.target.value)}
                                    className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none" />
                            </div>
                        </div>
                    </Section>

                    {/* ===== HIGHLIGHTS ===== */}
                    <Section title="Highlights" icon={Check} badge={form.highlights.length}>
                        <ListEditor
                            items={form.highlights}
                            onChange={val => updateField('highlights', val)}
                            placeholder="Add highlight (e.g. 'Visit the Great Pyramid')..."
                        />
                    </Section>

                    {/* ===== ITINERARY ===== */}
                    <Section title="Itinerary" icon={Clock} badge={form.itinerary.length}>
                        <div className="space-y-3">
                            {form.itinerary.map((item, i) => (
                                <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gold-500/60 text-xs font-semibold uppercase tracking-wider">Stop {i + 1}</span>
                                        <button type="button" onClick={() => removeItineraryItem(i)}
                                            className="p-1 rounded hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <input value={item.time} onChange={e => updateItineraryItem(i, 'time', e.target.value)}
                                                placeholder="Time (e.g. 8:00 AM)"
                                                className="glass-input w-full px-3 py-2 rounded-lg text-white text-sm outline-none placeholder:text-white/15" />
                                        </div>
                                        <div className="col-span-2">
                                            <input value={item.title} onChange={e => updateItineraryItem(i, 'title', e.target.value)}
                                                placeholder="Title (e.g. Pickup from hotel)"
                                                className="glass-input w-full px-3 py-2 rounded-lg text-white text-sm outline-none placeholder:text-white/15" />
                                        </div>
                                    </div>
                                    <textarea value={item.description} onChange={e => updateItineraryItem(i, 'description', e.target.value)}
                                        rows="2" placeholder="Description..."
                                        className="glass-input w-full px-3 py-2 rounded-lg text-white text-sm outline-none resize-none placeholder:text-white/15" />
                                </div>
                            ))}
                            <button type="button" onClick={addItineraryItem}
                                className="flex items-center gap-2 w-full justify-center py-2.5 rounded-xl border border-dashed border-white/10 text-white/30 hover:text-gold-400 hover:border-gold-500/30 transition-colors text-sm">
                                <Plus className="w-4 h-4" /> Add Itinerary Stop
                            </button>
                        </div>
                    </Section>

                    {/* ===== INCLUDED ===== */}
                    <Section title="What's Included" icon={Check} badge={form.included.length}>
                        <ListEditor
                            items={form.included}
                            onChange={val => updateField('included', val)}
                            placeholder="Add included item (e.g. 'Private Egyptologist guide')..."
                        />
                    </Section>

                    {/* ===== EXCLUDED ===== */}
                    <Section title="What's Not Included" icon={ListX} badge={form.excluded.length}>
                        <ListEditor
                            items={form.excluded}
                            onChange={val => updateField('excluded', val)}
                            placeholder="Add excluded item (e.g. 'Personal expenses')..."
                        />
                    </Section>

                    {/* ===== GALLERY ===== */}
                    <Section title="Tour Gallery" icon={Camera} badge={form.gallery.length}>
                        <GalleryEditor
                            images={form.gallery}
                            onChange={val => updateField('gallery', val)}
                        />
                    </Section>

                    {/* ===== AVAILABILITY ===== */}
                    {!isNew && (
                        <Section title="Booking Availability" icon={CalendarDays}>
                            <AvailabilityCalendar tourId={tour.id} saveRef={availabilitySaveRef} />
                        </Section>
                    )}
                </form>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-5 border-t border-gold-500/10 flex-shrink-0">
                    <button type="button" onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-white/50 hover:text-white text-sm transition-colors">
                        Cancel
                    </button>
                    <motion.button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-semibold text-sm disabled:opacity-50"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isNew ? 'Create Tour' : 'Save Changes'}
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}
