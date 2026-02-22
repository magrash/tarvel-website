'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search, Filter, Download, ChevronDown,
    Calendar, ArrowUpDown
} from 'lucide-react';

const STATUSES = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];
const PAYMENT_STATUSES = ['all', 'unpaid', 'paid', 'failed'];

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [search, setSearch] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

    const fetchBookings = async () => {
        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.set('status', statusFilter);
            if (paymentFilter !== 'all') params.set('paymentStatus', paymentFilter);
            if (dateFrom) params.set('dateFrom', dateFrom);
            if (dateTo) params.set('dateTo', dateTo);

            const res = await fetch(`/api/admin/bookings?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setBookings(data.bookings || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (token) fetchBookings(); }, [token, statusFilter, paymentFilter, dateFrom, dateTo]);

    const handleStatusUpdate = async (bookingId, newStatus) => {
        setUpdatingId(bookingId);
        try {
            await fetch('/api/admin/bookings', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ bookingId, bookingStatus: newStatus }),
            });
            fetchBookings();
        } catch (err) {
            console.error(err);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (statusFilter !== 'all') params.set('status', statusFilter);
        if (dateFrom) params.set('dateFrom', dateFrom);
        if (dateTo) params.set('dateTo', dateTo);

        window.open(`/api/admin/bookings/export?${params.toString()}&token=${token}`, '_blank');
    };

    const filtered = bookings.filter(b => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            b.id?.toLowerCase().includes(q) ||
            b.tourTitle?.toLowerCase().includes(q) ||
            b.customerInfo?.name?.toLowerCase().includes(q) ||
            b.customerInfo?.email?.toLowerCase().includes(q)
        );
    });

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
                    <h1 className="font-display text-3xl text-white">Bookings</h1>
                    <p className="text-white/40 text-sm mt-1">{bookings.length} total bookings</p>
                </div>
                <motion.button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card border border-gold-500/20 text-gold-400 hover:text-gold-300 text-sm transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </motion.button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search bookings..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-white text-sm outline-none"
                    />
                </div>

                {/* Status Filter */}
                <div className="relative">
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="glass-input px-4 py-2.5 rounded-xl text-white text-sm outline-none bg-transparent appearance-none pr-8 min-w-[130px]"
                    >
                        {STATUSES.map(s => (
                            <option key={s} value={s} className="bg-obsidian-900">
                                {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                </div>

                {/* Payment Filter */}
                <div className="relative">
                    <select
                        value={paymentFilter}
                        onChange={e => setPaymentFilter(e.target.value)}
                        className="glass-input px-4 py-2.5 rounded-xl text-white text-sm outline-none bg-transparent appearance-none pr-8 min-w-[130px]"
                    >
                        {PAYMENT_STATUSES.map(s => (
                            <option key={s} value={s} className="bg-obsidian-900">
                                {s === 'all' ? 'All Payments' : s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                </div>

                {/* Date Range */}
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white/30" />
                    <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                        className="glass-input px-3 py-2 rounded-lg text-white text-sm outline-none bg-transparent" />
                    <span className="text-white/30">to</span>
                    <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                        className="glass-input px-3 py-2 rounded-lg text-white text-sm outline-none bg-transparent" />
                </div>
            </div>

            {/* Bookings Table */}
            <div className="glass-card rounded-2xl border border-gold-500/10 overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <Calendar className="w-10 h-10 text-white/15 mx-auto mb-3" />
                        <p className="text-white/40 text-sm">No bookings found</p>
                        <p className="text-white/20 text-xs mt-1">Try adjusting your filters or wait for new bookings</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gold-500/10 bg-white/[0.02]">
                                    <th className="text-left py-3 px-4 text-white/40 text-xs uppercase tracking-wider">ID</th>
                                    <th className="text-left py-3 px-4 text-white/40 text-xs uppercase tracking-wider">Tour</th>
                                    <th className="text-left py-3 px-4 text-white/40 text-xs uppercase tracking-wider">Customer</th>
                                    <th className="text-left py-3 px-4 text-white/40 text-xs uppercase tracking-wider">Date</th>
                                    <th className="text-left py-3 px-4 text-white/40 text-xs uppercase tracking-wider">Guests</th>
                                    <th className="text-left py-3 px-4 text-white/40 text-xs uppercase tracking-wider">Amount</th>
                                    <th className="text-left py-3 px-4 text-white/40 text-xs uppercase tracking-wider">Payment</th>
                                    <th className="text-left py-3 px-4 text-white/40 text-xs uppercase tracking-wider">Status</th>
                                    <th className="text-left py-3 px-4 text-white/40 text-xs uppercase tracking-wider">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((booking, i) => (
                                    <motion.tr
                                        key={booking.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.02 }}
                                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="py-3 px-4 text-gold-400/80 text-sm font-mono">{booking.id}</td>
                                        <td className="py-3 px-4 text-white text-sm max-w-[180px] truncate">{booking.tourTitle}</td>
                                        <td className="py-3 px-4">
                                            <div className="text-white text-sm">{booking.customerInfo?.name}</div>
                                            <div className="text-white/30 text-xs">{booking.customerInfo?.email}</div>
                                        </td>
                                        <td className="py-3 px-4 text-white/60 text-sm">{booking.selectedDate}</td>
                                        <td className="py-3 px-4 text-white/60 text-sm text-center">{booking.guestsCount}</td>
                                        <td className="py-3 px-4 text-gold-400 text-sm font-medium">${booking.totalPrice}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs border ${booking.paymentStatus === 'paid'
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/30'
                                                    : 'bg-white/5 text-white/40 border-white/10'
                                                }`}>
                                                {booking.paymentStatus || 'unpaid'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <select
                                                value={booking.bookingStatus}
                                                onChange={e => handleStatusUpdate(booking.id, e.target.value)}
                                                disabled={updatingId === booking.id}
                                                className={`px-2 py-1 rounded-lg text-xs outline-none bg-transparent border ${booking.bookingStatus === 'confirmed' ? 'border-green-500/30 text-green-400' :
                                                        booking.bookingStatus === 'completed' ? 'border-blue-500/30 text-blue-400' :
                                                            booking.bookingStatus === 'cancelled' ? 'border-red-500/30 text-red-400' :
                                                                'border-yellow-500/30 text-yellow-400'
                                                    }`}
                                            >
                                                {['pending', 'confirmed', 'completed', 'cancelled'].map(s => (
                                                    <option key={s} value={s} className="bg-obsidian-900">
                                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-3 px-4 text-white/30 text-xs">
                                            {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : '-'}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
