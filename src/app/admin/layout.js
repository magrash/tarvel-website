'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Map, CalendarCheck, LogOut,
    Menu, X, ChevronRight, DollarSign, Settings,
    Globe, FileText
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Tours', href: '/admin/tours', icon: Map },
    { label: 'Destinations', href: '/admin/destinations', icon: Globe },
    { label: 'Content', href: '/admin/content', icon: FileText },
    { label: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
    { label: 'Payments', href: '/admin/payments', icon: DollarSign },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
];


export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    // Skip layout for login page
    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (isLoginPage) {
            setAuthChecked(true);
            return;
        }

        const token = localStorage.getItem('admin_token');
        const savedUser = localStorage.getItem('admin_user');

        if (!token) {
            router.push('/admin/login');
            return;
        }

        // Verify token
        fetch('/api/admin/verify', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) throw new Error('Invalid token');
                return res.json();
            })
            .then(data => {
                setUser(data.user);
                setAuthChecked(true);
            })
            .catch(() => {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                router.push('/admin/login');
            });
    }, [pathname, router, isLoginPage]);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        router.push('/admin/login');
    };

    if (isLoginPage) return <>{children}</>;

    if (!authChecked) {
        return (
            <div className="min-h-screen bg-obsidian-950 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="text-4xl text-gold-500"
                >
                    𓂀
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-obsidian-950 flex">
            {/* Desktop Sidebar */}
            <motion.aside
                className="hidden lg:flex flex-col"
                animate={{ width: sidebarOpen ? 260 : 72 }}
                transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            >
                <div className="h-full flex flex-col border-r border-gold-500/10
                    bg-obsidian-950/80 backdrop-blur-xl"
                >
                    {/* Logo */}
                    <div className="p-4 border-b border-gold-500/10 flex items-center gap-3">
                        <span className="text-2xl">𓃭</span>
                        <AnimatePresence>
                            {sidebarOpen && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                >
                                    <div className="font-display text-lg text-gold-500">Goba</div>
                                    <div className="text-white/30 text-xs -mt-1">Admin Panel</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Toggle */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="absolute -right-3 top-16 w-6 h-6 rounded-full
                            bg-obsidian-900 border border-gold-500/20 text-gold-500/60
                            hover:text-gold-400 hover:border-gold-500/40
                            flex items-center justify-center z-50 hidden lg:flex"
                    >
                        <ChevronRight className={`w-3 h-3 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Nav */}
                    <nav className="flex-1 p-3 space-y-1">
                        {navItems.map(item => {
                            const isActive = pathname === item.href;
                            return (
                                <Link href={item.href} key={item.href}>
                                    <motion.div
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                                            ${isActive
                                                ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                                                : 'text-white/50 hover:text-white hover:bg-white/5'
                                            }`}
                                        whileHover={{ x: 2 }}
                                    >
                                        <item.icon className="w-5 h-5 flex-shrink-0" />
                                        <AnimatePresence>
                                            {sidebarOpen && (
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="text-sm font-medium whitespace-nowrap"
                                                >
                                                    {item.label}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User / Logout */}
                    <div className="p-3 border-t border-gold-500/10">
                        {sidebarOpen && user && (
                            <div className="px-3 py-2 mb-2">
                                <div className="text-white text-sm">{user.name}</div>
                                <div className="text-white/30 text-xs">{user.email}</div>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
                                text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            {sidebarOpen && <span className="text-sm">Logout</span>}
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50
                bg-obsidian-950/90 backdrop-blur-xl border-b border-gold-500/10 px-4 py-3"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">𓃭</span>
                        <span className="font-display text-gold-500">Admin</span>
                    </div>
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white/60">
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.nav
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 space-y-1"
                        >
                            {navItems.map(item => (
                                <Link
                                    href={item.href}
                                    key={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl
                                        ${pathname === item.href
                                            ? 'bg-gold-500/10 text-gold-400'
                                            : 'text-white/50'
                                        }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="text-sm">{item.label}</span>
                                    </div>
                                </Link>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-3 py-2.5 text-red-400/60 hover:text-red-400"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="text-sm">Logout</span>
                            </button>
                        </motion.nav>
                    )}
                </AnimatePresence>
            </div>

            {/* Main Content */}
            <main className="flex-1 lg:overflow-y-auto">
                <div className="lg:p-8 p-4 pt-20 lg:pt-8 min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
}
