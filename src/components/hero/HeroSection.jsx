'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import GlowButton from '@/components/ui/GlowButton';
import ParticleField from './ParticleField';

export default function HeroSection() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

    const stats = [
        { value: '5000+', label: 'Years of History' },
        { value: '50K+', label: 'Time Travelers' },
        { value: '4.9', label: 'Star Rating' },
        { value: '24/7', label: 'Support' },
    ];

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background layers */}
            <div className="absolute inset-0 z-0">
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950" />

                {/* Particle field */}
                <ParticleField particleCount={60} />

                {/* Radial glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-500/5 rounded-full blur-3xl" />

                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(245, 158, 11, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245, 158, 11, 0.1) 1px, transparent 1px)
            `,
                        backgroundSize: '100px 100px',
                    }}
                />
            </div>

            {/* Animated pyramid silhouette */}
            <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 z-0"
                style={{ y }}
            >
                <svg
                    width="800"
                    height="400"
                    viewBox="0 0 800 400"
                    className="opacity-20"
                >
                    {/* Main pyramid */}
                    <motion.path
                        d="M400 50 L700 350 L100 350 Z"
                        fill="none"
                        stroke="url(#pyramidGradient)"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: 0.5 }}
                    />
                    {/* Second pyramid */}
                    <motion.path
                        d="M550 100 L750 350 L350 350 Z"
                        fill="none"
                        stroke="url(#pyramidGradient)"
                        strokeWidth="1.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: 0.8 }}
                    />
                    {/* Third pyramid */}
                    <motion.path
                        d="M250 120 L450 350 L50 350 Z"
                        fill="none"
                        stroke="url(#pyramidGradient)"
                        strokeWidth="1"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: 1.1 }}
                    />
                    <defs>
                        <linearGradient id="pyramidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#78350f" />
                        </linearGradient>
                    </defs>
                </svg>
            </motion.div>

            {/* Main content */}
            <motion.div
                className="relative z-10 max-w-5xl mx-auto px-6 text-center"
                style={{ opacity, scale }}
            >
                {/* Pre-heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-6"
                >
                    <span className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-gold-500/30 bg-obsidian-900/50 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-scarab-500 animate-pulse" />
                        <span className="text-sm text-gold-500 tracking-wider uppercase">
                            Time Portal Active
                        </span>
                    </span>
                </motion.div>

                {/* Main heading */}
                <motion.h1
                    className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <span className="text-white">Journey Through</span>
                    <br />
                    <span className="text-gradient-gold glow-text-gold">
                        5000 Years
                    </span>
                </motion.h1>

                {/* Subheading */}
                <motion.p
                    className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    Step through the time portal and experience Egypt like never before.
                    From ancient temples to modern luxury, your journey across millennia begins now.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >
                    <GlowButton variant="primary" size="lg" href="/booking">
                        Begin Your Journey
                    </GlowButton>
                    <GlowButton variant="secondary" size="lg" href="/tours">
                        Explore Tours
                    </GlowButton>
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                        >
                            <div className="font-display text-3xl sm:text-4xl font-bold text-gold-500 mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-white/50 uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                <motion.div
                    className="flex flex-col items-center gap-2 text-gold-500/60"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <span className="text-xs uppercase tracking-widest">Scroll to Explore</span>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                </motion.div>
            </motion.div>

            {/* Side decorations */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 text-gold-500/30 text-xl">
                {['𓀀', '𓂀', '𓃭', '𓅃', '𓆣'].map((glyph, i) => (
                    <motion.span
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 0.3, x: 0 }}
                        transition={{ delay: 1.5 + i * 0.1 }}
                    >
                        {glyph}
                    </motion.span>
                ))}
            </div>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 text-gold-500/30 text-xl">
                {['𓇯', '𓈖', '𓉐', '𓊽', '𓄿'].map((glyph, i) => (
                    <motion.span
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 0.3, x: 0 }}
                        transition={{ delay: 1.5 + i * 0.1 }}
                    >
                        {glyph}
                    </motion.span>
                ))}
            </div>
        </section>
    );
}
