'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, Star, Clock, MapPin, SlidersHorizontal } from 'lucide-react';

export default function FilterBar({
    filters,
    onFilterChange,
    tourCount,
    totalCount,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [destDropdownOpen, setDestDropdownOpen] = useState(false);

    const {
        destination = 'all',
        tourType = 'all',
        budgetRange = [0, 1000],
        duration = 'all',
        minRating = 0,
    } = filters;

    const destinations = [
        { id: 'all', label: 'All Destinations' },
        { id: 'Cairo', label: 'Cairo' },
        { id: 'Giza', label: 'Giza' },
        { id: 'Luxor', label: 'Luxor' },
        { id: 'Aswan', label: 'Aswan' },
        { id: 'Alexandria', label: 'Alexandria' },
    ];

    const tourTypes = [
        { id: 'all', label: 'All Tours' },
        { id: 'full-day', label: 'Full-Day' },
        { id: 'half-day', label: 'Half-Day' },
        { id: 'package', label: 'Packages' },
    ];

    const durations = [
        { id: 'all', label: 'Any Duration' },
        { id: '1', label: '1 Day' },
        { id: 'multi', label: 'Multi-Day' },
    ];

    const ratings = [
        { id: 0, label: 'All Ratings' },
        { id: 4.5, label: '4.5+' },
        { id: 4.8, label: '4.8+' },
        { id: 5.0, label: '5.0' },
    ];

    const update = (key, value) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const clearAll = () => {
        onFilterChange({
            destination: 'all',
            tourType: 'all',
            budgetRange: [0, 1000],
            duration: 'all',
            minRating: 0,
        });
    };

    // Collect active filter tags
    const activeTags = [];
    if (destination !== 'all') {
        activeTags.push({ key: 'destination', label: destination, reset: 'all' });
    }
    if (tourType !== 'all') {
        const t = tourTypes.find(t => t.id === tourType);
        activeTags.push({ key: 'tourType', label: t?.label || tourType, reset: 'all' });
    }
    if (budgetRange[0] > 0 || budgetRange[1] < 1000) {
        activeTags.push({ key: 'budgetRange', label: `$${budgetRange[0]}–$${budgetRange[1]}`, reset: [0, 1000] });
    }
    if (duration !== 'all') {
        const d = durations.find(d => d.id === duration);
        activeTags.push({ key: 'duration', label: d?.label || duration, reset: 'all' });
    }
    if (minRating > 0) {
        activeTags.push({ key: 'minRating', label: `${minRating}+ ★`, reset: 0 });
    }

    return (
        <section className="glass py-4 sm:py-6 border-y border-gold-500/10 sticky top-20 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Mobile toggle */}
                <div className="flex items-center justify-between md:hidden mb-3">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gold-500/30 text-gold-500 text-sm"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                        {activeTags.length > 0 && (
                            <span className="w-5 h-5 rounded-full bg-gold-500 text-obsidian-950 text-xs flex items-center justify-center font-bold">
                                {activeTags.length}
                            </span>
                        )}
                    </button>
                    <span className="text-white/50 text-sm">
                        {tourCount} of {totalCount} tours
                    </span>
                </div>

                {/* Desktop: always visible / Mobile: collapsible */}
                <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
                    {/* Row 1: Destination + Tour Type */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
                        {/* Destination Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setDestDropdownOpen(!destDropdownOpen)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gold-500/30 text-white/80 text-sm hover:border-gold-500/60 transition-colors min-w-[180px] justify-between"
                            >
                                <span className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gold-500" />
                                    {destinations.find(d => d.id === destination)?.label}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-gold-500/60 transition-transform ${destDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {destDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className="absolute top-full left-0 mt-2 w-full min-w-[200px] rounded-xl glass-dark border border-gold-500/20 overflow-hidden z-50"
                                    >
                                        {destinations.map((dest) => (
                                            <button
                                                key={dest.id}
                                                onClick={() => {
                                                    update('destination', dest.id);
                                                    setDestDropdownOpen(false);
                                                }}
                                                className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${destination === dest.id
                                                    ? 'bg-gold-500/20 text-gold-400'
                                                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                                                    }`}
                                            >
                                                {dest.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Divider */}
                        <div className="hidden sm:block w-px h-8 bg-gold-500/20" />

                        {/* Tour Type buttons */}
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                            <span className="text-gold-500/60 text-sm shrink-0">Type:</span>
                            {tourTypes.map((type) => (
                                <motion.button
                                    key={type.id}
                                    className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all ${tourType === type.id
                                        ? 'bg-gold-500 text-obsidian-950 font-semibold'
                                        : 'border border-gold-500/30 text-white/70 hover:border-gold-500'
                                        }`}
                                    onClick={() => update('tourType', type.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {type.label}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Row 2: Budget + Duration + Rating */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                        {/* Budget Range */}
                        <div className="flex items-center gap-3 min-w-[220px]">
                            <span className="text-gold-500/60 text-sm shrink-0">Budget:</span>
                            <div className="flex-1 flex items-center gap-2">
                                <span className="text-xs text-white/50">${budgetRange[0]}</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    step="50"
                                    value={budgetRange[1]}
                                    onChange={(e) => update('budgetRange', [budgetRange[0], parseInt(e.target.value)])}
                                    className="flex-1 h-1.5 bg-gold-500/20 rounded-full appearance-none cursor-pointer
                                        [&::-webkit-slider-thumb]:appearance-none
                                        [&::-webkit-slider-thumb]:w-4
                                        [&::-webkit-slider-thumb]:h-4
                                        [&::-webkit-slider-thumb]:rounded-full
                                        [&::-webkit-slider-thumb]:bg-gold-500
                                        [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(245,158,11,0.5)]
                                        [&::-webkit-slider-thumb]:cursor-pointer
                                        [&::-moz-range-thumb]:w-4
                                        [&::-moz-range-thumb]:h-4
                                        [&::-moz-range-thumb]:rounded-full
                                        [&::-moz-range-thumb]:bg-gold-500
                                        [&::-moz-range-thumb]:border-0
                                        [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(245,158,11,0.5)]
                                        [&::-moz-range-thumb]:cursor-pointer"
                                />
                                <span className="text-xs text-white/50">${budgetRange[1]}</span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden sm:block w-px h-8 bg-gold-500/20" />

                        {/* Duration */}
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gold-500/60 shrink-0" />
                            {durations.map((d) => (
                                <motion.button
                                    key={d.id}
                                    className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all ${duration === d.id
                                        ? 'bg-scarab-500 text-white font-semibold'
                                        : 'border border-gold-500/30 text-white/70 hover:border-gold-500'
                                        }`}
                                    onClick={() => update('duration', d.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {d.label}
                                </motion.button>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="hidden sm:block w-px h-8 bg-gold-500/20" />

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-gold-500/60 shrink-0" />
                            {ratings.map((r) => (
                                <motion.button
                                    key={r.id}
                                    className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all ${minRating === r.id
                                        ? 'bg-gold-500 text-obsidian-950 font-semibold'
                                        : 'border border-gold-500/30 text-white/70 hover:border-gold-500'
                                        }`}
                                    onClick={() => update('minRating', r.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {r.label}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Active filter tags + result count */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                    {/* Desktop result count */}
                    <span className="hidden md:inline text-white/50 text-sm mr-2">
                        Showing {tourCount} of {totalCount} tours
                    </span>

                    <AnimatePresence>
                        {activeTags.map((tag) => (
                            <motion.button
                                key={tag.key}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-xs hover:bg-gold-500/25 transition-colors"
                                onClick={() => update(tag.key, tag.reset)}
                            >
                                {tag.label}
                                <X className="w-3 h-3" />
                            </motion.button>
                        ))}
                    </AnimatePresence>

                    {activeTags.length > 1 && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="px-3 py-1 rounded-full border border-white/10 text-white/40 text-xs hover:text-white/70 hover:border-white/30 transition-colors"
                            onClick={clearAll}
                        >
                            Clear All
                        </motion.button>
                    )}
                </div>
            </div>
        </section>
    );
}
