'use client';

import { motion } from 'framer-motion';
import { Shield, Clock, Award, Headphones, CreditCard, MapPin } from 'lucide-react';

const badges = [
    { icon: Shield, label: 'Licensed & Insured', color: 'text-emerald-400' },
    { icon: Award, label: 'Expert Guides', color: 'text-gold-400' },
    { icon: Clock, label: 'Free Cancellation', color: 'text-sky-400' },
    { icon: Headphones, label: '24/7 Support', color: 'text-purple-400' },
    { icon: CreditCard, label: 'Secure Payments', color: 'text-pink-400' },
    { icon: MapPin, label: 'All Egypt', color: 'text-orange-400' },
];

export default function TrustBadges() {
    return (
        <section className="py-4 sm:py-8 relative overflow-hidden border-y border-gold-500/10">
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950 via-obsidian-900/80 to-obsidian-950" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-6">
                    {badges.map((badge, i) => (
                        <motion.div
                            key={badge.label}
                            className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 text-center sm:text-left"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                        >
                            <badge.icon className={`w-4 h-4 ${badge.color} flex-shrink-0`} />
                            <span className="text-white/70 text-[10px] sm:text-xs font-medium leading-tight">
                                {badge.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
