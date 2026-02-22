'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard, Search, ChevronDown, Filter, DollarSign
} from 'lucide-react';

const STATUS_FILTERS = ['all', 'pending', 'completed', 'failed'];
const PROVIDER_FILTERS = ['all', 'stripe', 'paypal', 'cash', 'pay-later'];

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [providerFilter, setProviderFilter] = useState('all');
    const [search, setSearch] = useState('');

    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

    const fetchPayments = async () => {
        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.set('status', statusFilter);
            if (providerFilter !== 'all') params.set('provider', providerFilter);

            const res = await fetch(`/api/admin/payments?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setPayments(data.payments || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (token) fetchPayments(); }, [token, statusFilter, providerFilter]);

    const filtered = payments.filter(p => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            p.id?.toLowerCase().includes(q) ||
            p.bookingId?.toLowerCase().includes(q) ||
            p.provider?.toLowerCase().includes(q)
        );
    });

    const totalAmount = filtered.reduce((sum, p) => sum + (p.amount || 0), 0);
    const completedAmount = filtered
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

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
                <h1 className="font-display text-3xl text-white">Payments</h1>
                <p className="text-white/40 text-sm mt-1">{payments.length} total payments</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl p-4 border border-gold-500/20 bg-gradient-to-br from-gold-500/10 to-gold-600/10">
                    <DollarSign className="w-5 h-5 text-gold-400 mb-2" />
                    <div className="font-display text-2xl text-white">${totalAmount.toLocaleString()}</div>
                    <div className="text-white/40 text-xs mt-1">Total Amount</div>
                </div>
                <div className="rounded-xl p-4 border border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-600/10">
                    <CreditCard className="w-5 h-5 text-green-400 mb-2" />
                    <div className="font-display text-2xl text-white">${completedAmount.toLocaleString()}</div>
                    <div className="text-white/40 text-xs mt-1">Completed Payments</div>
                </div>
                <div className="rounded-xl p-4 border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10">
                    <Filter className="w-5 h-5 text-yellow-400 mb-2" />
                    <div className="font-display text-2xl text-white">{filtered.length}</div>
                    <div className="text-white/40 text-xs mt-1">Filtered Results</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search by ID, booking ID, or provider..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-white text-sm outline-none"
                    />
                </div>

                <div className="relative">
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="glass-input px-4 py-2.5 rounded-xl text-white text-sm outline-none bg-transparent appearance-none pr-8 min-w-[130px]"
                    >
                        {STATUS_FILTERS.map(s => (
                            <option key={s} value={s} className="bg-obsidian-900">
                                {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                </div>

                <div className="relative">
                    <select
                        value={providerFilter}
                        onChange={e => setProviderFilter(e.target.value)}
                        className="glass-input px-4 py-2.5 rounded-xl text-white text-sm outline-none bg-transparent appearance-none pr-8 min-w-[130px]"
                    >
                        {PROVIDER_FILTERS.map(s => (
                            <option key={s} value={s} className="bg-obsidian-900">
                                {s === 'all' ? 'All Providers' : s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                </div>
            </div>

            {/* Payments Table */}
            <div className="glass-card rounded-2xl border border-gold-500/10 overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <CreditCard className="w-10 h-10 text-white/15 mx-auto mb-3" />
                        <p className="text-white/40 text-sm">No payments found</p>
                        <p className="text-white/20 text-xs mt-1">Payments will appear here after customers complete checkout</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gold-500/10 bg-white/[0.02]">
                                    <th className="text-left py-3 px-4 text-white/40 text-xs uppercase tracking-wider">Payment ID</th>
                                    <th className="text-left py-3 px-4 text-white/40 text-xs uppercase tracking-wider">Booking</th>
                                    <th className="text-left py-3 px-4 text-white/40 text-xs uppercase tracking-wider">Provider</th>
                                    <th className="text-left py-3 px-4 text-white/40 text-xs uppercase tracking-wider">Amount</th>
                                    <th className="text-left py-3 px-4 text-white/40 text-xs uppercase tracking-wider">Status</th>
                                    <th className="text-left py-3 px-4 text-white/40 text-xs uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((payment, i) => (
                                    <motion.tr
                                        key={payment.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.02 }}
                                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="py-3 px-4 text-gold-400/80 text-sm font-mono">{payment.id}</td>
                                        <td className="py-3 px-4 text-white/60 text-sm font-mono">{payment.bookingId}</td>
                                        <td className="py-3 px-4">
                                            <ProviderBadge provider={payment.provider} />
                                        </td>
                                        <td className="py-3 px-4 text-gold-400 text-sm font-medium">${payment.amount}</td>
                                        <td className="py-3 px-4">
                                            <StatusBadge status={payment.status} />
                                        </td>
                                        <td className="py-3 px-4 text-white/30 text-xs">
                                            {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : '-'}
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

function StatusBadge({ status }) {
    const styles = {
        pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        completed: 'bg-green-500/10 text-green-400 border-green-500/30',
        failed: 'bg-red-500/10 text-red-400 border-red-500/30',
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs border ${styles[status] || 'bg-white/5 text-white/40 border-white/10'}`}>
            {status || 'pending'}
        </span>
    );
}

function ProviderBadge({ provider }) {
    const styles = {
        stripe: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        paypal: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        cash: 'bg-green-500/10 text-green-400 border-green-500/30',
        'pay-later': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs border capitalize ${styles[provider] || 'bg-white/5 text-white/40 border-white/10'}`}>
            {provider || 'N/A'}
        </span>
    );
}
