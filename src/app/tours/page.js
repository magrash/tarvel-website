'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/Footer';
import TourCard from '@/components/cards/TourCard';
import FilterBar from '@/components/filters/FilterBar';
import CustomCursor from '@/components/ui/CustomCursor';
import AIOracle from '@/components/oracle/AIOracle';
import GlowButton from '@/components/ui/GlowButton';
import { tours as fallbackTours, experiences as fallbackExperiences } from '@/lib/data';
import { Calendar, Sparkles, ArrowRight } from 'lucide-react';

function ToursContent() {
    const searchParams = useSearchParams();
    const destParam = searchParams.get('destination');

    const [tours, setTours] = useState(fallbackTours);
    const [experiences, setExperiences] = useState(fallbackExperiences);

    useEffect(() => {
        fetch('/api/content')
            .then(res => res.json())
            .then(data => {
                if (data.tours?.length) setTours(data.tours);
                if (data.experiences?.length) setExperiences(data.experiences);
            })
            .catch(() => { });
    }, []);

    const [filters, setFilters] = useState({
        destination: 'all',
        tourType: 'all',
        budgetRange: [0, 1000],
        duration: 'all',
        minRating: 0,
    });

    // Set initial destination from URL param
    useEffect(() => {
        if (destParam) {
            setFilters(prev => ({ ...prev, destination: destParam }));
        }
    }, [destParam]);

    const filteredTours = useMemo(() => {
        return tours.filter((tour) => {
            // Skip timegate tours from main listing
            if (tour.category === 'timegate') return false;

            // Destination filter
            if (filters.destination !== 'all') {
                const tourDest = tour.destination || tour.region || '';
                if (tourDest !== filters.destination) return false;
            }

            // Tour type filter
            if (filters.tourType !== 'all' && tour.tourType !== filters.tourType && tour.category !== filters.tourType) return false;

            // Budget range filter
            if (tour.price < filters.budgetRange[0] || tour.price > filters.budgetRange[1]) return false;

            // Duration filter
            if (filters.duration !== 'all') {
                if (filters.duration === '1' && tour.days !== 1) return false;
                if (filters.duration === 'multi' && tour.days <= 1) return false;
            }

            // Rating filter
            if (filters.minRating > 0 && tour.rating < filters.minRating) return false;

            return true;
        });
    }, [filters, tours]);

    const nonTimegateTotal = tours.filter(t => t.category !== 'timegate').length;

    return (
        <>
            <CustomCursor />
            <AIOracle />
            <Header />

            <main className="min-h-screen bg-obsidian-950">
                {/* Hero Section */}
                <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 overflow-hidden">
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

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block text-scarab-500 text-sm tracking-[0.3em] uppercase mb-4">
                                Curated Journeys
                            </span>
                            <h1 className="font-display text-3xl sm:text-5xl md:text-7xl text-white mb-4 sm:mb-6">
                                Tours & <span className="text-gradient-gold">Packages</span>
                            </h1>
                            <p className="text-white/60 text-sm sm:text-lg max-w-2xl mx-auto">
                                Expertly crafted itineraries that blend ancient wonders with modern luxury.
                                Every journey is a carefully orchestrated symphony of experiences.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Advanced Filter Bar */}
                <FilterBar
                    filters={filters}
                    onFilterChange={setFilters}
                    tourCount={filteredTours.length}
                    totalCount={nonTimegateTotal}
                />

                {/* Tours Grid */}
                <section className="py-8 sm:py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <AnimatePresence mode="wait">
                            {filteredTours.length > 0 ? (
                                <motion.div
                                    key={JSON.stringify(filters)}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
                                >
                                    {filteredTours.map((tour, index) => (
                                        <TourCard
                                            key={tour.id}
                                            tour={tour}
                                            index={index}
                                        />
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center py-20"
                                >
                                    <Calendar className="w-16 h-16 text-gold-500/30 mx-auto mb-4" />
                                    <h3 className="text-white text-xl mb-2">No tours found</h3>
                                    <p className="text-white/60 mb-6">Try adjusting your filters</p>
                                    <GlowButton variant="secondary" onClick={() => setFilters({
                                        destination: 'all',
                                        tourType: 'all',
                                        budgetRange: [0, 1500],
                                        duration: 'all',
                                        minRating: 0,
                                    })}>
                                        Clear All Filters
                                    </GlowButton>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>

                {/* Featured Packages Section */}
                <section className="py-16 sm:py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-900/10 via-obsidian-950 to-scarab-900/10" />

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            className="text-center mb-12 sm:mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <motion.div
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-500/10 border border-gold-500/30 mb-6"
                                animate={{
                                    boxShadow: [
                                        '0 0 20px rgba(245,158,11,0.2)',
                                        '0 0 40px rgba(245,158,11,0.4)',
                                        '0 0 20px rgba(245,158,11,0.2)',
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Sparkles className="w-5 h-5 text-gold-400" />
                                <span className="text-gold-400 font-display tracking-wider">MULTI-DAY ADVENTURES</span>
                                <Sparkles className="w-5 h-5 text-gold-400" />
                            </motion.div>

                            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl text-white mb-4">
                                Featured <span className="text-gradient-gold">Packages</span>
                            </h2>
                            <p className="text-white/60 text-sm sm:text-lg max-w-2xl mx-auto">
                                Experience the best of Egypt in one unforgettable journey. Cairo, the Nile,
                                ancient temples, and luxury cruises — all perfectly curated.
                            </p>
                        </motion.div>

                        {/* Package Tour Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12">
                            {tours.filter(t => t.tourType === 'package').map((tour, index) => (
                                <TourCard
                                    key={tour.id}
                                    tour={tour}
                                    index={index}
                                />
                            ))}
                        </div>

                        {/* Highlights Banner */}
                        <motion.div
                            className="p-6 sm:p-8 rounded-2xl bg-obsidian-900/50 border border-gold-500/20"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="font-display text-xl text-white mb-6 text-center">
                                What&apos;s Included in Every Package
                            </h3>
                            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                                {['Private Egyptologist', 'All Entrance Fees', 'Luxury Transport', 'Hotel & Cruise', 'Airport Transfers', 'Daily Meals', 'No Hidden Costs'].map((item, i) => (
                                    <motion.div
                                        key={item}
                                        className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-obsidian-800 border border-gold-500/20 text-white text-sm"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        whileHover={{ borderColor: 'rgba(245,158,11,0.5)', scale: 1.05 }}
                                    >
                                        {item}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Custom Trip CTA */}
                <section className="py-16 sm:py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-900/20 via-obsidian-950 to-scarab-900/20" />

                    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-6xl mb-6 block">𓂀</span>
                            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white mb-6">
                                Can&apos;t Find Your <span className="text-gradient-gold">Perfect Journey?</span>
                            </h2>
                            <p className="text-white/60 text-sm sm:text-lg mb-10 max-w-2xl mx-auto">
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

// Wrap in Suspense for useSearchParams
import { Suspense } from 'react';

export default function ToursPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-obsidian-950 flex items-center justify-center">
                <div className="text-gold-500 font-display text-xl loading-glyph">𓂀</div>
            </div>
        }>
            <ToursContent />
        </Suspense>
    );
}
