'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            localStorage.setItem('admin_token', data.token);
            localStorage.setItem('admin_user', JSON.stringify(data.user));
            router.push('/admin');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-obsidian-950 flex items-center justify-center p-4"
            style={{
                backgroundImage: 'radial-gradient(ellipse at 50% 30%, rgba(218,165,32,0.08) 0%, transparent 60%)',
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                className="w-full max-w-md"
            >
                {/* Logo / Branding */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                        className="text-5xl mb-4"
                    >
                        𓃭
                    </motion.div>
                    <h1 className="font-display text-3xl text-white mb-1">Admin Portal</h1>
                    <p className="text-white/40 text-sm">Goba Travel Management System</p>
                </div>

                {/* Login Form */}
                <div className="glass-card rounded-2xl p-8 border border-gold-500/20
                    shadow-[0_0_60px_rgba(218,165,32,0.1)]"
                >
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="glass-input w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none"
                                    placeholder="admin@goba.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="glass-input w-full pl-10 pr-12 py-3 rounded-xl text-white text-sm outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                            >
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-xl font-display font-semibold text-sm uppercase tracking-wider
                                bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950
                                hover:from-gold-400 hover:to-gold-500
                                shadow-[0_0_30px_rgba(218,165,32,0.3)]
                                transition-all duration-300 disabled:opacity-50"
                            whileHover={!isLoading ? { scale: 1.02, y: -2 } : {}}
                            whileTap={!isLoading ? { scale: 0.98 } : {}}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Authenticating...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </motion.button>
                    </form>
                </div>

                <p className="text-center text-white/20 text-xs mt-6">
                    Secure Admin Access · Goba Travel © 2026
                </p>
            </motion.div>
        </div>
    );
}
