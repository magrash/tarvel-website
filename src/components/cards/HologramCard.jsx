'use client';

import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';

export default function HologramCard({
    destination,
    index = 0,
    onClick
}) {
    const { name, tagline, description, era, region, rating, reviews, highlights } = destination;

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
                {/* Hologram scan line */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/10 to-transparent"
                    initial={{ y: '-100%' }}
                    animate={{ y: '100%' }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />

                {/* Image placeholder / gradient background */}
                <div className="relative h-48 bg-gradient-to-br from-obsidian-800 to-obsidian-900 overflow-hidden">
                    {/* Era badge */}
                    <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/30 text-gold-500 text-xs uppercase tracking-wider">
                            {era}
                        </span>
                    </div>

                    {/* Decorative hieroglyph */}
                    <div className="absolute top-4 right-4 text-4xl text-gold-500/20">
                        𓂀
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-transparent to-transparent" />

                    {/* Animated lines */}
                    <svg className="absolute inset-0 w-full h-full opacity-30">
                        <motion.line
                            x1="0" y1="100%" x2="100%" y2="0"
                            stroke="url(#lineGradient)"
                            strokeWidth="1"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            transition={{ duration: 1.5 }}
                        />
                        <defs>
                            <linearGradient id="lineGradient">
                                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
                                <stop offset="50%" stopColor="#f59e0b" stopOpacity="1" />
                                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Floating pyramid icon */}
                    <motion.div
                        className="absolute bottom-4 right-4 text-6xl text-gold-500/40"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        △
                    </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gold-500/60 tracking-wider uppercase">
                            {region}
                        </span>
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
                            <span className="text-sm text-gold-500">{rating}</span>
                            <span className="text-xs text-white/40">({reviews.toLocaleString()})</span>
                        </div>
                    </div>

                    <h3 className="font-display text-2xl text-white mb-2 group-hover:text-gold-500 transition-colors">
                        {name}
                    </h3>

                    <p className="text-gold-500/80 text-sm italic mb-3">
                        "{tagline}"
                    </p>

                    <p className="text-white/60 text-sm line-clamp-2 mb-4">
                        {description}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {highlights?.slice(0, 3).map((highlight, i) => (
                            <span
                                key={i}
                                className="px-2 py-1 text-xs bg-white/5 text-white/60 rounded"
                            >
                                {highlight}
                            </span>
                        ))}
                    </div>

                    {/* CTA */}
                    <motion.div
                        className="flex items-center gap-2 text-gold-500 font-display text-sm tracking-wider"
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
