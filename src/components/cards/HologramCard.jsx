'use client';

import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function HologramCard({
    destination,
    index = 0,
    onClick
}) {
    const { name, tagline, description, era, region, rating, reviews, highlights, image } = destination;

    const eraColors = {
        ancient: 'from-gold-500/20 to-amber-500/20',
        hellenistic: 'from-purple-500/20 to-gold-500/20',
        modern: 'from-scarab-500/20 to-nile-500/20',
        mixed: 'from-gold-500/20 to-scarab-500/20',
    };

    return (
        <motion.div
            className="group relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
        >
            <motion.div
                className={`
          relative overflow-hidden rounded-2xl
          bg-gradient-to-br ${eraColors[era] || eraColors.ancient}
          border border-gold-500/20
          backdrop-blur-sm
          cursor-pointer
          transition-all duration-500
          hover:border-gold-500/50
        `}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={onClick}
            >
                {/* Hologram scan line - only on hover */}
                <div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-scan transition-opacity"
                />

                {/* Destination image */}
                <div className="relative h-32 xs:h-36 sm:h-40 md:h-48 overflow-hidden">
                    {/* Background image */}
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${era === 'ancient' ? 'from-amber-900 via-orange-800 to-gold-900' :
                            era === 'hellenistic' ? 'from-purple-900 via-indigo-800 to-gold-900' :
                                era === 'modern' ? 'from-teal-900 via-cyan-800 to-blue-900' :
                                    'from-gold-900 via-amber-800 to-orange-900'
                            }`} />
                    )}

                    {/* Overlay gradient for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/50 to-transparent" />

                    {/* Era badge */}
                    <div className="absolute top-4 left-4 z-10">
                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/40 backdrop-blur-sm border border-gold-500/30 text-gold-400 text-[10px] sm:text-xs uppercase tracking-wider font-semibold">
                            {era}
                        </span>
                    </div>

                    {/* Decorative hieroglyph */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-2xl sm:text-4xl text-white/40 drop-shadow-lg">
                        {era === 'ancient' ? '𓂀' : era === 'hellenistic' ? '𓃭' : era === 'modern' ? '𓅃' : '𓆣'}
                    </div>

                    {/* Floating pyramid icon */}
                    <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-3xl sm:text-5xl text-gold-500/60 group-hover:-translate-y-2 transition-transform duration-300 drop-shadow-lg">
                        △
                    </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 md:p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] sm:text-sm text-gold-500/60 tracking-wider uppercase">
                            {region}
                        </span>
                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gold-500 fill-gold-500" />
                            <span className="text-[11px] sm:text-sm text-gold-500">{rating}</span>
                            <span className="text-[10px] sm:text-xs text-white/40">({reviews.toLocaleString()})</span>
                        </div>
                    </div>

                    <h3 className="font-display text-sm xs:text-base sm:text-xl md:text-2xl text-white mb-1 sm:mb-2 group-hover:text-gold-500 transition-colors leading-tight">
                        {name}
                    </h3>

                    <p className="text-gold-500/80 text-[11px] sm:text-sm italic mb-1 sm:mb-3">
                        "{tagline}"
                    </p>

                    <p className="text-white/60 text-[11px] sm:text-sm line-clamp-2 mb-2 sm:mb-4 hidden xs:block">
                        {description}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-4">
                        {highlights?.slice(0, 3).map((highlight, i) => (
                            <span
                                key={i}
                                className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs bg-white/5 text-white/60 rounded"
                            >
                                {highlight}
                            </span>
                        ))}
                    </div>

                    {/* CTA */}
                    <motion.div
                        className="flex items-center gap-1 sm:gap-2 text-gold-500 font-display text-[11px] sm:text-sm tracking-wider"
                        whileHover={{ x: 5 }}
                    >
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4" />
                    </motion.div>
                </div>

                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold-500/30" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gold-500/30" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gold-500/30" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gold-500/30" />
            </motion.div>

            {/* Glow effect on hover */}
            <motion.div
                className="absolute -inset-1 rounded-2xl bg-gold-500/20 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            />
        </motion.div>
    );
}
