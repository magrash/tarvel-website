'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Minus,
    Plus,
    Calendar,
    Users,
    DollarSign,
    Check,
    Loader2,
    AlertCircle,
    CreditCard,
    ArrowRight,
    MessageCircle
} from 'lucide-react';
import GlowButton from '@/components/ui/GlowButton';
import PaymentCheckout from '@/components/booking/PaymentCheckout';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function TourBookingCalendar({ tour, availability }) {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [guests, setGuests] = useState(tour?.minPax || 1);
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: '',
        whatsapp: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingResult, setBookingResult] = useState(null);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState(false);
    const [error, setError] = useState(null);

    const minPax = tour?.minPax || 1;
    const maxPax = tour?.maxPax || 12;
    const pricePerGuest = tour?.price || 0;
    const totalPrice = pricePerGuest * guests;

    // Build a set of available / unavailable dates for quick lookup
    const availableSet = useMemo(() => {
        return new Set(availability?.available || []);
    }, [availability]);

    const unavailableSet = useMemo(() => {
        return new Set(availability?.unavailable || []);
    }, [availability]);

    // Calendar grid generation
    const calendarDays = useMemo(() => {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const days = [];

        // Empty cells before the 1st
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dateStr = date.toISOString().split('T')[0];
            const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const isToday = dateStr === today.toISOString().split('T')[0];
            const isAvailable = availableSet.has(dateStr);
            const isUnavailable = unavailableSet.has(dateStr) || isPast;
            const isSelected = selectedDate === dateStr;

            days.push({
                day,
                dateStr,
                isPast,
                isToday,
                isAvailable,
                isUnavailable,
                isSelected,
            });
        }

        return days;
    }, [currentMonth, currentYear, selectedDate, availableSet, unavailableSet]);

    const goToPrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleDateSelect = (dateStr) => {
        setSelectedDate(dateStr);
        setError(null);
    };

    const handleBooking = async () => {
        if (!selectedDate) {
            setError('Please select a date');
            return;
        }
        if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.whatsapp) {
            setError('Please fill in all customer details including WhatsApp number');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tourId: tour.id,
                    selectedDate,
                    guestsCount: guests,
                    customerInfo,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setBookingResult(data);
            } else {
                setError(data.error || 'Booking failed. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Payment complete state
    if (paymentComplete) {
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
                    className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-scarab-500/30 to-scarab-600/10 border border-scarab-500/40 flex items-center justify-center"
                >
                    <Check className="w-10 h-10 text-scarab-400" />
                </motion.div>
                <h3 className="font-display text-2xl text-white mb-2">Payment Successful!</h3>
                <p className="text-white/60 mb-5">Your booking has been confirmed and paid.</p>
                <div className="glass-card rounded-xl p-4 text-left space-y-2">
                    <div className="flex justify-between">
                        <span className="text-white/50 text-sm">Booking ID</span>
                        <span className="text-gold-400 text-sm font-mono">{bookingResult.booking.id}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white/50 text-sm">Tour</span>
                        <span className="text-white text-sm">{tour.title}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white/50 text-sm">Date</span>
                        <span className="text-white text-sm">{bookingResult.booking.selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white/50 text-sm">Guests</span>
                        <span className="text-white text-sm">{bookingResult.booking.guestsCount}</span>
                    </div>
                    <div className="flex justify-between border-t border-gold-500/20 pt-2">
                        <span className="text-white/50 text-sm">Paid</span>
                        <span className="text-scarab-400 font-display text-lg">${bookingResult.booking.totalPrice}</span>
                    </div>
                </div>
                <p className="text-white/40 text-xs mt-4">A confirmation email has been sent to your inbox.</p>
            </motion.div>
        );
    }

    // Payment step — show PaymentCheckout component
    if (bookingResult && showPayment) {
        return (
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-5 px-1">
                    <button
                        onClick={() => setShowPayment(false)}
                        className="flex items-center gap-1 text-gold-400 hover:text-gold-300 text-xs transition-colors"
                    >
                        <ChevronLeft className="w-3 h-3" />
                        Back
                    </button>
                    <div className="flex-1 flex items-center justify-center gap-2">
                        <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-scarab-500/20 border border-scarab-500/50 flex items-center justify-center">
                                <Check className="w-3 h-3 text-scarab-400" />
                            </div>
                            <span className="text-white/40 text-xs">Booking</span>
                        </div>
                        <div className="w-6 h-px bg-gold-500/40" />
                        <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-gold-500/20 border border-gold-500/50 flex items-center justify-center">
                                <CreditCard className="w-3 h-3 text-gold-400" />
                            </div>
                            <span className="text-gold-400 text-xs font-semibold">Payment</span>
                        </div>
                    </div>
                </div>

                <PaymentCheckout
                    booking={bookingResult.booking}
                    onComplete={() => setPaymentComplete(true)}
                    onBack={() => setShowPayment(false)}
                />
            </motion.div>
        );
    }

    // Booking summary step — show details + proceed to payment CTA
    if (bookingResult) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5"
            >
                {/* Step indicator */}
                <div className="flex items-center justify-center gap-2 mb-5">
                    <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-scarab-500/20 border border-scarab-500/50 flex items-center justify-center">
                            <Check className="w-3 h-3 text-scarab-400" />
                        </div>
                        <span className="text-scarab-400 text-xs font-semibold">Booking</span>
                    </div>
                    <div className="w-6 h-px bg-white/20" />
                    <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-white/5 border border-white/20 flex items-center justify-center">
                            <CreditCard className="w-3 h-3 text-white/40" />
                        </div>
                        <span className="text-white/40 text-xs">Payment</span>
                    </div>
                </div>

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.15 }}
                    className="w-14 h-14 mx-auto mb-4 rounded-full bg-scarab-500/20 border border-scarab-500/40 flex items-center justify-center"
                >
                    <Check className="w-7 h-7 text-scarab-400" />
                </motion.div>
                <h3 className="font-display text-xl text-white mb-1 text-center">Booking Reserved!</h3>
                <p className="text-white/50 text-sm mb-4 text-center">Complete payment to confirm your spot</p>

                <div className="glass-card rounded-xl p-4 text-left space-y-2 mb-5">
                    <div className="flex justify-between">
                        <span className="text-white/50 text-sm">Booking ID</span>
                        <span className="text-gold-400 text-sm font-mono">{bookingResult.booking.id}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white/50 text-sm">Tour</span>
                        <span className="text-white text-sm truncate ml-4">{tour.title}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white/50 text-sm">Date</span>
                        <span className="text-white text-sm">{bookingResult.booking.selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white/50 text-sm">Guests</span>
                        <span className="text-white text-sm">{bookingResult.booking.guestsCount}</span>
                    </div>
                    <div className="flex justify-between border-t border-gold-500/20 pt-2">
                        <span className="text-white/50 text-sm">Total</span>
                        <span className="text-gold-400 font-display text-lg">${bookingResult.booking.totalPrice}</span>
                    </div>
                </div>

                {/* Proceed to Payment Button */}
                <motion.button
                    onClick={() => setShowPayment(true)}
                    className="w-full py-4 rounded-xl font-display font-semibold text-sm uppercase tracking-wider
                        bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 
                        hover:from-gold-400 hover:to-gold-500 shadow-[0_0_30px_rgba(245,158,11,0.3)]
                        transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="flex items-center justify-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Proceed to Payment
                        <ArrowRight className="w-4 h-4" />
                    </span>
                </motion.button>

                <p className="text-white/30 text-xs text-center mt-3">
                    Secure payment powered by Stripe & PayPal
                </p>
            </motion.div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Calendar Header */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <motion.button
                        onClick={goToPrevMonth}
                        className="p-2 rounded-lg glass-badge text-gold-400 hover:text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                    <h3 className="font-display text-white text-lg">
                        {MONTHS[currentMonth]} {currentYear}
                    </h3>
                    <motion.button
                        onClick={goToNextMonth}
                        className="p-2 rounded-lg glass-badge text-gold-400 hover:text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </motion.button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                    {DAYS.map(day => (
                        <div key={day} className="text-center text-xs text-gold-500/60 font-semibold py-1">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((cell, i) => {
                        if (!cell) {
                            return <div key={`empty-${i}`} className="h-10" />;
                        }

                        const isClickable = cell.isAvailable && !cell.isUnavailable;

                        return (
                            <motion.button
                                key={cell.dateStr}
                                disabled={!isClickable}
                                onClick={() => isClickable && handleDateSelect(cell.dateStr)}
                                className={`
                                    h-10 rounded-lg text-sm font-medium transition-all relative
                                    ${cell.isSelected
                                        ? 'bg-gold-500 text-obsidian-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                                        : cell.isToday && isClickable
                                            ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40'
                                            : isClickable
                                                ? 'text-white/80 hover:bg-white/10 hover:text-white'
                                                : 'text-white/20 cursor-not-allowed'
                                    }
                                `}
                                whileHover={isClickable ? { scale: 1.1 } : {}}
                                whileTap={isClickable ? { scale: 0.95 } : {}}
                            >
                                {cell.day}
                                {cell.isToday && !cell.isSelected && (
                                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-500" />
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-3 text-xs text-white/40">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-gold-500/20 border border-gold-500/40" />
                        <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-white/5" />
                        <span>Unavailable</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-gold-500" />
                        <span>Selected</span>
                    </div>
                </div>
            </div>

            {/* Guest Selector */}
            <div className="glass-card rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gold-500" />
                        <span className="text-white text-sm">Guests</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <motion.button
                            onClick={() => setGuests(Math.max(minPax, guests - 1))}
                            disabled={guests <= minPax}
                            className="w-8 h-8 rounded-full glass-badge flex items-center justify-center text-gold-400 disabled:opacity-30 disabled:cursor-not-allowed"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Minus className="w-3.5 h-3.5" />
                        </motion.button>
                        <motion.span
                            key={guests}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-white font-display text-xl w-8 text-center"
                        >
                            {guests}
                        </motion.span>
                        <motion.button
                            onClick={() => setGuests(Math.min(maxPax, guests + 1))}
                            disabled={guests >= maxPax}
                            className="w-8 h-8 rounded-full glass-badge flex items-center justify-center text-gold-400 disabled:opacity-30 disabled:cursor-not-allowed"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </motion.button>
                    </div>
                </div>
                <p className="text-white/30 text-xs mt-1">
                    Min: {minPax} · Max: {maxPax} travelers
                </p>
            </div>

            {/* Price Summary */}
            <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-4 h-4 text-gold-500" />
                    <span className="text-white text-sm">Price Breakdown</span>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-white/50">${pricePerGuest} × {guests} guest{guests > 1 ? 's' : ''}</span>
                        <span className="text-white">${totalPrice}</span>
                    </div>
                    <div className="border-t border-gold-500/20 pt-2 flex justify-between">
                        <span className="text-white font-medium">Total</span>
                        <motion.span
                            key={totalPrice}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-gold-400 font-display text-2xl"
                        >
                            ${totalPrice}
                        </motion.span>
                    </div>
                </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-3">
                <input
                    type="text"
                    placeholder="Full Name *"
                    className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email Address *"
                    className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                />
                <input
                    type="tel"
                    placeholder="Phone Number *"
                    className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                />
                <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                    <input
                        type="tel"
                        placeholder="WhatsApp Number *"
                        className="glass-input w-full pl-10 pr-3 py-3 rounded-lg text-white text-sm outline-none"
                        value={customerInfo.whatsapp}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, whatsapp: e.target.value })}
                    />
                </div>
            </div>

            {/* Error message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                    >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Book Now Button */}
            <motion.button
                onClick={handleBooking}
                disabled={isSubmitting || !selectedDate}
                className={`
                    w-full py-4 rounded-xl font-display font-semibold text-sm uppercase tracking-wider
                    transition-all duration-300
                    ${selectedDate
                        ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 hover:from-gold-400 hover:to-gold-500 shadow-[0_0_30px_rgba(245,158,11,0.3)]'
                        : 'bg-obsidian-800 text-white/30 cursor-not-allowed'
                    }
                    disabled:opacity-50
                `}
                whileHover={selectedDate ? { scale: 1.02, y: -2 } : {}}
                whileTap={selectedDate ? { scale: 0.98 } : {}}
            >
                {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Book Now — ${totalPrice}
                    </span>
                )}
            </motion.button>
        </div>
    );
}
