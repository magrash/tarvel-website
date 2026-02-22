'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function TourRecommendations({
    destination = null,
    budget = null,
    tourType = null,
    excludeTourId = null,
    title = 'Recommended For You',
    limit = 4,
}) {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRecommendations() {
            try {
                const params = new URLSearchParams();
                if (destination) params.set('destination', destination);
                if (budget) params.set('budget', budget);
                if (tourType) params.set('tourType', tourType);
                if (excludeTourId) params.set('excludeTourId', excludeTourId);
                params.set('limit', limit);

                const res = await fetch(`/api/recommendations?${params.toString()}`);
                if (res.ok) {
                    const data = await res.json();
                    setRecommendations(data.recommendations || []);
                }
            } catch (err) {
                console.error('Failed to fetch recommendations:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchRecommendations();
    }, [destination, budget, tourType, excludeTourId, limit]);

    if (loading) {
        return (
            <div className="py-12">
                <div className="flex items-center justify-center gap-2 text-gold-500/50">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="text-2xl"
                    >
                        𓂀
                    </motion.div>
                    <span className="text-sm">Finding perfect tours for you...</span>
                </div>
            </div>
        );
    }

    if (recommendations.length === 0) return null;

    return (
        <section className="py-12">
            <div className="flex items-center gap-3 mb-8">
                <Sparkles className="w-6 h-6 text-gold-500" />
                <h2 className="font-display text-2xl text-white">{title}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendations.map((tour, i) => (
                    <motion.div
                        key={tour.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Link href={`/tours/${tour.id}`}>
                            <div className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:border-gold-500/30 transition-all">
                                {/* Image */}
                                <div className="relative h-36 overflow-hidden">
                                    {tour.image ? (
                                        <img
                                            src={tour.image}
                                            alt={tour.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gold-500/20 to-scarab-500/20 flex items-center justify-center">
                                            <span className="text-3xl">𓃭</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 to-transparent" />

                                    {/* Score badge */}
                                    {tour.score > 0.6 && (
                                        <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-gold-500/20 backdrop-blur-md border border-gold-500/30 text-gold-400 text-xs font-semibold">
                                            {Math.round(tour.score * 100)}% match
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-display text-sm text-white mb-1 line-clamp-2 leading-tight group-hover:text-gold-400 transition-colors">
                                        {tour.title}
                                    </h3>

                                    <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
                                        <MapPin className="w-3 h-3" />
                                        <span>{tour.destination}</span>
                                        <span className="text-white/20">·</span>
                                        <Clock className="w-3 h-3" />
                                        <span>{tour.days || 1}D</span>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-2">
                                        <Star className="w-3 h-3 text-gold-500 fill-gold-500" />
                                        <span className="text-white/60 text-xs">{tour.rating} ({tour.reviews})</span>
                                    </div>

                                    {/* Reasons */}
                                    {tour.reasons && tour.reasons.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {tour.reasons.slice(0, 2).map((reason, j) => (
                                                <span
                                                    key={j}
                                                    className="px-2 py-0.5 rounded-full bg-scarab-500/10 text-scarab-400 text-[10px] border border-scarab-500/20"
                                                >
                                                    {reason}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Price */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-gold-400 font-display text-lg">${tour.price}</span>
                                            <span className="text-white/30 text-xs">/person</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gold-500/50 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
