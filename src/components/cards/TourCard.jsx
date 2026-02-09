'use client';

import { motion } from 'framer-motion';
import { Star, Calendar, Users, ArrowRight, Sparkles } from 'lucide-react';
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
        >
            <div
                className={`
                    relative rounded-2xl overflow-hidden
                    bg-obsidian-900/80 backdrop-blur-sm
                    border border-gold-500/20
                    hover:border-gold-500/40
                    hover:-translate-y-1
                    transition-all duration-300
                    ${featured ? 'flex flex-col lg:flex-row' : ''}
                `}
            >
                {/* Time Gate Badge */}
                {isTimegate && (
                    <div className="absolute top-4 left-4 z-20">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-scarab-500 to-nile-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-scarab-500/30">
                            <Sparkles className="w-4 h-4" />
                            Time Gate: {departureCity}
                        </div>
                    </div>
                )}

                {/* Image/Visual Area with procedural graphics */}
                <div className={`relative ${featured ? 'lg:w-2/5' : ''} h-48 overflow-hidden`}>
                    {/* Dynamic gradient based on level */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${level === 'Explorer' ? 'from-teal-900 via-cyan-800 to-blue-900' :
                        level === 'Royal' ? 'from-amber-900 via-gold-800 to-yellow-900' :
                            'from-purple-900 via-violet-800 to-gold-900'
                        }`} />

                    {/* Sun glow */}
                    <div className={`absolute top-6 left-8 w-20 h-20 rounded-full blur-md opacity-70 ${level === 'Explorer' ? 'bg-cyan-400' :
                        level === 'Royal' ? 'bg-gold-400' :
                            'bg-purple-400'
                        }`} />
                    <div className={`absolute top-6 left-8 w-14 h-14 rounded-full ${level === 'Explorer' ? 'bg-gradient-to-br from-cyan-200 to-cyan-400' :
                        level === 'Royal' ? 'bg-gradient-to-br from-gold-200 to-gold-500' :
                            'bg-gradient-to-br from-purple-200 to-purple-400'
                        }`} />

                    {/* Nile river */}
                    <svg className="absolute bottom-0 left-0 w-full h-16 opacity-50" viewBox="0 0 400 60" preserveAspectRatio="none">
                        <path d="M0,60 C100,40 200,50 300,35 S400,45 400,60 Z" fill="rgba(30,64,175,0.4)" />
                        <path d="M0,60 C80,50 180,55 280,45 S400,50 400,60 Z" fill="rgba(59,130,246,0.3)" />
                    </svg>

                    {/* Temple columns silhouette */}
                    <svg className="absolute bottom-0 right-4 w-32 h-20 opacity-40" viewBox="0 0 120 80">
                        <rect x="10" y="20" width="8" height="60" fill="rgba(0,0,0,0.5)" />
                        <rect x="30" y="15" width="8" height="65" fill="rgba(0,0,0,0.6)" />
                        <rect x="50" y="10" width="8" height="70" fill="rgba(0,0,0,0.7)" />
                        <rect x="70" y="15" width="8" height="65" fill="rgba(0,0,0,0.6)" />
                        <rect x="90" y="20" width="8" height="60" fill="rgba(0,0,0,0.5)" />
                        <rect x="0" y="5" width="110" height="8" fill="rgba(0,0,0,0.5)" />
                    </svg>

                    {/* Level badge */}
                    <div className="absolute top-4 right-4 z-10">
                        <span className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${levelColors[level]} text-white text-xs font-bold uppercase tracking-wider shadow-lg`}>
                            {levelIcons[level]} {level}
                        </span>
                    </div>

                    {/* Duration badge */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-3">
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
                            <Calendar className="w-4 h-4 text-gold-400" />
                            <span className="text-white text-sm">{days} Days</span>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
                            <Users className="w-4 h-4 text-gold-400" />
                            <span className="text-white text-sm">Max {maxGroup}</span>
                        </div>
                    </div>

                    {/* Hourglass decoration */}
                    <div className="absolute right-4 bottom-4 text-5xl text-white/20">
                        ⏳
                    </div>
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

                    {/* Timeline preview - only for featured, simplified */}
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
                                            <div className="w-8 h-px bg-gold-500/30" />
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
            </div>

            {/* Hover glow - only visible on hover via CSS */}
            <div className="absolute -inset-1 rounded-2xl bg-gold-500/10 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
    );
}
