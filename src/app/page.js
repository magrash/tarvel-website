'use client';

import { useState } from 'react';
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
import { destinations, tours, experiences, testimonials, stats } from '@/lib/data';
import { ArrowRight, Star, MapPin, Clock, Users, Crown } from 'lucide-react';

export default function HomePage() {
    const [isLoading, setIsLoading] = useState(true);

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

                <main>
                    {/* Hero Section */}
                    <HeroSection />

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
                                    Explore the Ages
                                </motion.span>
                                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                                    Legendary <span className="text-gradient-gold">Destinations</span>
                                </h2>
                                <p className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base">
                                    From the ancient wonders of Giza to the crystal waters of the Red Sea,
                                    discover locations that have captivated travelers for millennia.
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
                                    View All Destinations
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

                    {/* Experience Levels Section */}
                    <section className="py-12 sm:py-24 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-950" />

                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23f59e0b' fill-opacity='0.4'/%3E%3C/svg%3E")`,
                                backgroundSize: '60px 60px',
                            }} />
                        </div>

                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div
                                className="text-center mb-16"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="inline-block text-gold-500 text-sm tracking-[0.3em] uppercase mb-4">
                                    Choose Your Path
                                </span>
                                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                                    Experience <span className="text-gradient-gold">Levels</span>
                                </h2>
                                <p className="text-white/60 max-w-2xl mx-auto">
                                    Whether you seek adventure, luxury, or the ultimate private journey,
                                    we have the perfect experience waiting for you.
                                </p>
                            </motion.div>

                            {/* Experience Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                                {experiences.map((exp, index) => (
                                    <motion.div
                                        key={exp.id}
                                        className="relative group"
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.2 }}
                                    >
                                        <motion.div
                                            className={`
                        relative p-5 sm:p-8 rounded-2xl
                        bg-gradient-to-br from-obsidian-900/80 to-obsidian-800/80
                        border border-gold-500/20
                        backdrop-blur-sm
                        hover:border-gold-500/50
                        transition-all duration-500
                        ${index === 1 ? 'lg:-mt-4 lg:mb-4' : ''}
                      `}
                                            whileHover={{ y: -10 }}
                                        >
                                            {/* Popular badge for Royal */}
                                            {index === 1 && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                                    <span className="px-4 py-1 rounded-full bg-gold-500 text-obsidian-950 text-xs font-bold uppercase tracking-wider">
                                                        Most Popular
                                                    </span>
                                                </div>
                                            )}

                                            {/* Icon */}
                                            <div className="text-5xl mb-6">{exp.icon}</div>

                                            {/* Title */}
                                            <h3 className="font-display text-2xl text-white mb-2">
                                                {exp.name}
                                            </h3>
                                            <p className="text-gold-500 text-sm italic mb-4">
                                                "{exp.tagline}"
                                            </p>

                                            {/* Description */}
                                            <p className="text-white/60 text-sm mb-6">
                                                {exp.description}
                                            </p>

                                            {/* Features */}
                                            <ul className="space-y-3 mb-8">
                                                {exp.features.map((feature, i) => (
                                                    <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                                                        <span className="text-gold-500">✦</span>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>

                                            {/* CTA */}
                                            <GlowButton
                                                variant={index === 1 ? 'primary' : 'secondary'}
                                                size="md"
                                                className="w-full"
                                                href={`/tours?level=${exp.id}`}
                                            >
                                                Explore {exp.name}
                                            </GlowButton>

                                            {/* Corner decorations */}
                                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold-500/30 rounded-tl-2xl" />
                                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold-500/30 rounded-br-2xl" />
                                        </motion.div>

                                        {/* Glow */}
                                        <div className="absolute -inset-1 rounded-2xl bg-gold-500/10 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Featured Tours Section */}
                    <section className="py-12 sm:py-24 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950" />

                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div
                                className="text-center mb-16"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="inline-block text-scarab-500 text-sm tracking-[0.3em] uppercase mb-4">
                                    Curated Journeys
                                </span>
                                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                                    Signature <span className="text-gradient-gold">Tours</span>
                                </h2>
                                <p className="text-white/60 max-w-2xl mx-auto">
                                    Expertly crafted itineraries that blend ancient wonders with modern luxury.
                                    Each journey is a carefully orchestrated symphony of experiences.
                                </p>
                            </motion.div>

                            {/* Tours Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {tours.slice(0, 4).map((tour, index) => (
                                    <TourCard
                                        key={tour.id}
                                        tour={tour}
                                        index={index}
                                        featured={index === 0}
                                    />
                                ))}
                            </div>

                            {/* Time Gate Banner */}
                            <motion.div
                                className="mt-10 sm:mt-16 p-4 sm:p-8 rounded-2xl bg-gradient-to-r from-scarab-900/50 via-nile-900/50 to-scarab-900/50 border border-scarab-500/30 relative overflow-hidden"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                {/* Animated background */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-scarab-500/10 to-transparent"
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                />

                                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-3xl">⚡</span>
                                            <h3 className="font-display text-xl sm:text-2xl text-white">
                                                Europe → Egypt <span className="text-scarab-400">Time Gate</span>
                                            </h3>
                                        </div>
                                        <p className="text-white/60 max-w-xl">
                                            Direct packages from London, Paris, Berlin, and more. Premium flights,
                                            luxury transfers, and curated experiences included.
                                        </p>
                                    </div>
                                    <GlowButton variant="teal" size="lg" href="/tours#timegate">
                                        View Time Gate Deals
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </GlowButton>
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    {/* Testimonials Section */}
                    <section className="py-12 sm:py-24 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-900 to-obsidian-950" />

                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div
                                className="text-center mb-16"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="inline-block text-gold-500 text-sm tracking-[0.3em] uppercase mb-4">
                                    Time Travelers Speak
                                </span>
                                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                                    What Our <span className="text-gradient-gold">Explorers</span> Say
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
                                            "{testimonial.text}"
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

                    {/* Client Gallery Section */}
                    <section className="py-12 sm:py-24 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950" />

                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div
                                className="text-center mb-16"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="inline-block text-gold-500 text-sm tracking-[0.3em] uppercase mb-4">
                                    Our Clients' Experiences
                                </span>
                                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                                    Captured <span className="text-gradient-gold">Moments</span>
                                </h2>
                                <p className="text-white/60 max-w-2xl mx-auto">
                                    Real stories from real travelers. These are the moments that define the Goba Travel experience.
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { src: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800&q=80", alt: "Pyramids Adventure" },
                                    { src: "https://images.unsplash.com/photo-1547448415-e9f5b28e570d?w=800&q=80", alt: "Nile Cruise" },
                                    { src: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800&q=80", alt: "Luxor Temple" },
                                    { src: "https://images.unsplash.com/photo-1445217143695-46712403d776?w=800&q=80", alt: "Desert Safari" },
                                    { src: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80", alt: "Old Cairo" },
                                    { src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", alt: "Red Sea" },
                                    { src: "https://images.unsplash.com/photo-1539109132314-347752418b7b?w=800&q=80", alt: "Aswan View" },
                                    { src: "https://images.unsplash.com/photo-1552423814-24852103d6d5?w=800&q=80", alt: "Egyptian Market" },
                                ].map((img, index) => (
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
                                    Ready to <span className="text-gradient-gold">Travel Through Time?</span>
                                </h2>
                                <p className="text-white/60 text-sm sm:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto">
                                    Your journey across 5000 years of history awaits. Step through the portal
                                    and discover the Egypt that lives beyond the ages.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <GlowButton variant="primary" size="xl" href="/booking">
                                        Begin Your Journey
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </GlowButton>
                                    <GlowButton variant="ghost" size="xl" href="/contact">
                                        Talk to an Expert
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
