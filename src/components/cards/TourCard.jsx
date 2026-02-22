'use client';

import { motion } from 'framer-motion';
import { Star, Calendar, Users, ArrowRight, MapPin, Clock, TrendingUp } from 'lucide-react';
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
        destination,
        tourType,
        description,
        timeline,
        highlights,
        image,
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

    const typeLabels = {
        'full-day': 'Full-Day Tour',
        'half-day': 'Half-Day Tour',
        'package': 'Package',
    };



    const durationText = days === 1 ? '1 Day' : days === 0 && nights === 1 ? 'Evening' : `${days} Days / ${nights} Nights`;

    const isPopular = reviews >= 100;
    const discountPct = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    return (
        <motion.div
            className={`group relative ${featured ? 'lg:col-span-2' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
        >
            <div
                className={`
                    glass-card relative rounded-2xl overflow-hidden
                    ${featured ? 'flex flex-col lg:flex-row' : ''}
                `}
            >
                {/* Image/Visual Area */}
                <div className={`relative ${featured ? 'lg:w-2/5' : ''} h-36 sm:h-48 overflow-hidden`}>
                    {image ? (
                        <img
                            src={image}
                            alt={title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${level === 'Explorer' ? 'from-teal-900 via-cyan-800 to-blue-900' :
                            level === 'Royal' ? 'from-amber-900 via-gold-800 to-yellow-900' :
                                'from-purple-900 via-violet-800 to-gold-900'
                            }`} />
                    )}

                    {/* Overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/80 via-obsidian-900/30 to-transparent" />

                    {/* Level badge */}
                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
                        <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r ${levelColors[level]} text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-lg`}>
                            {levelIcons[level]} {level}
                        </span>
                    </div>

                    {/* Tour type badge */}
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
                        <span className="glass-badge px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-gold-400 text-[9px] sm:text-xs uppercase tracking-wider font-semibold">
                            {typeLabels[tourType] || tourType}
                        </span>
                    </div>

                    {/* Popular badge */}
                    {isPopular && (
                        <div className="absolute bottom-4 right-4 z-10">
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-lg">
                                <TrendingUp className="w-3 h-3" /> Popular
                            </span>
                        </div>
                    )}

                    {/* Discount badge */}
                    {discountPct > 0 && (
                        <div className="absolute top-14 left-4 z-10">
                            <span className="px-2 py-1 rounded-full bg-red-500/90 text-white text-[10px] font-bold">
                                -{discountPct}%
                            </span>
                        </div>
                    )}

                    {/* Duration badge */}
                    <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gold-400" />
                            <span className="text-white text-[10px] sm:text-sm">{durationText}</span>
                        </div>
                        {maxGroup && (
                            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
                                <Users className="w-4 h-4 text-gold-400" />
                                <span className="text-white text-sm">Max {maxGroup}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className={`p-4 sm:p-6 ${featured ? 'lg:w-3/5' : ''}`}>
                    {/* Rating + Destination */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-gold-500 fill-gold-500' : 'text-gold-500/30'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-white/60">({reviews})</span>
                        </div>
                        {destination && (
                            <div className="flex items-center gap-1 text-gold-500/60">
                                <MapPin className="w-3.5 h-3.5" />
                                <span className="text-xs">{destination}</span>
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-lg sm:text-xl text-white mb-1 group-hover:text-gold-500 transition-colors leading-tight">
                        {title}
                    </h3>
                    <p className="text-gold-500/80 text-sm italic mb-3">
                        {subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-white/60 text-sm line-clamp-2 mb-4">
                        {description}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 mb-5">
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
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
                        <div>
                            {originalPrice && (
                                <span className="text-sm text-white/40 line-through mr-2">
                                    ${originalPrice.toLocaleString()}
                                </span>
                            )}
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl sm:text-3xl font-display text-gold-500">
                                    ${price.toLocaleString()}
                                </span>
                                <span className="text-sm text-white/40">/person</span>
                            </div>
                        </div>
                        <GlowButton variant="primary" size="sm" href={`/tours/${tour.id}`}>
                            View Details
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </GlowButton>
                    </div>
                </div>

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold-500/30 rounded-tl-2xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold-500/30 rounded-br-2xl" />
            </div>

            {/* Hover glow */}
            <div className="absolute -inset-1 rounded-2xl bg-gold-500/10 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div >
    );
}
