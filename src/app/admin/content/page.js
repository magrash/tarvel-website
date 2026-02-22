'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Save, Plus, Trash2, Edit2, X, Star,
    Image, HelpCircle, Sparkles, BarChart3, MessageSquare, Layout,
    Upload, Loader2
} from 'lucide-react';

const TABS = [
    { id: 'hero', label: 'Hero', icon: Layout },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'whyegypt', label: 'Why Egypt', icon: Sparkles },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'experiences', label: 'Experiences', icon: Star },
];

export default function AdminContentPage() {
    const [activeTab, setActiveTab] = useState('hero');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({});

    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
    const authHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    const fetchContent = async () => {
        try {
            const res = await fetch('/api/admin/content', { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            setContent(data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => { fetchContent(); }, []);

    const saveSection = async (section, action, payload) => {
        setSaving(true);
        try {
            await fetch('/api/admin/content', {
                method: 'PUT',
                headers: authHeaders,
                body: JSON.stringify({ section, action, ...payload }),
            });
            await fetchContent();
        } catch (e) { console.error(e); }
        setSaving(false);
    };

    // --- HERO ---
    const HeroEditor = () => {
        const [heroForm, setHeroForm] = useState(content?.hero || {});
        return (
            <div className="space-y-4">
                <h3 className="font-display text-lg text-white">Hero Section</h3>
                <p className="text-white/40 text-sm">Edit the homepage hero banner content.</p>
                {['title', 'titleHighlight', 'subtitle', 'ctaPrimary', 'ctaPrimaryLink', 'ctaSecondary', 'ctaSecondaryLink'].map(field => (
                    <div key={field}>
                        <label className="text-white/50 text-xs mb-1 block capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                        {field === 'subtitle' ? (
                            <textarea value={heroForm[field] || ''} onChange={e => setHeroForm({ ...heroForm, [field]: e.target.value })} rows={3}
                                className="w-full px-3 py-2 bg-obsidian-900/50 border border-gold-500/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/30 resize-none" />
                        ) : (
                            <input value={heroForm[field] || ''} onChange={e => setHeroForm({ ...heroForm, [field]: e.target.value })}
                                className="w-full px-3 py-2 bg-obsidian-900/50 border border-gold-500/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/30" />
                        )}
                    </div>
                ))}
                <button onClick={() => saveSection('hero', null, heroForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-obsidian-950 rounded-lg font-medium text-sm hover:bg-gold-400 transition-colors">
                    <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Hero'}
                </button>
            </div>
        );
    };

    // --- STATS ---
    const StatsEditor = () => {
        const [statsForm, setStatsForm] = useState(content?.stats || {});
        return (
            <div className="space-y-4">
                <h3 className="font-display text-lg text-white">Site Stats</h3>
                <p className="text-white/40 text-sm">Edit the animated stats displayed on the homepage.</p>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { key: 'yearsExperience', label: 'Years Experience', type: 'number' },
                        { key: 'happyTravelers', label: 'Happy Travelers', type: 'number' },
                        { key: 'destinationsCovered', label: 'Destinations Covered', type: 'number' },
                        { key: 'averageRating', label: 'Average Rating', type: 'number', step: '0.1' },
                    ].map(({ key, label, type, step }) => (
                        <div key={key}>
                            <label className="text-white/50 text-xs mb-1 block">{label}</label>
                            <input type={type} step={step} value={statsForm[key] || ''} onChange={e => setStatsForm({ ...statsForm, [key]: parseFloat(e.target.value) || 0 })}
                                className="w-full px-3 py-2 bg-obsidian-900/50 border border-gold-500/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/30" />
                        </div>
                    ))}
                </div>
                <button onClick={() => saveSection('stats', null, statsForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-obsidian-950 rounded-lg font-medium text-sm hover:bg-gold-400 transition-colors">
                    <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Stats'}
                </button>
            </div>
        );
    };

    // --- TESTIMONIALS ---
    const TestimonialsEditor = () => {
        const openTestimonialModal = (t = null) => {
            setEditItem(t);
            setModalType('testimonial');
            setForm(t ? { ...t } : { name: '', country: '', flag: '🌍', tour: '', rating: 5, text: '', image: '' });
            setShowModal(true);
        };

        const saveTestimonial = async () => {
            if (editItem) {
                await fetch(`/api/admin/testimonials/${editItem.id}`, {
                    method: 'PUT', headers: authHeaders, body: JSON.stringify(form),
                });
            } else {
                await fetch('/api/admin/testimonials', {
                    method: 'POST', headers: authHeaders, body: JSON.stringify(form),
                });
            }
            setShowModal(false);
            fetchContent();
        };

        const deleteTestimonial = async (id) => {
            if (!confirm('Delete this testimonial?')) return;
            await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE', headers: authHeaders });
            fetchContent();
        };

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-display text-lg text-white">Testimonials</h3>
                        <p className="text-white/40 text-sm">{content?.testimonials?.length || 0} testimonials</p>
                    </div>
                    <button onClick={() => openTestimonialModal()}
                        className="flex items-center gap-2 px-3 py-2 bg-gold-500 text-obsidian-950 rounded-lg text-sm font-medium hover:bg-gold-400">
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>
                <div className="space-y-3">
                    {(content?.testimonials || []).map(t => (
                        <div key={t.id} className="bg-obsidian-900/50 border border-gold-500/10 rounded-xl p-4 flex gap-4">
                            <div className="text-2xl">{t.flag}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-medium text-sm">{t.name}</span>
                                    <span className="text-white/30 text-xs">— {t.country}</span>
                                </div>
                                <p className="text-white/50 text-sm mt-1 line-clamp-2 italic">"{t.text}"</p>
                                <p className="text-gold-500/60 text-xs mt-1">{t.tour}</p>
                            </div>
                            <div className="flex gap-1 items-start">
                                <button onClick={() => openTestimonialModal(t)} className="p-1.5 text-gold-400/60 hover:text-gold-400 hover:bg-gold-500/10 rounded-lg"><Edit2 className="w-3.5 h-3.5" /></button>
                                <button onClick={() => deleteTestimonial(t.id)} className="p-1.5 text-red-400/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>
                    ))}
                </div>

                {showModal && modalType === 'testimonial' && (
                    <Modal title={editItem ? 'Edit Testimonial' : 'Add Testimonial'} onClose={() => setShowModal(false)} onSave={saveTestimonial}>
                        <Input label="Name *" value={form.name} onChange={v => setForm({ ...form, name: v })} />
                        <Input label="Country" value={form.country} onChange={v => setForm({ ...form, country: v })} />
                        <Input label="Flag Emoji" value={form.flag} onChange={v => setForm({ ...form, flag: v })} />
                        <Input label="Tour" value={form.tour} onChange={v => setForm({ ...form, tour: v })} />
                        <Input label="Rating" type="number" min="1" max="5" value={form.rating} onChange={v => setForm({ ...form, rating: parseInt(v) })} />
                        <TextArea label="Text *" value={form.text} onChange={v => setForm({ ...form, text: v })} />
                        <Input label="Image URL" value={form.image} onChange={v => setForm({ ...form, image: v })} />
                    </Modal>
                )}
            </div>
        );
    };

    // --- GALLERY ---
    const GalleryEditor = () => {
        const [newUrl, setNewUrl] = useState('');
        const [uploading, setUploading] = useState(false);
        const [dragOver, setDragOver] = useState(false);

        const addImage = async () => {
            if (!newUrl.trim()) return;
            await saveSection('gallery', 'add', { url: newUrl.trim() });
            setNewUrl('');
        };

        const removeImage = async (id) => {
            await saveSection('gallery', 'remove', { id });
        };

        const handleFileUpload = async (file) => {
            if (!file) return;
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                alert('Invalid file type. Allowed: JPG, PNG, WebP, GIF');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('File too large. Maximum 5MB.');
                return;
            }

            setUploading(true);
            try {
                const formData = new FormData();
                formData.append('file', file);
                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                const data = await res.json();
                if (res.ok && data.url) {
                    await saveSection('gallery', 'add', { url: data.url });
                } else {
                    alert(data.error || 'Upload failed');
                }
            } catch {
                alert('Upload failed');
            }
            setUploading(false);
        };

        const handleMultipleFiles = async (files) => {
            for (const file of files) {
                await handleFileUpload(file);
            }
        };

        const handleDrop = (e) => {
            e.preventDefault();
            setDragOver(false);
            const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
            if (files.length > 0) handleMultipleFiles(files);
        };

        const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
        const handleDragLeave = (e) => { e.preventDefault(); setDragOver(false); };

        return (
            <div className="space-y-4">
                <h3 className="font-display text-lg text-white">Gallery Images</h3>
                <p className="text-white/40 text-sm">Manage the gallery images shown on the homepage.</p>

                {/* Drag & Drop Zone */}
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => document.getElementById('gallery-file-input').click()}
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
                        ${dragOver
                            ? 'border-gold-400 bg-gold-500/10'
                            : 'border-gold-500/20 hover:border-gold-500/40 hover:bg-gold-500/5'
                        }
                        ${uploading ? 'pointer-events-none opacity-60' : ''}
                    `}
                >
                    <input
                        id="gallery-file-input"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                            const files = Array.from(e.target.files);
                            if (files.length > 0) handleMultipleFiles(files);
                            e.target.value = '';
                        }}
                    />
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
                            <p className="text-gold-400 text-sm font-medium">Uploading...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <Upload className="w-8 h-8 text-gold-500/50" />
                            <p className="text-white/60 text-sm">
                                <span className="text-gold-400 font-medium">Click to browse</span> or drag & drop images here
                            </p>
                            <p className="text-white/30 text-xs">JPG, PNG, WebP, GIF • Max 5MB each</p>
                        </div>
                    )}
                </div>

                {/* URL Input */}
                <div className="flex gap-2">
                    <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="Or paste an image URL..."
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImage())}
                        className="flex-1 px-3 py-2 bg-obsidian-900/50 border border-gold-500/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/30" />
                    <button onClick={addImage}
                        className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-obsidian-950 rounded-lg text-sm font-medium hover:bg-gold-400 transition-colors">
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {(content?.gallery || []).map(img => (
                        <div key={img.id} className="relative group aspect-square overflow-hidden rounded-xl border border-gold-500/10">
                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={() => removeImage(img.id)}
                                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {(content?.gallery || []).length === 0 && (
                    <div className="text-center py-8 text-white/20 text-sm">
                        No gallery images yet. Upload or paste a URL to get started.
                    </div>
                )}
            </div>
        );
    };

    // --- WHY EGYPT (Experiences stored as whyEgypt items) ---
    const WhyEgyptEditor = () => {
        const [whyItems, setWhyItems] = useState([
            { icon: '🏛️', title: 'Historical Wonders', description: 'Over 5,000 years of civilization. From the Great Pyramids to the Valley of the Kings, treasures found nowhere else on Earth.', highlight: '7 UNESCO World Heritage Sites' },
            { icon: '🤝', title: 'Warm Hospitality', description: 'Egypt is renowned for its legendary hospitality. Every traveler is treated as an honored guest, with warmth at every turn.', highlight: 'Among the friendliest nations' },
            { icon: '💎', title: 'Incredible Value', description: 'World-class luxury experiences, private Egyptologist guides, and 5-star service at a fraction of the cost of other destinations.', highlight: 'Full-day tours from just $20' },
        ]);

        // Why Egypt is hardcoded in page.js, so we manage it through hero content
        // For now, we show the editing UI — it gets saved to hero content section
        return (
            <div className="space-y-4">
                <h3 className="font-display text-lg text-white">Why Egypt Section</h3>
                <p className="text-white/40 text-sm">Edit the three feature cards on the homepage.</p>
                {whyItems.map((item, idx) => (
                    <div key={idx} className="bg-obsidian-900/50 border border-gold-500/10 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <input value={item.icon} onChange={e => { const n = [...whyItems]; n[idx].icon = e.target.value; setWhyItems(n); }}
                                className="w-12 px-2 py-1 bg-obsidian-900 border border-gold-500/10 rounded text-center text-xl" />
                            <input value={item.title} onChange={e => { const n = [...whyItems]; n[idx].title = e.target.value; setWhyItems(n); }}
                                className="flex-1 px-3 py-1.5 bg-obsidian-900 border border-gold-500/10 rounded-lg text-white text-sm" />
                        </div>
                        <textarea value={item.description} onChange={e => { const n = [...whyItems]; n[idx].description = e.target.value; setWhyItems(n); }} rows={2}
                            className="w-full px-3 py-2 bg-obsidian-900 border border-gold-500/10 rounded-lg text-white/70 text-sm resize-none" />
                        <input value={item.highlight} onChange={e => { const n = [...whyItems]; n[idx].highlight = e.target.value; setWhyItems(n); }}
                            placeholder="Highlight text"
                            className="w-full px-3 py-1.5 bg-obsidian-900 border border-gold-500/10 rounded-lg text-gold-500 text-xs" />
                    </div>
                ))}
                <button onClick={() => saveSection('hero', null, { whyEgypt: whyItems })}
                    className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-obsidian-950 rounded-lg font-medium text-sm hover:bg-gold-400">
                    <Save className="w-4 h-4" /> Save Why Egypt
                </button>
            </div>
        );
    };

    // --- FAQS ---
    const FaqsEditor = () => {
        const openFaqModal = (f = null) => {
            setEditItem(f);
            setModalType('faq');
            setForm(f ? { ...f } : { question: '', answer: '' });
            setShowModal(true);
        };

        const saveFaq = async () => {
            if (editItem) {
                await saveSection('faqs', 'update', { id: editItem.id, ...form });
            } else {
                await saveSection('faqs', 'create', form);
            }
            setShowModal(false);
        };

        const deleteFaq = async (id) => {
            if (!confirm('Delete this FAQ?')) return;
            await saveSection('faqs', 'delete', { id });
        };

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-display text-lg text-white">FAQs</h3>
                        <p className="text-white/40 text-sm">{content?.faqs?.length || 0} questions</p>
                    </div>
                    <button onClick={() => openFaqModal()}
                        className="flex items-center gap-2 px-3 py-2 bg-gold-500 text-obsidian-950 rounded-lg text-sm font-medium hover:bg-gold-400">
                        <Plus className="w-4 h-4" /> Add FAQ
                    </button>
                </div>
                <div className="space-y-3">
                    {(content?.faqs || []).map(faq => (
                        <div key={faq.id} className="bg-obsidian-900/50 border border-gold-500/10 rounded-xl p-4">
                            <div className="flex justify-between items-start gap-3">
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white text-sm font-medium">{faq.question}</h4>
                                    <p className="text-white/40 text-xs mt-1 line-clamp-2">{faq.answer}</p>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => openFaqModal(faq)} className="p-1.5 text-gold-400/60 hover:text-gold-400 hover:bg-gold-500/10 rounded-lg"><Edit2 className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => deleteFaq(faq.id)} className="p-1.5 text-red-400/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {showModal && modalType === 'faq' && (
                    <Modal title={editItem ? 'Edit FAQ' : 'Add FAQ'} onClose={() => setShowModal(false)} onSave={saveFaq}>
                        <Input label="Question *" value={form.question} onChange={v => setForm({ ...form, question: v })} />
                        <TextArea label="Answer *" value={form.answer} onChange={v => setForm({ ...form, answer: v })} rows={4} />
                    </Modal>
                )}
            </div>
        );
    };

    // --- EXPERIENCES ---
    const ExperiencesEditor = () => {
        const [expForms, setExpForms] = useState(content?.experiences || []);

        const updateExp = (idx, field, value) => {
            const updated = [...expForms];
            updated[idx] = { ...updated[idx], [field]: value };
            setExpForms(updated);
        };

        const saveExp = async (exp) => {
            await saveSection('experiences', null, { id: exp.id, ...exp });
        };

        return (
            <div className="space-y-4">
                <h3 className="font-display text-lg text-white">Experience Levels</h3>
                <p className="text-white/40 text-sm">Edit the Explorer, Royal, and Pharaoh experience cards.</p>
                {expForms.map((exp, idx) => (
                    <div key={exp.id} className="bg-obsidian-900/50 border border-gold-500/10 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{exp.icon}</span>
                            <h4 className="font-display text-white text-lg">{exp.name}</h4>
                        </div>
                        <Input label="Tagline" value={exp.tagline} onChange={v => updateExp(idx, 'tagline', v)} />
                        <TextArea label="Description" value={exp.description} onChange={v => updateExp(idx, 'description', v)} rows={2} />
                        <Input label="Price Multiplier" type="number" step="0.1" value={exp.priceMultiplier} onChange={v => updateExp(idx, 'priceMultiplier', parseFloat(v))} />
                        <div>
                            <label className="text-white/50 text-xs mb-1 block">Features (comma-separated)</label>
                            <textarea value={(exp.features || []).join(', ')} onChange={e => updateExp(idx, 'features', e.target.value.split(',').map(f => f.trim()).filter(Boolean))} rows={2}
                                className="w-full px-3 py-2 bg-obsidian-900 border border-gold-500/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/30 resize-none" />
                        </div>
                        <button onClick={() => saveExp(expForms[idx])}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gold-500/20 text-gold-400 rounded-lg text-xs font-medium hover:bg-gold-500/30">
                            <Save className="w-3 h-3" /> Save {exp.name}
                        </button>
                    </div>
                ))}
            </div>
        );
    };

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
            <div>
                <h1 className="font-display text-2xl text-white flex items-center gap-3">
                    <FileText className="w-7 h-7 text-gold-500" />
                    Content Manager
                </h1>
                <p className="text-white/40 text-sm mt-1">Manage all website content sections.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                            ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                            : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-obsidian-900/30 border border-gold-500/10 rounded-2xl p-6">
                {activeTab === 'hero' && <HeroEditor />}
                {activeTab === 'stats' && <StatsEditor />}
                {activeTab === 'testimonials' && <TestimonialsEditor />}
                {activeTab === 'gallery' && <GalleryEditor />}
                {activeTab === 'whyegypt' && <WhyEgyptEditor />}
                {activeTab === 'faqs' && <FaqsEditor />}
                {activeTab === 'experiences' && <ExperiencesEditor />}
            </div>
        </div>
    );
}

// --- Reusable form components ---
function Input({ label, value, onChange, type = 'text', ...props }) {
    return (
        <div>
            <label className="text-white/50 text-xs mb-1 block">{label}</label>
            <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} {...props}
                className="w-full px-3 py-2 bg-obsidian-900/50 border border-gold-500/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/30" />
        </div>
    );
}

function TextArea({ label, value, onChange, rows = 3, ...props }) {
    return (
        <div>
            <label className="text-white/50 text-xs mb-1 block">{label}</label>
            <textarea rows={rows} value={value || ''} onChange={e => onChange(e.target.value)} {...props}
                className="w-full px-3 py-2 bg-obsidian-900/50 border border-gold-500/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/30 resize-none" />
        </div>
    );
}

function Modal({ title, onClose, onSave, children }) {
    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="bg-obsidian-950 border border-gold-500/20 rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-display text-xl text-white">{title}</h2>
                    <button onClick={onClose} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4">{children}</div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-white/40 hover:text-white text-sm rounded-lg">Cancel</button>
                    <button onClick={onSave} className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-obsidian-950 rounded-lg font-medium text-sm hover:bg-gold-400">
                        <Save className="w-4 h-4" /> Save
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
