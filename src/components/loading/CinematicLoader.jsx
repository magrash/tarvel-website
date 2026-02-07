'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CinematicLoader({ onComplete }) {
    const [phase, setPhase] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const phases = [
            { delay: 500, next: 1 },   // Start hieroglyphs
            { delay: 2000, next: 2 },  // Draw pyramid
            { delay: 2500, next: 3 },  // Show text
            { delay: 3500, next: 4 },  // Fade out
        ];

        if (phase < phases.length) {
            const timer = setTimeout(() => {
                setPhase(phases[phase].next);
            }, phases[phase].delay);
            return () => clearTimeout(timer);
        } else {
            setIsComplete(true);
            if (onComplete) {
                setTimeout(onComplete, 500);
            }
        }
    }, [phase, onComplete]);

    const hieroglyphs = ['𓀀', '𓀁', '𓂀', '𓃭', '𓅃', '𓆣', '𓇯', '𓈖', '𓉐', '𓊽'];

    return (
        <AnimatePresence>
            {!isComplete && (
                <motion.div
                    className="fixed inset-0 z-[9999] bg-obsidian-950 flex items-center justify-center overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Background particles */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-gold-500 rounded-full"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                    opacity: [0, 0.5, 0],
                                    scale: [0, 1, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    delay: Math.random() * 2,
                                    repeat: Infinity,
                                }}
                            />
                        ))}
                    </div>

                    {/* Main content */}
                    <div className="relative flex flex-col items-center justify-center">

                        {/* Hieroglyphs ring */}
                        <motion.div
                            className="absolute w-80 h-80"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            {hieroglyphs.map((glyph, i) => (
                                <motion.span
                                    key={i}
                                    className="absolute text-2xl text-gold-500"
                                    style={{
                                        left: '50%',
                                        top: '50%',
                                        transform: `rotate(${i * 36}deg) translateY(-140px)`,
                                        transformOrigin: 'center',
                                    }}
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        opacity: phase >= 1 ? [0.3, 1, 0.3] : 0,
                                    }}
                                    transition={{
                                        duration: 2,
                                        delay: i * 0.1,
                                        repeat: Infinity,
                                    }}
                                >
                                    {glyph}
                                </motion.span>
                            ))}
                        </motion.div>

                        {/* Pyramid SVG */}
                        <motion.svg
                            width="200"
                            height="180"
                            viewBox="0 0 200 180"
                            className="relative z-10"
                        >
                            {/* Pyramid outline */}
                            <motion.path
                                d="M100 10 L190 170 L10 170 Z"
                                fill="none"
                                stroke="url(#goldGradient)"
                                strokeWidth="2"
                                strokeDasharray="500"
                                initial={{ strokeDashoffset: 500 }}
                                animate={{
                                    strokeDashoffset: phase >= 2 ? 0 : 500,
                                }}
                                transition={{ duration: 2, ease: "easeOut" }}
                            />

                            {/* Inner lines */}
                            <motion.path
                                d="M100 10 L100 170 M50 90 L150 90"
                                fill="none"
                                stroke="url(#goldGradient)"
                                strokeWidth="1"
                                strokeDasharray="200"
                                initial={{ strokeDashoffset: 200, opacity: 0 }}
                                animate={{
                                    strokeDashoffset: phase >= 2 ? 0 : 200,
                                    opacity: phase >= 2 ? 0.5 : 0,
                                }}
                                transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                            />

                            {/* Eye of Horus in center */}
                            <motion.text
                                x="100"
                                y="100"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-3xl"
                                fill="#f59e0b"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: phase >= 2 ? 1 : 0,
                                    scale: phase >= 2 ? 1 : 0,
                                }}
                                transition={{ duration: 0.8, delay: 1 }}
                            >
                                𓂀
                            </motion.text>

                            <defs>
                                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#fbbf24" />
                                    <stop offset="50%" stopColor="#f59e0b" />
                                    <stop offset="100%" stopColor="#d97706" />
                                </linearGradient>
                            </defs>
                        </motion.svg>

                        {/* Loading text */}
                        <motion.div
                            className="mt-12 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                                opacity: phase >= 3 ? 1 : 0,
                                y: phase >= 3 ? 0 : 20,
                            }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.p
                                className="font-display text-gold-500 text-lg tracking-[0.3em] mb-4"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                INITIALIZING TIME PORTAL
                            </motion.p>

                            {/* Progress dots */}
                            <div className="flex justify-center gap-2">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-2 h-2 rounded-full bg-gold-500"
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.3, 1, 0.3],
                                        }}
                                        transition={{
                                            duration: 1,
                                            delay: i * 0.2,
                                            repeat: Infinity,
                                        }}
                                    />
                                ))}
                            </div>
                        </motion.div>

                        {/* Glow effect */}
                        <motion.div
                            className="absolute inset-0 -z-10"
                            style={{
                                background: 'radial-gradient(circle at center, rgba(245, 158, 11, 0.2) 0%, transparent 70%)',
                            }}
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0.8, 0.5],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                            }}
                        />
                    </div>

                    {/* Bottom hieroglyph line */}
                    <motion.div
                        className="absolute bottom-10 left-0 right-0 flex justify-center gap-4 text-gold-500/30 text-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: phase >= 1 ? 1 : 0 }}
                        transition={{ duration: 1 }}
                    >
                        {['𓀀', '𓀁', '𓀂', '𓀃', '𓁀', '𓁐', '𓂀', '𓃭', '𓄿', '𓅓'].map((g, i) => (
                            <motion.span
                                key={i}
                                animate={{ opacity: [0.2, 0.6, 0.2] }}
                                transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                            >
                                {g}
                            </motion.span>
                        ))}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
