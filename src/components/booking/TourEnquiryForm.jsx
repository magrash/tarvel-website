'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, AlertCircle } from 'lucide-react';

export default function TourEnquiryForm({ tour }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        country: '',
        adults: 1,
        children: 0,
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would send to an API
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-scarab-500/20 border border-scarab-500/40 flex items-center justify-center"
                >
                    <Check className="w-8 h-8 text-scarab-400" />
                </motion.div>
                <h3 className="font-display text-xl text-white mb-2">Enquiry Sent!</h3>
                <p className="text-white/60 text-sm">
                    Our team will respond to your enquiry within 24 hours.
                </p>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <input
                type="text"
                placeholder="Full Name *"
                required
                className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
                type="email"
                placeholder="Email Address *"
                required
                className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
                <input
                    type="tel"
                    placeholder="Phone Number"
                    className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <select
                    className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none bg-transparent"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                >
                    <option value="" className="bg-obsidian-900">Country</option>
                    <option value="US" className="bg-obsidian-900">United States</option>
                    <option value="UK" className="bg-obsidian-900">United Kingdom</option>
                    <option value="DE" className="bg-obsidian-900">Germany</option>
                    <option value="FR" className="bg-obsidian-900">France</option>
                    <option value="IT" className="bg-obsidian-900">Italy</option>
                    <option value="ES" className="bg-obsidian-900">Spain</option>
                    <option value="AU" className="bg-obsidian-900">Australia</option>
                    <option value="JP" className="bg-obsidian-900">Japan</option>
                    <option value="EG" className="bg-obsidian-900">Egypt</option>
                    <option value="OTHER" className="bg-obsidian-900">Other</option>
                </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-white/40 text-xs mb-1 block">Adults</label>
                    <input
                        type="number"
                        min="1"
                        max="20"
                        className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none"
                        value={formData.adults}
                        onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) || 1 })}
                    />
                </div>
                <div>
                    <label className="text-white/40 text-xs mb-1 block">Children</label>
                    <input
                        type="number"
                        min="0"
                        max="10"
                        className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none"
                        value={formData.children}
                        onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) || 0 })}
                    />
                </div>
            </div>
            <textarea
                placeholder="Your message or questions..."
                rows={4}
                className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none resize-none"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
            <motion.button
                type="submit"
                className="w-full py-3.5 rounded-xl font-display font-semibold text-sm uppercase tracking-wider
                    bg-gradient-to-r from-scarab-500 to-scarab-600 text-white
                    hover:from-scarab-400 hover:to-scarab-500
                    shadow-[0_0_20px_rgba(20,184,166,0.2)]
                    transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
            >
                <span className="flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Enquiry
                </span>
            </motion.button>
        </form>
    );
}
