'use client';

import { motion } from 'framer-motion';

export default function ScarabProgress({ currentStep, totalSteps, steps }) {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="w-full max-w-3xl mx-auto mb-12">
            {/* Progress bar */}
            <div className="relative">
                {/* Background track */}
                <div className="w-full h-2 bg-obsidian-800 rounded-full overflow-hidden">
                    {/* Progress fill */}
                    <motion.div
                        className="h-full bg-gradient-to-r from-gold-700 via-gold-500 to-gold-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>

                {/* Scarab beetle */}
                <motion.div
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{ left: `${progress}%` }}
                    initial={{ left: 0 }}
                    animate={{ left: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <motion.div
                        className="relative -translate-x-1/2"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    >
                        {/* Glow effect */}
                        <div className="absolute inset-0 w-10 h-10 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 bg-gold-500 rounded-full blur-xl opacity-50" />

                        {/* Scarab icon */}
                        <span className="relative text-3xl filter drop-shadow-lg">
                            🪲
                        </span>
                    </motion.div>
                </motion.div>

                {/* Step markers */}
                <div className="absolute inset-0 flex justify-between items-center pointer-events-none">
                    {steps.map((step, index) => {
                        const isCompleted = index + 1 <= currentStep;
                        const isCurrent = index + 1 === currentStep;

                        return (
                            <div key={index} className="relative">
                                <motion.div
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isCompleted
                                            ? 'bg-gold-500 border-gold-500'
                                            : isCurrent
                                                ? 'bg-obsidian-800 border-gold-500'
                                                : 'bg-obsidian-800 border-gold-500/30'
                                        }`}
                                    initial={{ scale: 1 }}
                                    animate={{ scale: isCurrent ? 1.2 : 1 }}
                                >
                                    {isCompleted && !isCurrent && (
                                        <span className="text-obsidian-950 text-xs">✓</span>
                                    )}
                                    {isCurrent && (
                                        <motion.div
                                            className="w-2 h-2 rounded-full bg-gold-500"
                                            animate={{ scale: [1, 1.3, 1] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                        />
                                    )}
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step labels */}
            <div className="flex justify-between mt-6">
                {steps.map((step, index) => {
                    const isCompleted = index + 1 <= currentStep;
                    const isCurrent = index + 1 === currentStep;

                    return (
                        <div
                            key={index}
                            className={`text-center transition-colors ${isCurrent
                                    ? 'text-gold-500'
                                    : isCompleted
                                        ? 'text-white/60'
                                        : 'text-white/30'
                                }`}
                        >
                            <p className="text-xs font-display tracking-wider uppercase">
                                {step.label}
                            </p>
                            {isCurrent && (
                                <motion.p
                                    className="text-xs mt-1 text-gold-500/60"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    {step.sublabel}
                                </motion.p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
