'use client';

import { motion } from 'framer-motion';

export default function SectionDivider({ variant = 'gold' }) {
    const colors = {
        gold: 'from-transparent via-gold-500/40 to-transparent',
        teal: 'from-transparent via-scarab-500/40 to-transparent',
        subtle: 'from-transparent via-white/10 to-transparent',
    };

    return (
        <div className="relative py-2 overflow-hidden">
            <motion.div
                className={`h-px bg-gradient-to-r ${colors[variant]}`}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeInOut' }}
            />
            {/* Center diamond ornament */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0, rotate: 0 }}
                whileInView={{ opacity: 1, rotate: 45 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
            >
                <div className={`w-2 h-2 ${variant === 'gold' ? 'bg-gold-500/60' : variant === 'teal' ? 'bg-scarab-500/60' : 'bg-white/20'}`} />
            </motion.div>
        </div>
    );
}
