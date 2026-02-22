'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CinematicLoader from '@/components/loading/CinematicLoader';
import CustomCursor from '@/components/ui/CustomCursor';
import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/Footer';
import HeroSection from '@/components/hero/HeroSection';
import AIOracle from '@/components/oracle/AIOracle';
import HologramCard from '@/components/cards/HologramCard';
import TourCard from '@/components/cards/TourCard';
import GlowButton from '@/components/ui/GlowButton';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import TrustBadges from '@/components/ui/TrustBadges';
import ScrollToTop from '@/components/ui/ScrollToTop';
import SectionDivider from '@/components/ui/SectionDivider';
import {
    destinations as fallbackDestinations,
    tours as fallbackTours,
    testimonials as fallbackTestimonials,
    stats as fallbackStats,
} from '@/lib/data';
import { ArrowRight, Star, MapPin, Clock, Users, Crown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(true);
    const [destinations, setDestinations] = useState(fallbackDestinations);
    const [tours, setTours] = useState(fallbackTours);
    const [testimonials, setTestimonials] = useState(fallbackTestimonials);
    const [stats, setStats] = useState(fallbackStats);
    const [hero, setHero] = useState(null);
    const [gallery, setGallery] = useState(null);

    useEffect(() => {
        fetch('/api/content')
            .then(res => res.json())
            .then(data => {
                if (data.destinations?.length) setDestinations(data.destinations);
                if (data.tours?.length) setTours(data.tours);
                if (data.testimonials?.length) setTestimonials(data.testimonials);
                if (data.stats) setStats(data.stats);
                if (data.hero) setHero(data.hero);
                if (data.gallery?.length) setGallery(data.gallery);
            })
            .catch(() => { });
    }, []);

    const galleryImages = gallery
        ? gallery.map(g => ({ src: g.url, alt: `Gallery ${g.id}` }))
        : [
            { src: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800&q=80", alt: "Pyramids Adventure" },
            { src: "https://images.unsplash.com/photo-1547448415-e9f5b28e570d?w=800&q=80", alt: "Nile Cruise" },
            { src: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800&q=80", alt: "Luxor Temple" },
            { src: "https://images.unsplash.com/photo-1445217143695-46712403d776?w=800&q=80", alt: "Desert Safari" },
            { src: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80", alt: "Old Cairo" },
            { src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", alt: "Red Sea" },
            { src: "https://images.unsplash.com/photo-1539109132314-347752418b7b?w=800&q=80", alt: "Aswan View" },
            { src: "https://images.unsplash.com/photo-1552423814-24852103d6d5?w=800&q=80", alt: "Egyptian Market" },
        ];

    return (
        <>
            {/* Cinematic Loading */}
            {isLoading && <CinematicLoader onComplete={() => setIsLoading(false)} />}

            {/* Custom Cursor */}
            <CustomCursor />

            {/* AI Oracle */}
            <AIOracle />

            <div className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
                <Header />

                {/* Scroll to Top */}
                <ScrollToTop />

                <main>
                    {/* Hero Section */}
                    <HeroSection />

                    {/* Trust Badges */}
                    <TrustBadges />

                    {/* Featured Destinations Section */}
                    <section className="py-12 sm:py-24 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950" />

                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {/* Section Header */}
                            <motion.div
                                className="text-center mb-10 sm:mb-16"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <motion.span
                                    className="inline-block text-scarab-500 text-sm tracking-[0.3em] uppercase mb-4"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                >
                                    {t('nav.destinations')}
                                </motion.span>
                                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                                    {t('destinations.subtitle')}
                                </h2>
                                <p className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base">
                                    {t('hero.subtitle')}
                                </p>
                            </motion.div>

                            {/* Destinations Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-8">
                                {destinations.slice(0, 6).map((destination, index) => (
                                    <HologramCard
                                        key={destination.id}
                                        destination={destination}
                                        index={index}
                                    />
                                ))}
                            </div>

                            {/* View All CTA */}
                            <motion.div
                                className="text-center mt-12"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                            >
                                <GlowButton variant="secondary" size="lg" href="/destinations">
                                    {t('destinations.allDestinations')}
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </GlowButton>
                            </motion.div>
                        </div>

                        {/* Decorative hieroglyphs */}
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/10 text-6xl space-y-4 hidden lg:block">
                            <div>𓀀</div>
                            <div>𓂀</div>
                            <div>𓃭</div>
                        </div>
                    </section>


                    {/* Featured Tours Section */}
                    <section className="py-12 sm:py-24 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950" />

                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div
                                className="text-center mb-8 sm:mb-16"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="inline-block text-scarab-500 text-sm tracking-[0.3em] uppercase mb-4">
                                    {t('tours.subtitle')}
                                </span>
                                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                                    {t('tours.title')}
                                </h2>
                                <p className="text-white/60 max-w-2xl mx-auto">
                                    {t('hero.subtitle')}
                                </p>
                            </motion.div>

                            {/* Tours Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                                {tours.slice(0, 4).map((tour, index) => (
                                    <TourCard
                                        key={tour.id}
                                        tour={tour}
                                        index={index}
                                        featured={index === 0}
                                    />
                                ))}
                            </div>

                            {/* Animated Stats Strip */}
                            <motion.div
                                className="mt-10 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <AnimatedCounter
                                    value={stats.yearsExperience}
                                    suffix="+"
                                    label={t('stats.yearsExperience')}
                                    icon="🏛️"
                                    delay={0}
                                />
                                <AnimatedCounter
                                    value={Math.floor(stats.happyTravelers / 1000)}
                                    suffix="K+"
                                    label={t('stats.happyTravelers')}
                                    icon="✈️"
                                    delay={0.1}
                                />
                                <AnimatedCounter
                                    value={stats.destinationsCovered}
                                    suffix=""
                                    label={t('stats.destinationsCovered')}
                                    icon="📍"
                                    delay={0.2}
                                />
                                <AnimatedCounter
                                    value={stats.averageRating}
                                    suffix="★"
                                    label={t('stats.averageRating')}
                                    icon="⭐"
                                    delay={0.3}
                                />
                            </motion.div>
                        </div>
                    </section>

                    {/* Testimonials Section */}
                    <section className="py-12 sm:py-24 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-900 to-obsidian-950" />

                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div
                                className="text-center mb-8 sm:mb-16"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="inline-block text-gold-500 text-sm tracking-[0.3em] uppercase mb-4">
                                    {t('testimonials.subtitle')}
                                </span>
                                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                                    {t('testimonials.title')}
                                </h2>
                            </motion.div>

                            {/* Testimonials Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                {testimonials.map((testimonial, index) => (
                                    <motion.div
                                        key={testimonial.id}
                                        className="p-6 rounded-2xl bg-obsidian-900/50 border border-gold-500/20 backdrop-blur-sm"
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        {/* Rating */}
                                        <div className="flex gap-1 mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-gold-500 fill-gold-500" />
                                            ))}
                                        </div>

                                        {/* Quote */}
                                        <p className="text-white/80 text-sm italic mb-6">
                                            &quot;{testimonial.text}&quot;
                                        </p>

                                        {/* Author */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-lg">
                                                {testimonial.flag}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium text-sm">{testimonial.name}</p>
                                                <p className="text-gold-500/60 text-xs">{testimonial.tour}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Why Egypt Section */}
                    <section className="py-12 sm:py-24 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-950" />

                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div
                                className="text-center mb-8 sm:mb-16"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="inline-block text-scarab-500 text-sm tracking-[0.3em] uppercase mb-4">
                                    {t('whyEgypt.subtitle')}
                                </span>
                                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                                    {t('whyEgypt.title')} <span className="text-gradient-gold">{t('whyEgypt.titleHighlight')}</span>
                                </h2>
                                <p className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base">
                                    {t('whyEgypt.subtitle')}
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                                {(hero?.whyEgypt || [
                                    {
                                        icon: '🏛️',
                                        title: 'Historical Wonders',
                                        description: 'Over 5,000 years of civilization. From the Great Pyramids to the Valley of the Kings, treasures found nowhere else on Earth.',
                                        highlight: '7 UNESCO World Heritage Sites',
                                    },
                                    {
                                        icon: '🤝',
                                        title: 'Warm Hospitality',
                                        description: 'Egypt is renowned for its legendary hospitality. Every traveler is treated as an honored guest, with warmth at every turn.',
                                        highlight: 'Among the friendliest nations',
                                    },
                                    {
                                        icon: '💎',
                                        title: 'Incredible Value',
                                        description: 'World-class luxury experiences, private Egyptologist guides, and 5-star service at a fraction of the cost of other destinations.',
                                        highlight: 'Full-day tours from just $20',
                                    },
                                ]).map((item, index) => (
                                    <motion.div
                                        key={item.title}
                                        className="relative group p-6 sm:p-8 rounded-2xl bg-obsidian-900/60 border border-gold-500/15 backdrop-blur-sm hover:border-gold-500/40 transition-all duration-500"
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.15 }}
                                        whileHover={{ y: -8 }}
                                    >
                                        <span className="text-4xl mb-4 block">{item.icon}</span>
                                        <h3 className="font-display text-xl text-white mb-3">{item.title}</h3>
                                        <p className="text-white/60 text-sm mb-4 leading-relaxed">{item.description}</p>
                                        <div className="flex items-center gap-2 text-gold-500 text-xs font-semibold uppercase tracking-wider">
                                            <span className="w-5 h-px bg-gold-500/60" />
                                            {item.highlight}
                                        </div>

                                        {/* Corner decorations */}
                                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold-500/20 rounded-tl-2xl" />
                                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gold-500/20 rounded-br-2xl" />

                                        {/* Glow effect */}
                                        <div className="absolute -inset-1 rounded-2xl bg-gold-500/5 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Client Gallery Section */}
                    <section className="py-12 sm:py-24 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950" />

                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div
                                className="text-center mb-8 sm:mb-16"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="inline-block text-gold-500 text-sm tracking-[0.3em] uppercase mb-4">
                                    {t('common.gallery')}
                                </span>
                                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                                    {t('common.gallery')}
                                </h2>
                                <p className="text-white/60 max-w-2xl mx-auto">
                                    {t('testimonials.subtitle')}
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {galleryImages.slice(0, 8).map((img, index) => (
                                    <motion.div
                                        key={index}
                                        className="relative aspect-square overflow-hidden rounded-xl border border-gold-500/20 group"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <img
                                            src={img.src}
                                            alt={img.alt}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                                        />
                                        <div className="absolute inset-0 bg-obsidian-950/20 group-hover:bg-transparent transition-colors duration-300" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="py-12 sm:py-24 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-gold-900/20 via-obsidian-950 to-scarab-900/20" />

                        {/* Animated pyramids background */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10">
                            <motion.div
                                className="text-[150px] sm:text-[300px] text-gold-500"
                                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                                transition={{ duration: 10, repeat: Infinity }}
                            >
                                △
                            </motion.div>
                        </div>

                        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="text-6xl mb-6 block">𓂀</span>
                                <h2 className="font-display text-3xl sm:text-4xl md:text-6xl text-white mb-4 sm:mb-6">
                                    {t('hero.ctaPrimary')} <span className="text-gradient-gold">{t('hero.titleHighlight')}</span>
                                </h2>
                                <p className="text-white/60 text-sm sm:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto">
                                    {t('hero.subtitle')}
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <GlowButton variant="primary" size="xl" href="/booking">
                                        {t('nav.bookNow')}
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </GlowButton>
                                    <GlowButton variant="ghost" size="xl" href="/contact">
                                        {t('footer.contactUs')}
                                    </GlowButton>
                                </div>
                            </motion.div>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
