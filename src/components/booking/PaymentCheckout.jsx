'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard, DollarSign, Check, Loader2, AlertCircle,
    Shield, Lock, ArrowLeft, Banknote, Clock
} from 'lucide-react';

export default function PaymentCheckout({ booking, onComplete, onBack }) {
    const [paymentMethod, setPaymentMethod] = useState(null); // 'stripe' | 'paypal'
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [paymentResult, setPaymentResult] = useState(null);

    // Simulated Card Form State
    const [cardInfo, setCardInfo] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: '',
    });

    const handleStripePayment = async () => {
        if (!cardInfo.name || !cardInfo.number || !cardInfo.expiry || !cardInfo.cvc) {
            setError('Please fill in all card details');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // Step 1: Create payment intent
            const intentRes = await fetch('/api/payments/stripe/create-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId: booking.id }),
            });
            const intentData = await intentRes.json();

            if (!intentRes.ok) {
                throw new Error(intentData.error || 'Failed to create payment');
            }

            // Step 2: Simulate card processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Step 3: Confirm payment
            const confirmRes = await fetch('/api/payments/stripe/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentId: intentData.paymentId,
                    paymentIntentId: intentData.clientSecret,
                }),
            });
            const confirmData = await confirmRes.json();

            if (!confirmRes.ok) {
                throw new Error(confirmData.error || 'Payment confirmation failed');
            }

            setPaymentResult({
                provider: 'stripe',
                paymentId: intentData.paymentId,
                amount: booking.totalPrice,
            });

            if (onComplete) onComplete(confirmData);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePayPalPayment = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            // Step 1: Create PayPal order
            const orderRes = await fetch('/api/payments/paypal/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId: booking.id }),
            });
            const orderData = await orderRes.json();

            if (!orderRes.ok) {
                throw new Error(orderData.error || 'Failed to create PayPal order');
            }

            // In production, redirect to PayPal approval URL
            // window.location.href = orderData.approvalUrl;
            // For simulation, auto-capture after delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Step 2: Capture payment
            const captureRes = await fetch('/api/payments/paypal/capture-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: orderData.orderId,
                    paymentId: orderData.paymentId,
                }),
            });
            const captureData = await captureRes.json();

            if (!captureRes.ok) {
                throw new Error(captureData.error || 'PayPal capture failed');
            }

            setPaymentResult({
                provider: 'paypal',
                paymentId: orderData.paymentId,
                amount: booking.totalPrice,
            });

            if (onComplete) onComplete(captureData);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCashPayment = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 1200));

            setPaymentResult({
                provider: 'cash',
                paymentId: `CASH-${Date.now()}`,
                amount: booking.totalPrice,
                note: 'Pay in cash on the day of the tour',
            });

            if (onComplete) onComplete({ method: 'cash', status: 'pay-on-arrival' });
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePayLater = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 1200));

            setPaymentResult({
                provider: 'pay-later',
                paymentId: `LATER-${Date.now()}`,
                amount: booking.totalPrice,
                note: 'Payment due within 48 hours',
            });

            if (onComplete) onComplete({ method: 'pay-later', status: 'reserved' });
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Success State
    if (paymentResult) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-scarab-500/20 border-2 border-scarab-500/40 flex items-center justify-center"
                >
                    <Check className="w-10 h-10 text-scarab-400" />
                </motion.div>
                <h2 className="font-display text-2xl text-white mb-2">Payment Successful!</h2>
                <p className="text-white/60 mb-6">Your booking has been confirmed.</p>
                <div className="glass-card rounded-xl p-4 text-left space-y-2 max-w-sm mx-auto">
                    <div className="flex justify-between text-sm">
                        <span className="text-white/50">Payment ID</span>
                        <span className="text-gold-400 font-mono text-xs">{paymentResult.paymentId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-white/50">Provider</span>
                        <span className="text-white capitalize">{paymentResult.provider}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-gold-500/20 pt-2">
                        <span className="text-white/50">Amount Paid</span>
                        <span className="text-gold-400 font-display text-lg">${paymentResult.amount}</span>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Order Summary */}
            <div className="glass-card rounded-xl p-5">
                <h3 className="font-display text-lg text-white mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-gold-500" />
                    Order Summary
                </h3>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-white/60">{booking.tourTitle}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-white/50">Date</span>
                        <span className="text-white">{booking.selectedDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-white/50">Guests</span>
                        <span className="text-white">{booking.guestsCount}</span>
                    </div>
                    <div className="flex justify-between border-t border-gold-500/20 pt-2 mt-2">
                        <span className="text-white font-medium">Total</span>
                        <span className="text-gold-400 font-display text-2xl">${booking.totalPrice}</span>
                    </div>
                </div>
            </div>

            {/* Payment Method Selection */}
            {!paymentMethod && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                >
                    <h3 className="font-display text-lg text-white">Select Payment Method</h3>

                    {/* Stripe / Card */}
                    <motion.button
                        onClick={() => setPaymentMethod('stripe')}
                        className="w-full glass-card rounded-xl p-4 text-left hover:border-gold-500/40 transition-all group"
                        whileHover={{ scale: 1.01, y: -2 }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
                                <CreditCard className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <div className="text-white font-medium">Credit / Debit Card</div>
                                <div className="text-white/40 text-xs">Visa, Mastercard, AMEX — Powered by Stripe</div>
                            </div>
                        </div>
                    </motion.button>

                    {/* PayPal */}
                    <motion.button
                        onClick={() => setPaymentMethod('paypal')}
                        className="w-full glass-card rounded-xl p-4 text-left hover:border-gold-500/40 transition-all group"
                        whileHover={{ scale: 1.01, y: -2 }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500/20 to-blue-500/20 flex items-center justify-center border border-yellow-500/30">
                                <span className="text-xl font-bold text-blue-400">P</span>
                            </div>
                            <div>
                                <div className="text-white font-medium">PayPal</div>
                                <div className="text-white/40 text-xs">PayPal balance or linked cards</div>
                            </div>
                        </div>
                    </motion.button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 py-1">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-white/30 text-xs uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Pay Cash */}
                    <motion.button
                        onClick={() => setPaymentMethod('cash')}
                        className="w-full glass-card rounded-xl p-4 text-left hover:border-gold-500/40 transition-all group"
                        whileHover={{ scale: 1.01, y: -2 }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-green-500/30">
                                <Banknote className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <div className="text-white font-medium">Pay Cash on Arrival</div>
                                <div className="text-white/40 text-xs">Pay in person on the day of the tour</div>
                            </div>
                        </div>
                    </motion.button>

                    {/* Book Now Pay Later */}
                    <motion.button
                        onClick={() => setPaymentMethod('pay-later')}
                        className="w-full glass-card rounded-xl p-4 text-left hover:border-gold-500/40 transition-all group"
                        whileHover={{ scale: 1.01, y: -2 }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center border border-orange-500/30">
                                <Clock className="w-6 h-6 text-orange-400" />
                            </div>
                            <div>
                                <div className="text-white font-medium">Book Now, Pay Later</div>
                                <div className="text-white/40 text-xs">Reserve your spot — pay within 48 hours</div>
                            </div>
                        </div>
                    </motion.button>
                </motion.div>
            )}

            {/* Stripe Card Form */}
            <AnimatePresence>
                {paymentMethod === 'stripe' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-display text-lg text-white flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-blue-400" />
                                Card Details
                            </h3>
                            <button
                                onClick={() => setPaymentMethod(null)}
                                className="text-white/40 hover:text-white text-sm"
                            >
                                Change method
                            </button>
                        </div>

                        <input
                            type="text"
                            placeholder="Name on Card"
                            className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none"
                            value={cardInfo.name}
                            onChange={e => setCardInfo({ ...cardInfo, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Card Number"
                            maxLength="19"
                            className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none font-mono"
                            value={cardInfo.number}
                            onChange={e => {
                                let v = e.target.value.replace(/\D/g, '').slice(0, 16);
                                v = v.replace(/(\d{4})/g, '$1 ').trim();
                                setCardInfo({ ...cardInfo, number: v });
                            }}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="MM/YY"
                                maxLength="5"
                                className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none font-mono"
                                value={cardInfo.expiry}
                                onChange={e => {
                                    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                                    if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
                                    setCardInfo({ ...cardInfo, expiry: v });
                                }}
                            />
                            <input
                                type="text"
                                placeholder="CVC"
                                maxLength="4"
                                className="glass-input w-full p-3 rounded-lg text-white text-sm outline-none font-mono"
                                value={cardInfo.cvc}
                                onChange={e => {
                                    const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                                    setCardInfo({ ...cardInfo, cvc: v });
                                }}
                            />
                        </div>

                        <motion.button
                            onClick={handleStripePayment}
                            disabled={isProcessing}
                            className="w-full py-4 rounded-xl font-display font-semibold text-sm uppercase tracking-wider
                                bg-gradient-to-r from-blue-500 to-purple-600 text-white
                                hover:from-blue-400 hover:to-purple-500
                                shadow-[0_0_30px_rgba(59,130,246,0.3)]
                                transition-all duration-300 disabled:opacity-50"
                            whileHover={!isProcessing ? { scale: 1.02, y: -2 } : {}}
                            whileTap={!isProcessing ? { scale: 0.98 } : {}}
                        >
                            {isProcessing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing Payment...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    Pay ${booking.totalPrice} with Card
                                </span>
                            )}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PayPal Button */}
            <AnimatePresence>
                {paymentMethod === 'paypal' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-display text-lg text-white flex items-center gap-2">
                                <span className="text-blue-400 font-bold">P</span>
                                PayPal Checkout
                            </h3>
                            <button
                                onClick={() => setPaymentMethod(null)}
                                className="text-white/40 hover:text-white text-sm"
                            >
                                Change method
                            </button>
                        </div>

                        <div className="glass-card rounded-xl p-4 text-center">
                            <p className="text-white/60 text-sm mb-4">
                                You will be redirected to PayPal to complete your payment securely.
                            </p>
                        </div>

                        <motion.button
                            onClick={handlePayPalPayment}
                            disabled={isProcessing}
                            className="w-full py-4 rounded-xl font-display font-semibold text-sm uppercase tracking-wider
                                bg-gradient-to-r from-yellow-500 to-yellow-600 text-obsidian-950
                                hover:from-yellow-400 hover:to-yellow-500
                                shadow-[0_0_30px_rgba(234,179,8,0.3)]
                                transition-all duration-300 disabled:opacity-50"
                            whileHover={!isProcessing ? { scale: 1.02, y: -2 } : {}}
                            whileTap={!isProcessing ? { scale: 0.98 } : {}}
                        >
                            {isProcessing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Connecting to PayPal...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Pay ${booking.totalPrice} with PayPal
                                </span>
                            )}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cash Payment */}
            <AnimatePresence>
                {paymentMethod === 'cash' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-display text-lg text-white flex items-center gap-2">
                                <Banknote className="w-5 h-5 text-green-400" />
                                Pay Cash on Arrival
                            </h3>
                            <button
                                onClick={() => setPaymentMethod(null)}
                                className="text-white/40 hover:text-white text-sm"
                            >
                                Change method
                            </button>
                        </div>

                        <div className="glass-card rounded-xl p-5 text-center space-y-3">
                            <div className="w-14 h-14 mx-auto rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                                <Banknote className="w-7 h-7 text-green-400" />
                            </div>
                            <p className="text-white/70 text-sm">
                                Your booking will be confirmed immediately. Pay <span className="text-gold-400 font-semibold">${booking.totalPrice}</span> in cash to your tour guide on the day of the tour.
                            </p>
                            <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
                                <Check className="w-3 h-3 text-green-400" />
                                <span>No online payment required</span>
                            </div>
                        </div>

                        <motion.button
                            onClick={handleCashPayment}
                            disabled={isProcessing}
                            className="w-full py-4 rounded-xl font-display font-semibold text-sm uppercase tracking-wider
                                bg-gradient-to-r from-green-500 to-emerald-600 text-white
                                hover:from-green-400 hover:to-emerald-500
                                shadow-[0_0_30px_rgba(34,197,94,0.3)]
                                transition-all duration-300 disabled:opacity-50"
                            whileHover={!isProcessing ? { scale: 1.02, y: -2 } : {}}
                            whileTap={!isProcessing ? { scale: 0.98 } : {}}
                        >
                            {isProcessing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Confirming Booking...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Banknote className="w-5 h-5" />
                                    Confirm — Pay Cash on Arrival
                                </span>
                            )}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Book Now Pay Later */}
            <AnimatePresence>
                {paymentMethod === 'pay-later' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-display text-lg text-white flex items-center gap-2">
                                <Clock className="w-5 h-5 text-orange-400" />
                                Book Now, Pay Later
                            </h3>
                            <button
                                onClick={() => setPaymentMethod(null)}
                                className="text-white/40 hover:text-white text-sm"
                            >
                                Change method
                            </button>
                        </div>

                        <div className="glass-card rounded-xl p-5 text-center space-y-3">
                            <div className="w-14 h-14 mx-auto rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                                <Clock className="w-7 h-7 text-orange-400" />
                            </div>
                            <p className="text-white/70 text-sm">
                                Reserve your spot now! You have <span className="text-orange-400 font-semibold">48 hours</span> to complete payment of <span className="text-gold-400 font-semibold">${booking.totalPrice}</span>.
                            </p>
                            <div className="space-y-1">
                                <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
                                    <Check className="w-3 h-3 text-orange-400" />
                                    <span>Your spot is guaranteed for 48 hours</span>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
                                    <Check className="w-3 h-3 text-orange-400" />
                                    <span>Pay online or in cash before the tour</span>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            onClick={handlePayLater}
                            disabled={isProcessing}
                            className="w-full py-4 rounded-xl font-display font-semibold text-sm uppercase tracking-wider
                                bg-gradient-to-r from-orange-500 to-amber-600 text-white
                                hover:from-orange-400 hover:to-amber-500
                                shadow-[0_0_30px_rgba(249,115,22,0.3)]
                                transition-all duration-300 disabled:opacity-50"
                            whileHover={!isProcessing ? { scale: 1.02, y: -2 } : {}}
                            whileTap={!isProcessing ? { scale: 0.98 } : {}}
                        >
                            {isProcessing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Reserving Your Spot...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Reserve Now — Pay Within 48h
                                </span>
                            )}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Display */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                    >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Security Badges */}
            <div className="flex items-center justify-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-white/30 text-xs">
                    <Shield className="w-3.5 h-3.5" />
                    <span>PCI Compliant</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/30 text-xs">
                    <Lock className="w-3.5 h-3.5" />
                    <span>256-bit Encryption</span>
                </div>
            </div>

            {/* Back Button */}
            {onBack && (
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to booking
                </button>
            )}
        </div>
    );
}
