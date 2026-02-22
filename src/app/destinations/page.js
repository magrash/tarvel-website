'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/Footer';
import HologramCard from '@/components/cards/HologramCard';
import { destinations as fallbackDestinations } from '@/lib/data';
import { Search, SlidersHorizontal, MapPin, Star, Filter, X } from 'lucide-react';

export default function DestinationsPage() {
    const [destinations, setDestinations] = useState(fallbackDestinations);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All');

    useEffect(() => {
        fetch('/api/content')
            .then(res => res.json())
            .then(data => {
                if (data.destinations?.length) setDestinations(data.destinations);
            })
            .catch(() => { });
    }, []);

    const filters = useMemo(() => {
        const types = ['All', ...new Set(destinations.map(d => d.type).filter(Boolean))];
        return types;
    }, [destinations]);

    const filteredDestinations = useMemo(() => {
        return destinations.filter(d => {
            const matchesSearch = d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = selectedFilter === 'All' || d.type === selectedFilter;
            return matchesSearch && matchesFilter;
        });
    }, [destinations, searchTerm, selectedFilter]);

    return (
        <>
            <Header />
            <main className="pt-24 pb-16 min-h-screen">
                {/* Hero */}
                <section className="pb-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950" />
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <span className="inline-block text-scarab-500 text-sm tracking-[0.3em] uppercase mb-4">
                                Discover Egypt
                            </span>
                            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-4">
                                Ancient <span className="text-gradient-gold">Destinations</span>
                            </h1>
                            <p className="text-white/60 max-w-2xl mx-auto">
                                Explore the timeless wonders that have captivated travelers for millennia.
                            </p>
                        </motion.div>

                        {/* Search */}
                        <motion.div
                            className="mt-8 max-w-xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input
                                    type="text"
                                    placeholder="Search destinations..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-obsidian-900/60 border border-gold-500/20 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-gold-500/40 backdrop-blur-xl"
                                />
                            </div>
                        </motion.div>

                        {/* Filters */}
                        <motion.div
                            className="mt-6 flex flex-wrap justify-center gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {filters.map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setSelectedFilter(filter)}
                                    className={`px-4 py-1.5 rounded-full text-sm transition-all ${selectedFilter === filter
                                            ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                                            : 'text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent'
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Destinations Grid */}
                <section className="relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {filteredDestinations.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                                <MapPin className="w-12 h-12 text-gold-500/30 mx-auto mb-4" />
                                <h3 className="text-white/60 text-lg">No destinations found</h3>
                                <p className="text-white/30 text-sm mt-2">Try a different search term or filter.</p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-8">
                                {filteredDestinations.map((destination, index) => (
                                    <HologramCard
                                        key={destination.id}
                                        destination={destination}
                                        index={index}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
