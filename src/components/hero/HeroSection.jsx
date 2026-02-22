'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import GlowButton from '@/components/ui/GlowButton';
import ParticleField from './ParticleField';
import { useLanguage } from '@/context/LanguageContext';


export default function HeroSection() {
    const { t } = useLanguage();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);




    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background layers */}
            <div className="absolute inset-0 z-0">
                {/* Fullscreen Video Background */}
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    poster=""
                >
                    <source src="/hero-video.mp4" type="video/mp4" />
                </video>

                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-obsidian-950/60" />

                {/* Gradient overlays for cinematic depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/80 via-transparent to-obsidian-950" />
                <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950/40 via-transparent to-obsidian-950/40" />

                {/* Bottom vignette for smooth transition */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-obsidian-950 to-transparent" />

                {/* Particle field on top of video */}
                <ParticleField particleCount={isMobile ? 10 : 25} />

                {/* Radial glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-500/5 rounded-full blur-3xl" />
            </div>



            {/* Main content */}
            <motion.div
                className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-20 sm:pt-0"
                style={{ opacity, scale }}
            >


                {/* Main heading */}
                <motion.h1
                    className="font-display text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <span className="text-white">{t('hero.title')}</span>
                    <br />
                    <span className="text-gradient-gold glow-text-gold">
                        {t('hero.titleHighlight')}
                    </span>
                </motion.h1>



                {/* CTA Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >
                    <GlowButton variant="primary" size="lg" href="/booking">
                        {t('nav.bookNow')}
                    </GlowButton>
                    <GlowButton variant="secondary" size="lg" href="/tours">
                        {t('hero.ctaPrimary')}
                    </GlowButton>
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
