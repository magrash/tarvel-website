'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/Footer';
import HologramCard from '@/components/cards/HologramCard';
import CustomCursor from '@/components/ui/CustomCursor';
import AIOracle from '@/components/oracle/AIOracle';
import { destinations } from '@/lib/data';
import { Search, Filter, MapPin } from 'lucide-react';

export default function DestinationsPage() {
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filters = [
        { id: 'all', label: 'All Destinations' },
        { id: 'ancient', label: 'Ancient Wonders' },
        { id: 'hellenistic', label: 'Hellenistic Era' },
        { id: 'modern', label: 'Modern Egypt' },
        { id: 'mixed', label: 'Mixed Heritage' },
    ];

    const filteredDestinations = destinations.filter((dest) => {
        const matchesFilter = activeFilter === 'all' || dest.era === activeFilter;
        const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dest.region.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <>
            <CustomCursor />
            <AIOracle />
            <Header />

            <main className="min-h-screen bg-obsidian-950">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950" />

                    {/* Decorative background */}
                    <div className="absolute inset-0 opacity-10">
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[400px] text-gold-500"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                        >
                            𓂀
                        </motion.div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block text-scarab-500 text-sm tracking-[0.3em] uppercase mb-4">
                                Explore the Ages
                            </span>
                            <h1 className="font-display text-5xl md:text-7xl text-white mb-6">
                                Legendary <span className="text-gradient-gold">Destinations</span>
                            </h1>
                            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
                                From the ancient wonders of Giza to the crystal waters of the Red Sea,
                                discover locations that have captivated travelers for millennia.
                            </p>

                            {/* Search Bar */}
                            <div className="max-w-md mx-auto relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-500/60" />
                                <input
                                    type="text"
                                    placeholder="Search destinations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 rounded-xl bg-obsidian-900/80 border border-gold-500/20 text-white placeholder:text-white/40 focus:outline-none focus:border-gold-500 transition-colors"
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Filters Section */}
                <section className="py-8 border-y border-gold-500/10">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
                            <Filter className="w-5 h-5 text-gold-500 shrink-0" />
                            {filters.map((filter) => (
                                <motion.button
                                    key={filter.id}
                                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${activeFilter === filter.id
                                            ? 'bg-gold-500 text-obsidian-950 font-semibold'
                                            : 'border border-gold-500/30 text-white/70 hover:border-gold-500'
                                        }`}
                                    onClick={() => setActiveFilter(filter.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {filter.label}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Destinations Grid */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        {filteredDestinations.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredDestinations.map((destination, index) => (
                                    <HologramCard
                                        key={destination.id}
                                        destination={destination}
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
                                <MapPin className="w-16 h-16 text-gold-500/30 mx-auto mb-4" />
                                <h3 className="text-white text-xl mb-2">No destinations found</h3>
                                <p className="text-white/60">Try adjusting your search or filter</p>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Map Section Placeholder */}
                <section className="py-16 bg-obsidian-900/50">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <motion.div
                            className="relative h-96 rounded-2xl bg-gradient-to-br from-obsidian-800 to-obsidian-900 border border-gold-500/20 overflow-hidden flex items-center justify-center"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            {/* Decorative map elements */}
                            <div className="absolute inset-0 opacity-20">
                                <svg className="w-full h-full" viewBox="0 0 800 400">
                                    {/* Simplified Egypt map outline */}
                                    <motion.path
                                        d="M400 50 L500 100 L550 200 L500 350 L350 350 L300 200 L350 100 Z"
                                        fill="none"
                                        stroke="#f59e0b"
                                        strokeWidth="2"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        transition={{ duration: 2 }}
                                    />
                                    {/* Nile River */}
                                    <motion.path
                                        d="M420 80 L400 150 L420 250 L400 350"
                                        fill="none"
                                        stroke="#0ea5e9"
                                        strokeWidth="3"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        transition={{ duration: 2, delay: 0.5 }}
                                    />
                                </svg>
                            </div>

                            {/* Destination markers */}
                            {destinations.slice(0, 4).map((dest, i) => (
                                <motion.div
                                    key={dest.id}
                                    className="absolute"
                                    style={{
                                        left: `${25 + i * 15}%`,
                                        top: `${30 + (i % 2) * 20}%`,
                                    }}
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ delay: 1 + i * 0.2 }}
                                >
                                    <motion.div
                                        className="relative"
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                                    >
                                        <div className="w-4 h-4 rounded-full bg-gold-500 glow-gold" />
                                        <span className="absolute top-6 left-1/2 -translate-x-1/2 text-xs text-gold-500 whitespace-nowrap">
                                            {dest.name}
                                        </span>
                                    </motion.div>
                                </motion.div>
                            ))}

                            <div className="relative z-10 text-center">
                                <MapPin className="w-12 h-12 text-gold-500 mx-auto mb-4" />
                                <h3 className="font-display text-2xl text-white mb-2">Interactive Map</h3>
                                <p className="text-white/60">Explore Egypt's wonders across millennia</p>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
