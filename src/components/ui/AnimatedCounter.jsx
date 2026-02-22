'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function useCountUp(end, duration = 2000, startOnView = false, ref = null) {
    const [count, setCount] = useState(0);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    useEffect(() => {
        if (startOnView && !isInView) return;

        let startTime;
        let animationFrame;
        const startValue = 0;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(startValue + (end - startValue) * eased));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, isInView, startOnView]);

    return count;
}

export default function AnimatedCounter({ value, suffix = '', prefix = '', label, icon, delay = 0 }) {
    const ref = useRef(null);
    const numericValue = parseFloat(String(value).replace(/[^0-9.]/g, ''));
    const isDecimal = String(value).includes('.');
    const count = useCountUp(numericValue, 2000, true, ref);

    const displayValue = isDecimal ? count.toFixed(1) : count;

    return (
        <motion.div
            ref={ref}
            className="text-center p-5 sm:p-7 rounded-2xl bg-obsidian-900/60 border border-gold-500/20 backdrop-blur-sm relative overflow-hidden group"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay }}
            whileHover={{ borderColor: 'rgba(245,158,11,0.5)', y: -6 }}
        >
            {/* Subtle glow on hover */}
            <div className="absolute -inset-1 rounded-2xl bg-gold-500/5 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <span className="text-2xl sm:text-3xl mb-3 block">{icon}</span>
            <span className="font-display text-3xl sm:text-4xl text-gold-500 block tabular-nums">
                {prefix}{displayValue}{suffix}
            </span>
            <span className="text-white/50 text-xs sm:text-sm mt-1 block">{label}</span>
        </motion.div>
    );
}
