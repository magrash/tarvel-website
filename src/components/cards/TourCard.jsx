'use client';

import { motion } from 'framer-motion';
import { Star, Calendar, Users, Crown, ArrowRight, Sparkles } from 'lucide-react';
import GlowButton from '@/components/ui/GlowButton';

export default function TourCard({
    tour,
    index = 0,
    featured = false
}) {
    const {
        title,
        subtitle,
        days,
        nights,
        price,
        originalPrice,
        currency,
        level,
        category,
        description,
        timeline,
        highlights,
        maxGroup,
        rating,
        reviews,
        departureCity
    } = tour;

    const levelIcons = {
        Explorer: '🧭',
        Royal: '👑',
        Pharaoh: '𓂀',
    };

    const levelColors = {
        Explorer: 'from-scarab-500 to-nile-500',
        Royal: 'from-gold-500 to-amber-600',
        Pharaoh: 'from-purple-500 to-gold-500',
    };

    const isTimegate = category === 'timegate';

    return (
        <motion.div
            className={`group relative ${featured ? 'col-span-2' : ''}`}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
        >
            <motion.div
                className={`
          relative rounded-2xl overflow-hidden
          bg-obsidian-900/80 backdrop-blur-sm
          border border-gold-500/20
          hover:border-gold-500/40
          transition-all duration-500
          ${featured ? 'flex flex-col lg:flex-row' : ''}
        `}
                whileHover={{ y: -5 }}
            >
                {/* Time Gate Badge */}
                {isTimegate && (
                    <div className="absolute top-4 left-4 z-20">
                        <motion.div
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-scarab-500 to-nile-500 text-white text-xs font-bold uppercase tracking-wider"
                            animate={{ boxShadow: ['0 0 20px rgba(20,184,166,0.5)', '0 0 40px rgba(20,184,166,0.3)', '0 0 20px rgba(20,184,166,0.5)'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Sparkles className="w-4 h-4" />
                            Time Gate: {departureCity}
                        </motion.div>
                    </div>
                )}

                {/* Image/Visual Area */}
                <div className={`relative ${featured ? 'lg:w-2/5' : ''} h-48 bg-gradient-to-br from-obsidian-800 to-obsidian-900`}>
                    {/* Level badge */}
                    <div className="absolute top-4 right-4 z-10">
                        <span className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${levelColors[level]} text-white text-xs font-bold uppercase tracking-wider`}>
                            {levelIcons[level]} {level}
                        </span>
                    </div>

                    {/* Animated background lines */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"
                                style={{ top: `${20 + i * 15}%`, width: '100%' }}
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 3 + i, repeat: Infinity, ease: 'linear' }}
                            />
                        ))}
                    </div>

                    {/* Duration badge */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-3">
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-obsidian-900/80 backdrop-blur-sm border border-gold-500/20">
                            <Calendar className="w-4 h-4 text-gold-500" />
                            <span className="text-white text-sm">{days} Days</span>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-obsidian-900/80 backdrop-blur-sm border border-gold-500/20">
                            <Users className="w-4 h-4 text-gold-500" />
                            <span className="text-white text-sm">Max {maxGroup}</span>
                        </div>
                    </div>

                    {/* Pyramid decoration */}
                    <motion.div
                        className="absolute right-4 bottom-4 text-6xl text-gold-500/20"
                        animate={{ y: [0, -5, 0], rotate: [0, 5, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                    >
                        ⏳
                    </motion.div>
                </div>

                {/* Content */}
                <div className={`p-6 ${featured ? 'lg:w-3/5' : ''}`}>
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-gold-500 fill-gold-500' : 'text-gold-500/30'}`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-white/60">({reviews} reviews)</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-2xl text-white mb-1 group-hover:text-gold-500 transition-colors">
                        {title}
                    </h3>
                    <p className="text-gold-500/80 text-sm italic mb-3">
                        {subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-white/60 text-sm line-clamp-2 mb-4">
                        {description}
                    </p>

                    {/* Timeline preview */}
                    {featured && timeline && (
                        <div className="mb-4">
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                                {timeline.slice(0, 4).map((day, i) => (
                                    <div key={i} className="flex items-center gap-2 shrink-0">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs text-gold-500 font-display">Day {day.day}</span>
                                            <span className="text-xs text-white/60">{day.title}</span>
                                        </div>
                                        {i < 3 && (
                                            <motion.div
                                                className="w-8 h-px bg-gold-500/30"
                                                animate={{ scaleX: [0.5, 1, 0.5] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                        )}
                                    </div>
                                ))}
                                {timeline.length > 4 && (
                                    <span className="text-xs text-gold-500/60">+{timeline.length - 4} more</span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {highlights?.slice(0, 3).map((highlight, i) => (
                            <span
                                key={i}
                                className="px-2 py-1 text-xs bg-gold-500/10 text-gold-500 rounded border border-gold-500/20"
                            >
                                {highlight}
                            </span>
                        ))}
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-end justify-between">
                        <div>
                            {originalPrice && (
                                <span className="text-sm text-white/40 line-through mr-2">
                                    {currency === 'GBP' ? '£' : '€'}{originalPrice.toLocaleString()}
                                </span>
                            )}
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-display text-gold-500">
                                    {currency === 'GBP' ? '£' : '€'}{price.toLocaleString()}
                                </span>
                                <span className="text-sm text-white/40">/person</span>
                            </div>
                        </div>
                        <GlowButton variant="primary" size="sm" href={`/booking?tour=${tour.id}`}>
                            Book Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </GlowButton>
                    </div>
                </div>

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold-500/30 rounded-tl-2xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold-500/30 rounded-br-2xl" />
            </motion.div>

            {/* Hover glow */}
            <motion.div
                className="absolute -inset-1 rounded-2xl bg-gold-500/10 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            />
        </motion.div>
    );
}
