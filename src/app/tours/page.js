'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/Footer';
import TourCard from '@/components/cards/TourCard';
import CustomCursor from '@/components/ui/CustomCursor';
import AIOracle from '@/components/oracle/AIOracle';
import GlowButton from '@/components/ui/GlowButton';
import { tours, experiences } from '@/lib/data';
import { Filter, Calendar, Users, Sparkles, ArrowRight } from 'lucide-react';

export default function ToursPage() {
    const [activeLevel, setActiveLevel] = useState('all');
    const [activeCategory, setActiveCategory] = useState('all');

    const levelFilters = [
        { id: 'all', label: 'All Levels' },
        { id: 'Explorer', label: '🧭 Explorer' },
        { id: 'Royal', label: '👑 Royal' },
        { id: 'Pharaoh', label: '𓂀 Pharaoh' },
    ];

    const categoryFilters = [
        { id: 'all', label: 'All Tours' },
        { id: 'signature', label: 'Signature' },
        { id: 'classic', label: 'Classic' },
        { id: 'adventure', label: 'Adventure' },
        { id: 'timegate', label: '⚡ Time Gate' },
    ];

    const filteredTours = tours.filter((tour) => {
        const matchesLevel = activeLevel === 'all' || tour.level === activeLevel;
        const matchesCategory = activeCategory === 'all' || tour.category === activeCategory;
        return matchesLevel && matchesCategory;
    });

    const timegateTours = tours.filter(t => t.category === 'timegate');

    return (
        <>
            <CustomCursor />
            <AIOracle />
            <Header />

            <main className="min-h-screen bg-obsidian-950">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950" />

                    {/* Animated background elements */}
                    <div className="absolute inset-0">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-96 h-96 rounded-full bg-gold-500/5"
                                style={{
                                    left: `${20 + i * 30}%`,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                }}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.5, 0.3],
                                }}
                                transition={{
                                    duration: 4 + i,
                                    repeat: Infinity,
                                    delay: i * 0.5,
                                }}
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
                                Curated Journeys
                            </span>
                            <h1 className="font-display text-5xl md:text-7xl text-white mb-6">
                                Tours & <span className="text-gradient-gold">Packages</span>
                            </h1>
                            <p className="text-white/60 text-lg max-w-2xl mx-auto">
                                Expertly crafted itineraries that blend ancient wonders with modern luxury.
                                Every journey is a carefully orchestrated symphony of experiences.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Filters Section */}
                <section className="py-8 border-y border-gold-500/10 sticky top-20 z-30 bg-obsidian-950/95 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            {/* Level Filters */}
                            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                                <span className="text-gold-500/60 text-sm shrink-0">Level:</span>
                                {levelFilters.map((filter) => (
                                    <motion.button
                                        key={filter.id}
                                        className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all ${activeLevel === filter.id
                                                ? 'bg-gold-500 text-obsidian-950 font-semibold'
                                                : 'border border-gold-500/30 text-white/70 hover:border-gold-500'
                                            }`}
                                        onClick={() => setActiveLevel(filter.id)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {filter.label}
                                    </motion.button>
                                ))}
                            </div>

                            <div className="hidden md:block w-px h-8 bg-gold-500/20" />

                            {/* Category Filters */}
                            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                                <span className="text-gold-500/60 text-sm shrink-0">Type:</span>
                                {categoryFilters.map((filter) => (
                                    <motion.button
                                        key={filter.id}
                                        className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all ${activeCategory === filter.id
                                                ? 'bg-scarab-500 text-white font-semibold'
                                                : 'border border-gold-500/30 text-white/70 hover:border-gold-500'
                                            }`}
                                        onClick={() => setActiveCategory(filter.id)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {filter.label}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tours Grid */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        {filteredTours.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {filteredTours.map((tour, index) => (
                                    <TourCard
                                        key={tour.id}
                                        tour={tour}
                                        index={index}
                                    />
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                className="text-center py-20"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <Calendar className="w-16 h-16 text-gold-500/30 mx-auto mb-4" />
                                <h3 className="text-white text-xl mb-2">No tours found</h3>
                                <p className="text-white/60 mb-6">Try adjusting your filters</p>
                                <GlowButton variant="secondary" onClick={() => {
                                    setActiveLevel('all');
                                    setActiveCategory('all');
                                }}>
                                    Clear Filters
                                </GlowButton>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Time Gate Special Section */}
                <section id="timegate" className="py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-scarab-900/30 via-nile-900/30 to-scarab-900/30" />

                    {/* Animated portal effect */}
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        <motion.div
                            className="w-[600px] h-[600px] rounded-full border-2 border-scarab-500/20"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.div
                            className="absolute w-[400px] h-[400px] rounded-full border-2 border-nile-500/20"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.div
                            className="absolute w-[200px] h-[200px] rounded-full border-2 border-gold-500/20"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <motion.div
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-scarab-500/20 border border-scarab-500/40 mb-6"
                                animate={{
                                    boxShadow: [
                                        '0 0 20px rgba(20,184,166,0.3)',
                                        '0 0 40px rgba(20,184,166,0.5)',
                                        '0 0 20px rgba(20,184,166,0.3)',
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Sparkles className="w-5 h-5 text-scarab-400" />
                                <span className="text-scarab-400 font-display tracking-wider">EUROPE → EGYPT</span>
                                <Sparkles className="w-5 h-5 text-scarab-400" />
                            </motion.div>

                            <h2 className="font-display text-4xl md:text-6xl text-white mb-4">
                                Time Gate <span className="text-gradient-teal">Packages</span>
                            </h2>
                            <p className="text-white/60 text-lg max-w-2xl mx-auto">
                                Step through the portal directly from your city. Premium packages with flights,
                                luxury transfers, and curated Egyptian experiences.
                            </p>
                        </motion.div>

                        {/* Time Gate Tours */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                            {timegateTours.map((tour, index) => (
                                <TourCard
                                    key={tour.id}
                                    tour={tour}
                                    index={index}
                                />
                            ))}
                        </div>

                        {/* Departure Cities */}
                        <motion.div
                            className="p-8 rounded-2xl bg-obsidian-900/50 border border-scarab-500/20"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="font-display text-xl text-white mb-6 text-center">
                                Available Departure Cities
                            </h3>
                            <div className="flex flex-wrap justify-center gap-4">
                                {['London', 'Paris', 'Berlin', 'Rome', 'Madrid', 'Amsterdam', 'Stockholm'].map((city, i) => (
                                    <motion.div
                                        key={city}
                                        className="px-6 py-3 rounded-lg bg-obsidian-800 border border-gold-500/20 text-white"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        whileHover={{ borderColor: 'rgba(20,184,166,0.5)', scale: 1.05 }}
                                    >
                                        {city}
                                    </motion.div>
                                ))}
                            </div>
                            <p className="text-center text-white/40 text-sm mt-6">
                                More cities coming soon. Contact us for custom departure arrangements.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Custom Trip CTA */}
                <section className="py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-900/20 via-obsidian-950 to-scarab-900/20" />

                    <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-6xl mb-6 block">𓂀</span>
                            <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
                                Can't Find Your <span className="text-gradient-gold">Perfect Journey?</span>
                            </h2>
                            <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
                                Let our travel oracles craft a completely bespoke Egyptian adventure
                                tailored to your dreams, timeline, and desires.
                            </p>
                            <GlowButton variant="primary" size="xl" href="/contact">
                                Create Custom Trip
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </GlowButton>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
