'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Save, Loader2, User, Mail, Lock, Globe,
    MessageCircle, Check, Settings as SettingsIcon
} from 'lucide-react';

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    const [profile, setProfile] = useState({ name: '', email: '' });
    const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
    const [settings, setSettings] = useState({
        siteName: '',
        contactEmail: '',
        whatsappNumber: '',
        currency: 'USD',
    });

    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

    useEffect(() => {
        if (!token) return;
        fetch('/api/admin/settings', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(data => {
                if (data.admin) setProfile({ name: data.admin.name, email: data.admin.email });
                if (data.settings) setSettings(data.settings);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [token]);

    const handleSave = async (section) => {
        setSaving(true);
        setSaved(false);

        try {
            const body = {};

            if (section === 'profile') {
                body.profile = { name: profile.name, email: profile.email };
            }
            if (section === 'password') {
                if (password.new !== password.confirm) {
                    alert('Passwords do not match');
                    setSaving(false);
                    return;
                }
                if (password.new.length < 6) {
                    alert('Password must be at least 6 characters');
                    setSaving(false);
                    return;
                }
                body.profile = { password: password.new };
            }
            if (section === 'settings') {
                body.settings = settings;
            }

            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setSaved(true);
                if (section === 'password') {
                    setPassword({ current: '', new: '', confirm: '' });
                }
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'site', label: 'Site Settings', icon: Globe },
        { id: 'security', label: 'Security', icon: Lock },
    ];

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
            <div>
                <h1 className="font-display text-3xl text-white">Settings</h1>
                <p className="text-white/40 text-sm mt-1">Manage your admin profile and site configuration</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gold-500/10 pb-px">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all rounded-t-lg
                            ${activeTab === tab.id
                                ? 'text-gold-400 border-b-2 border-gold-500 bg-gold-500/5'
                                : 'text-white/40 hover:text-white/60'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Success Message */}
            {saved && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm"
                >
                    <Check className="w-4 h-4" />
                    Settings saved successfully!
                </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-6 border border-gold-500/10 max-w-2xl"
                >
                    <h2 className="font-display text-xl text-white mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-gold-500" />
                        Admin Profile
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-white/50 text-xs uppercase tracking-wider mb-1">Name</label>
                            <input
                                value={profile.name}
                                onChange={e => setProfile({ ...profile, name: e.target.value })}
                                className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-white/50 text-xs uppercase tracking-wider mb-1">Email</label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={e => setProfile({ ...profile, email: e.target.value })}
                                className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none"
                            />
                        </div>
                        <div className="pt-4 border-t border-gold-500/10">
                            <motion.button
                                onClick={() => handleSave('profile')}
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-semibold text-sm disabled:opacity-50"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Profile
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Site Settings Tab */}
            {activeTab === 'site' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-6 border border-gold-500/10 max-w-2xl"
                >
                    <h2 className="font-display text-xl text-white mb-6 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-gold-500" />
                        Site Configuration
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-white/50 text-xs uppercase tracking-wider mb-1">Site Name</label>
                            <input
                                value={settings.siteName}
                                onChange={e => setSettings({ ...settings, siteName: e.target.value })}
                                className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-white/50 text-xs uppercase tracking-wider mb-1">Contact Email</label>
                            <input
                                type="email"
                                value={settings.contactEmail}
                                onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
                                className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-white/50 text-xs uppercase tracking-wider mb-1">
                                <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> WhatsApp Number</span>
                            </label>
                            <input
                                value={settings.whatsappNumber}
                                onChange={e => setSettings({ ...settings, whatsappNumber: e.target.value })}
                                placeholder="+20 1XX XXX XXXX"
                                className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-white/50 text-xs uppercase tracking-wider mb-1">Currency</label>
                            <select
                                value={settings.currency}
                                onChange={e => setSettings({ ...settings, currency: e.target.value })}
                                className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none bg-transparent"
                            >
                                <option value="USD" className="bg-obsidian-900">USD ($)</option>
                                <option value="EUR" className="bg-obsidian-900">EUR (€)</option>
                                <option value="EGP" className="bg-obsidian-900">EGP (E£)</option>
                            </select>
                        </div>
                        <div className="pt-4 border-t border-gold-500/10">
                            <motion.button
                                onClick={() => handleSave('settings')}
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-semibold text-sm disabled:opacity-50"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Settings
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-6 border border-gold-500/10 max-w-2xl"
                >
                    <h2 className="font-display text-xl text-white mb-6 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-gold-500" />
                        Change Password
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-white/50 text-xs uppercase tracking-wider mb-1">New Password</label>
                            <input
                                type="password"
                                value={password.new}
                                onChange={e => setPassword({ ...password, new: e.target.value })}
                                placeholder="Min 6 characters"
                                className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-white/50 text-xs uppercase tracking-wider mb-1">Confirm Password</label>
                            <input
                                type="password"
                                value={password.confirm}
                                onChange={e => setPassword({ ...password, confirm: e.target.value })}
                                className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none"
                            />
                        </div>
                        <div className="pt-4 border-t border-gold-500/10">
                            <motion.button
                                onClick={() => handleSave('password')}
                                disabled={saving || !password.new}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-sm disabled:opacity-50"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                Update Password
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
