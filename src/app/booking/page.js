'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/Footer';
import BookingFlow from '@/components/booking/BookingFlow';
import CustomCursor from '@/components/ui/CustomCursor';
import AIOracle from '@/components/oracle/AIOracle';
import { Shield, Clock, CreditCard, Phone } from 'lucide-react';

export default function BookingPage() {
    const trustBadges = [
        { icon: Shield, label: 'Secure Booking', description: 'SSL encrypted' },
        { icon: Clock, label: '24/7 Support', description: 'Always available' },
        { icon: CreditCard, label: 'Flexible Payment', description: 'Multiple options' },
        { icon: Phone, label: 'Free Cancellation', description: 'Up to 48h before' },
    ];

    return (
        <>
            <CustomCursor />
            <AIOracle />
            <Header />

            <main className="min-h-screen bg-obsidian-950">
                {/* Hero Section */}
                <section className="relative pt-32 pb-16 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950" />

                    {/* Animated background circles */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-full border border-gold-500/10"
                                style={{
                                    width: `${(i + 1) * 200}px`,
                                    height: `${(i + 1) * 200}px`,
                                }}
                                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                                transition={{ duration: 20 + i * 10, repeat: Infinity, ease: 'linear' }}
                            />
                        ))}
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block text-scarab-500 text-sm tracking-[0.3em] uppercase mb-4">
                                Mission Control
                            </span>
                            <h1 className="font-display text-5xl md:text-7xl text-white mb-6">
                                Configure Your <span className="text-gradient-gold">Journey</span>
                            </h1>
                            <p className="text-white/60 text-lg max-w-2xl mx-auto">
                                Step through the time portal and configure your mission parameters.
                                Our travel oracles will handle the rest.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Booking Flow */}
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <Suspense fallback={
                            <div className="text-center py-20">
                                <motion.div
                                    className="text-6xl"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                >
                                    𓂀
                                </motion.div>
                                <p className="text-gold-500 mt-4">Loading time portal...</p>
                            </div>
                        }>
                            <BookingFlow />
                        </Suspense>
                    </div>
                </section>

                {/* Trust Badges */}
                <section className="py-16 border-t border-gold-500/10">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {trustBadges.map((badge, index) => (
                                <motion.div
                                    key={badge.label}
                                    className="text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <badge.icon className="w-10 h-10 text-gold-500 mx-auto mb-3" />
                                    <h3 className="text-white font-display mb-1">{badge.label}</h3>
                                    <p className="text-white/50 text-sm">{badge.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Help Section */}
                <section className="py-16 bg-obsidian-900/50">
                    <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-4xl mb-4 block">𓂀</span>
                            <h2 className="font-display text-2xl text-white mb-4">
                                Need Help With Your Booking?
                            </h2>
                            <p className="text-white/60 mb-6">
                                Our travel oracles are standing by to assist you with any questions
                                or to create a custom itinerary just for you.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <a
                                    href="tel:+442012345678"
                                    className="flex items-center gap-2 text-gold-500 hover:text-gold-400 transition-colors"
                                >
                                    <Phone className="w-5 h-5" />
                                    +44 20 1234 5678
                                </a>
                                <span className="hidden sm:block text-white/30">|</span>
                                <a
                                    href="mailto:book@gobatravel.com"
                                    className="text-gold-500 hover:text-gold-400 transition-colors"
                                >
                                    book@gobatravel.com
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
