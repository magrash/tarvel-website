'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Crown, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import ScarabProgress from './ScarabProgress';
import GlowButton from '@/components/ui/GlowButton';

export default function BookingFlow({ preselectedTour = null }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        duration: null,
        travelers: 2,
        experience: null,
        departureDate: null,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialRequests: '',
    });

    const steps = [
        { label: 'Timeline', sublabel: 'Choose duration' },
        { label: 'Companions', sublabel: 'How many travelers' },
        { label: 'Experience', sublabel: 'Select your level' },
        { label: 'Complete', sublabel: 'Confirm booking' },
    ];

    const durations = [
        { days: 5, label: '5 Days', description: 'Quick Discovery', price: 1299 },
        { days: 7, label: '7 Days', description: 'Classic Journey', price: 1899, popular: true },
        { days: 10, label: '10 Days', description: 'Deep Exploration', price: 2999 },
        { days: 14, label: '14 Days', description: 'Ultimate Adventure', price: 3999 },
    ];

    const experienceLevels = [
        {
            id: 'explorer',
            name: 'Explorer',
            icon: '🧭',
            tagline: 'Discover at Your Pace',
            multiplier: 1,
            features: ['4-star hotels', 'Group tours', 'Professional guides'],
        },
        {
            id: 'royal',
            name: 'Royal',
            icon: '👑',
            tagline: 'Travel Like a Pharaoh',
            multiplier: 1.5,
            popular: true,
            features: ['5-star luxury', 'Small groups', 'VIP access'],
        },
        {
            id: 'pharaoh',
            name: 'Pharaoh',
            icon: '𓂀',
            tagline: 'Ultimate Private Journey',
            multiplier: 2.5,
            features: ['Ultra-luxury', 'Fully private', 'After-hours access'],
        },
    ];

    const handleNext = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const calculatePrice = () => {
        const baseDuration = durations.find(d => d.days === formData.duration);
        const experience = experienceLevels.find(e => e.id === formData.experience);
        if (!baseDuration || !experience) return 0;
        return Math.round(baseDuration.price * experience.multiplier * formData.travelers);
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1: return formData.duration !== null;
            case 2: return formData.travelers > 0;
            case 3: return formData.experience !== null;
            default: return true;
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <ScarabProgress
                currentStep={currentStep}
                totalSteps={4}
                steps={steps}
            />

            <AnimatePresence mode="wait">
                {/* Step 1: Duration */}
                {currentStep === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-8"
                    >
                        <div className="text-center">
                            <Calendar className="w-12 h-12 text-gold-500 mx-auto mb-4" />
                            <h2 className="font-display text-3xl text-white mb-2">
                                Choose Your Timeline
                            </h2>
                            <p className="text-white/60">
                                How many days would you like to spend in ancient Egypt?
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {durations.map((duration) => (
                                <motion.button
                                    key={duration.days}
                                    className={`relative p-6 rounded-xl text-center transition-all ${formData.duration === duration.days
                                            ? 'bg-gold-500 text-obsidian-950'
                                            : 'bg-obsidian-900 border border-gold-500/30 hover:border-gold-500'
                                        }`}
                                    onClick={() => setFormData({ ...formData, duration: duration.days })}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {duration.popular && (
                                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-scarab-500 text-white text-xs rounded-full">
                                            Popular
                                        </span>
                                    )}
                                    <div className={`text-3xl font-display mb-2 ${formData.duration === duration.days ? 'text-obsidian-950' : 'text-gold-500'
                                        }`}>
                                        {duration.label}
                                    </div>
                                    <p className={`text-sm ${formData.duration === duration.days ? 'text-obsidian-950/70' : 'text-white/60'
                                        }`}>
                                        {duration.description}
                                    </p>
                                    <p className={`text-lg font-bold mt-2 ${formData.duration === duration.days ? 'text-obsidian-950' : 'text-gold-500'
                                        }`}>
                                        From €{duration.price}
                                    </p>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Travelers */}
                {currentStep === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-8"
                    >
                        <div className="text-center">
                            <Users className="w-12 h-12 text-gold-500 mx-auto mb-4" />
                            <h2 className="font-display text-3xl text-white mb-2">
                                Choose Your Companions
                            </h2>
                            <p className="text-white/60">
                                How many travelers will be journeying through time?
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-8">
                            <motion.button
                                className="w-14 h-14 rounded-full bg-obsidian-800 border border-gold-500/30 text-gold-500 text-2xl font-bold hover:border-gold-500 disabled:opacity-30"
                                onClick={() => setFormData({ ...formData, travelers: Math.max(1, formData.travelers - 1) })}
                                disabled={formData.travelers <= 1}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                -
                            </motion.button>

                            <div className="text-center">
                                <motion.div
                                    className="text-7xl font-display text-gold-500"
                                    key={formData.travelers}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                >
                                    {formData.travelers}
                                </motion.div>
                                <p className="text-white/60 mt-2">
                                    {formData.travelers === 1 ? 'Solo Adventurer' : 'Time Travelers'}
                                </p>
                            </div>

                            <motion.button
                                className="w-14 h-14 rounded-full bg-obsidian-800 border border-gold-500/30 text-gold-500 text-2xl font-bold hover:border-gold-500 disabled:opacity-30"
                                onClick={() => setFormData({ ...formData, travelers: Math.min(12, formData.travelers + 1) })}
                                disabled={formData.travelers >= 12}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                +
                            </motion.button>
                        </div>

                        <p className="text-center text-white/40 text-sm">
                            Groups larger than 12? <a href="/contact" className="text-gold-500 hover:underline">Contact us</a> for custom arrangements.
                        </p>
                    </motion.div>
                )}

                {/* Step 3: Experience Level */}
                {currentStep === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-8"
                    >
                        <div className="text-center">
                            <Crown className="w-12 h-12 text-gold-500 mx-auto mb-4" />
                            <h2 className="font-display text-3xl text-white mb-2">
                                Choose Your Experience
                            </h2>
                            <p className="text-white/60">
                                How would you like to travel through time?
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {experienceLevels.map((level, index) => (
                                <motion.button
                                    key={level.id}
                                    className={`relative p-6 rounded-xl text-left transition-all ${formData.experience === level.id
                                            ? 'bg-gradient-to-br from-gold-500 to-gold-600 text-obsidian-950'
                                            : 'bg-obsidian-900 border border-gold-500/30 hover:border-gold-500'
                                        } ${level.popular && formData.experience !== level.id ? 'ring-2 ring-scarab-500' : ''}`}
                                    onClick={() => setFormData({ ...formData, experience: level.id })}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {level.popular && (
                                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-scarab-500 text-white text-xs rounded-full">
                                            Most Popular
                                        </span>
                                    )}

                                    <div className="text-4xl mb-3">{level.icon}</div>
                                    <h3 className={`font-display text-xl mb-1 ${formData.experience === level.id ? 'text-obsidian-950' : 'text-white'
                                        }`}>
                                        {level.name}
                                    </h3>
                                    <p className={`text-sm italic mb-4 ${formData.experience === level.id ? 'text-obsidian-950/70' : 'text-gold-500/80'
                                        }`}>
                                        "{level.tagline}"
                                    </p>

                                    <ul className="space-y-2">
                                        {level.features.map((feature, i) => (
                                            <li key={i} className={`flex items-center gap-2 text-sm ${formData.experience === level.id ? 'text-obsidian-950/80' : 'text-white/60'
                                                }`}>
                                                <span className={formData.experience === level.id ? 'text-obsidian-950' : 'text-gold-500'}>✦</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    {formData.experience === level.id && (
                                        <motion.div
                                            className="absolute top-4 right-4"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            <Check className="w-6 h-6 text-obsidian-950" />
                                        </motion.div>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Step 4: Confirmation */}
                {currentStep === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-8"
                    >
                        <div className="text-center">
                            <motion.div
                                className="text-6xl mb-4"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Sparkles className="w-16 h-16 text-gold-500 mx-auto" />
                            </motion.div>
                            <h2 className="font-display text-3xl text-white mb-2">
                                Mission Configured
                            </h2>
                            <p className="text-white/60">
                                Review your time-travel mission parameters
                            </p>
                        </div>

                        {/* Summary Card */}
                        <motion.div
                            className="p-8 rounded-2xl bg-obsidian-900 border border-gold-500/30"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                                <div className="text-center">
                                    <Calendar className="w-8 h-8 text-gold-500 mx-auto mb-2" />
                                    <p className="text-white/60 text-sm">Duration</p>
                                    <p className="text-white font-display text-xl">{formData.duration} Days</p>
                                </div>
                                <div className="text-center">
                                    <Users className="w-8 h-8 text-gold-500 mx-auto mb-2" />
                                    <p className="text-white/60 text-sm">Travelers</p>
                                    <p className="text-white font-display text-xl">{formData.travelers}</p>
                                </div>
                                <div className="text-center">
                                    <Crown className="w-8 h-8 text-gold-500 mx-auto mb-2" />
                                    <p className="text-white/60 text-sm">Experience</p>
                                    <p className="text-white font-display text-xl capitalize">{formData.experience}</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl mb-2">💰</div>
                                    <p className="text-white/60 text-sm">Total Price</p>
                                    <p className="text-gold-500 font-display text-2xl">€{calculatePrice().toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="border-t border-gold-500/20 pt-8">
                                <p className="text-center text-white/60 mb-6">
                                    Ready to confirm? Our travel oracles will contact you within 24 hours to finalize your journey.
                                </p>
                                <div className="flex justify-center">
                                    <GlowButton variant="primary" size="lg">
                                        Activate Time Portal
                                        <Sparkles className="w-5 h-5 ml-2" />
                                    </GlowButton>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-12">
                <motion.button
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg border border-gold-500/30 text-gold-500 transition-all hover:border-gold-500 ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''
                        }`}
                    onClick={handlePrev}
                    whileHover={{ x: -5 }}
                >
                    <ArrowLeft className="w-5 h-5" />
                    Previous
                </motion.button>

                {currentStep < 4 && (
                    <motion.button
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${canProceed()
                                ? 'bg-gold-500 text-obsidian-950 hover:bg-gold-400'
                                : 'bg-obsidian-800 text-white/30 cursor-not-allowed'
                            }`}
                        onClick={handleNext}
                        disabled={!canProceed()}
                        whileHover={canProceed() ? { x: 5 } : {}}
                    >
                        Continue
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                )}
            </div>
        </div>
    );
}
