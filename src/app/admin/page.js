'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign, Users, Map, CalendarCheck,
    TrendingUp, Clock, CheckCircle, AlertCircle,
    CreditCard, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [recentBookings, setRecentBookings] = useState([]);
    const [recentPayments, setRecentPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = () => {
        const token = localStorage.getItem('admin_token');
        if (!token) return;

        Promise.all([
            fetch('/api/admin/stats', {
                headers: { Authorization: `Bearer ${token}` },
            }).then(r => r.json()),
            fetch('/api/admin/bookings', {
                headers: { Authorization: `Bearer ${token}` },
            }).then(r => r.json()),
            fetch('/api/admin/payments', {
                headers: { Authorization: `Bearer ${token}` },
            }).then(r => r.json()),
        ])
            .then(([statsData, bookingsData, paymentsData]) => {
                setStats(statsData.stats || {});
                setRecentBookings((bookingsData.bookings || []).slice(0, 8));
                setRecentPayments((paymentsData.payments || []).slice(0, 5));
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const kpiCards = stats ? [
        {
            label: 'Total Revenue',
            value: `$${(stats.totalRevenue || 0).toLocaleString()}`,
            icon: DollarSign,
            color: 'from-gold-500/20 to-gold-600/20',
            border: 'border-gold-500/30',
            iconColor: 'text-gold-400',
        },
        {
            label: 'Total Bookings',
            value: stats.totalBookings || 0,
            icon: CalendarCheck,
            color: 'from-scarab-500/20 to-scarab-600/20',
            border: 'border-scarab-500/30',
            iconColor: 'text-scarab-400',
        },
        {
            label: 'Pending',
            value: stats.pendingBookings || 0,
            icon: Clock,
            color: 'from-yellow-500/20 to-yellow-600/20',
            border: 'border-yellow-500/30',
            iconColor: 'text-yellow-400',
        },
        {
            label: 'Confirmed',
            value: stats.confirmedBookings || 0,
            icon: CheckCircle,
            color: 'from-green-500/20 to-green-600/20',
            border: 'border-green-500/30',
            iconColor: 'text-green-400',
        },
        {
            label: 'Active Tours',
            value: stats.totalTours || 0,
            icon: Map,
            color: 'from-blue-500/20 to-blue-600/20',
            border: 'border-blue-500/30',
            iconColor: 'text-blue-400',
        },
        {
            label: 'Payments',
            value: stats.totalPayments || 0,
            icon: CreditCard,
            color: 'from-purple-500/20 to-purple-600/20',
            border: 'border-purple-500/30',
            iconColor: 'text-purple-400',
        },
    ] : [];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-3xl text-white">Dashboard</h1>
                    <p className="text-white/40 text-sm mt-1">Overview of your travel booking platform</p>
                </div>
                <div className="flex items-center gap-2 text-white/20 text-xs">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Live — auto-refreshes every 30s
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {kpiCards.map((kpi, i) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`rounded-xl p-4 border ${kpi.border}
                            bg-gradient-to-br ${kpi.color} backdrop-blur-xl`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <kpi.icon className={`w-5 h-5 ${kpi.iconColor}`} />
                        </div>
                        <div className="font-display text-2xl text-white">{kpi.value}</div>
                        <div className="text-white/40 text-xs mt-1">{kpi.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Bookings */}
                <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-gold-500/10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-display text-xl text-white">Recent Bookings</h2>
                        <Link href="/admin/bookings" className="text-gold-500 hover:text-gold-400 text-sm flex items-center gap-1">
                            View All <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>

                    {recentBookings.length === 0 ? (
                        <div className="text-center py-12">
                            <AlertCircle className="w-8 h-8 text-white/20 mx-auto mb-3" />
                            <p className="text-white/40 text-sm">No bookings yet</p>
                            <p className="text-white/20 text-xs mt-1">Bookings will appear here once customers start booking tours</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gold-500/10">
                                        <th className="text-left py-3 px-4 text-white/40 text-xs uppercase tracking-wider">ID</th>
                                        <th className="text-left py-3 px-4 text-white/40 text-xs uppercase tracking-wider">Tour</th>
                                        <th className="text-left py-3 px-4 text-white/40 text-xs uppercase tracking-wider">Date</th>
                                        <th className="text-left py-3 px-4 text-white/40 text-xs uppercase tracking-wider">Amount</th>
                                        <th className="text-left py-3 px-4 text-white/40 text-xs uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBookings.map((booking, i) => (
                                        <motion.tr
                                            key={booking.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="border-b border-white/5 hover:bg-white/[0.02]"
                                        >
                                            <td className="py-3 px-4 text-gold-400/80 text-sm font-mono">{booking.id}</td>
                                            <td className="py-3 px-4 text-white text-sm max-w-[200px] truncate">{booking.tourTitle}</td>
                                            <td className="py-3 px-4 text-white/60 text-sm">{booking.selectedDate}</td>
                                            <td className="py-3 px-4 text-gold-400 text-sm font-medium">${booking.totalPrice}</td>
                                            <td className="py-3 px-4">
                                                <StatusBadge status={booking.bookingStatus} />
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Recent Payments */}
                <div className="glass-card rounded-2xl p-6 border border-gold-500/10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-display text-lg text-white">Recent Payments</h2>
                        <Link href="/admin/payments" className="text-gold-500 hover:text-gold-400 text-sm flex items-center gap-1">
                            View All <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>

                    {recentPayments.length === 0 ? (
                        <div className="text-center py-8">
                            <CreditCard className="w-7 h-7 text-white/15 mx-auto mb-3" />
                            <p className="text-white/40 text-sm">No payments yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentPayments.map((payment, i) => (
                                <motion.div
                                    key={payment.id}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5"
                                >
                                    <div>
                                        <div className="text-white text-sm font-mono">{payment.id}</div>
                                        <div className="text-white/30 text-xs mt-0.5 capitalize">{payment.provider || 'N/A'}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-gold-400 text-sm font-medium">${payment.amount}</div>
                                        <PaymentBadge status={payment.status} />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/admin/tours">
                    <motion.div
                        className="glass-card rounded-xl p-5 border border-blue-500/10 hover:border-blue-500/30 transition-all cursor-pointer group"
                        whileHover={{ scale: 1.02, y: -2 }}
                    >
                        <Map className="w-6 h-6 text-blue-400 mb-3" />
                        <div className="text-white font-medium text-sm">Manage Tours</div>
                        <div className="text-white/30 text-xs mt-1">Create, edit, and toggle tours</div>
                    </motion.div>
                </Link>
                <Link href="/admin/bookings">
                    <motion.div
                        className="glass-card rounded-xl p-5 border border-green-500/10 hover:border-green-500/30 transition-all cursor-pointer group"
                        whileHover={{ scale: 1.02, y: -2 }}
                    >
                        <CalendarCheck className="w-6 h-6 text-green-400 mb-3" />
                        <div className="text-white font-medium text-sm">View Bookings</div>
                        <div className="text-white/30 text-xs mt-1">Review and manage all bookings</div>
                    </motion.div>
                </Link>
                <Link href="/admin/settings">
                    <motion.div
                        className="glass-card rounded-xl p-5 border border-gold-500/10 hover:border-gold-500/30 transition-all cursor-pointer group"
                        whileHover={{ scale: 1.02, y: -2 }}
                    >
                        <TrendingUp className="w-6 h-6 text-gold-400 mb-3" />
                        <div className="text-white font-medium text-sm">Settings</div>
                        <div className="text-white/30 text-xs mt-1">Update site and admin settings</div>
                    </motion.div>
                </Link>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        confirmed: 'bg-green-500/10 text-green-400 border-green-500/30',
        completed: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs border ${styles[status] || styles.pending}`}>
            {status}
        </span>
    );
}

function PaymentBadge({ status }) {
    const styles = {
        pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        completed: 'bg-green-500/10 text-green-400 border-green-500/30',
        failed: 'bg-red-500/10 text-red-400 border-red-500/30',
    };

    return (
        <span className={`px-1.5 py-0.5 rounded-full text-[10px] border ${styles[status] || 'bg-white/5 text-white/40 border-white/10'}`}>
            {status || 'pending'}
        </span>
    );
}
