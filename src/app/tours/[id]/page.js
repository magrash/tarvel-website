'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star, MapPin, Clock, Users, Calendar, ChevronDown, ChevronUp,
    Check, X, ArrowLeft, Share2, Heart, Shield, Phone, Camera, HelpCircle
} from 'lucide-react';
import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/Footer';
import CustomCursor from '@/components/ui/CustomCursor';
import AIOracle from '@/components/oracle/AIOracle';
import TourBookingCalendar from '@/components/booking/TourBookingCalendar';
import TourEnquiryForm from '@/components/booking/TourEnquiryForm';
import TourRecommendations from '@/components/cards/TourRecommendations';
import GlowButton from '@/components/ui/GlowButton';
import Link from 'next/link';

const TABS = [
    { id: 'overview', label: 'Overview', icon: Calendar },
    { id: 'cost', label: 'Cost Info', icon: Check },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'gallery', label: 'Gallery', icon: Camera },
];

const BOOKING_TABS = [
    { id: 'booking', label: 'Booking Form' },
    { id: 'enquiry', label: 'Enquiry Form' },
];

export default function TourDetailPage() {
    const params = useParams();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [activeBookingTab, setActiveBookingTab] = useState('booking');
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        async function fetchTour() {
            try {
                const res = await fetch(`/api/tours/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setTour(data);
                    // Track view for AI recommendations
                    fetch('/api/track', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ event: 'view', tourId: data.id }),
                    }).catch(() => { });
                }
            } catch (err) {
                console.error('Failed to fetch tour:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchTour();
    }, [params.id]);

    if (loading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-obsidian-950 flex items-center justify-center">
                    <motion.div
                        className="text-6xl"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                        𓂀
                    </motion.div>
                </main>
            </>
        );
    }

    if (!tour) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-obsidian-950 flex flex-col items-center justify-center gap-6">
                    <span className="text-6xl">𓃭</span>
                    <h1 className="font-display text-3xl text-white">Tour Not Found</h1>
                    <p className="text-white/60">The tour you&apos;re looking for doesn&apos;t exist.</p>
                    <GlowButton variant="primary" href="/tours">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Tours
                    </GlowButton>
                </main>
                <Footer />
            </>
        );
    }

    const durationText = tour.days === 1 ? '1 Day' : tour.days === 0 && tour.nights === 1 ? 'Evening' : `${tour.days} Days / ${tour.nights} Nights`;
    const typeLabels = {
        'full-day': 'Full-Day Tour',
        'half-day': 'Half-Day Tour',
        'package': 'Multi-Day Package',
    };

    // Generate FAQs from tour data
    const tourFaqs = [
        {
            question: 'What is included in this tour?',
            answer: tour.included ? tour.included.join(', ') : 'Contact us for details.',
        },
        {
            question: 'What is the cancellation policy?',
            answer: 'Free cancellation up to 24 hours before the tour. A 50% charge applies for late cancellations. Full refund if cancelled 24+ hours in advance.',
        },
        {
            question: 'What should I bring?',
            answer: 'Comfortable shoes, sunscreen, a hat, and a camera. For temple visits, modest clothing covering shoulders and knees is recommended.',
        },
        {
            question: 'Is this tour suitable for children?',
            answer: 'Yes! Children aged 0-2 are free, and children under 11 receive a 50% discount. The tour is suitable for all ages.',
        },
        {
            question: 'Are hotel pickup and drop-off included?',
            answer: tour.included?.some(item => item.toLowerCase().includes('pickup'))
                ? 'Yes! Hotel pickup and drop-off are included in the tour price.'
                : 'Please contact us to confirm pickup arrangements for your location.',
        },
        {
            question: 'Can I customize this tour?',
            answer: 'Absolutely! We can tailor the itinerary to your preferences. Contact us to discuss your ideal experience.',
        },
    ];

    return (
        <>
            <CustomCursor />
            <AIOracle />
            <Header />

            <main className="min-h-screen bg-obsidian-950">
                {/* Hero Image Section */}
                <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
                    <img
                        src={tour.image}
                        alt={tour.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950/60 to-transparent" />

                    {/* Back Button & Actions */}
                    <div className="absolute top-24 left-0 right-0 z-10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                            <Link
                                href="/tours"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg glass-badge text-white hover:text-gold-400 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="text-sm">All Tours</span>
                            </Link>
                            <div className="flex items-center gap-3">
                                <motion.button
                                    onClick={() => setLiked(!liked)}
                                    className="p-2.5 rounded-lg glass-badge transition-colors"
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                                </motion.button>
                                <motion.button
                                    className="p-2.5 rounded-lg glass-badge text-white"
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Share2 className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Badges overlay */}
                    <div className="absolute bottom-8 left-0 right-0">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-wrap items-center gap-3"
                            >
                                <span className="px-3 py-1.5 rounded-full glass-badge text-gold-400 text-xs uppercase tracking-wider font-semibold">
                                    {typeLabels[tour.tourType] || tour.tourType}
                                </span>
                                <span className="px-3 py-1.5 rounded-full glass-badge text-white text-xs flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-gold-400" />
                                    {durationText}
                                </span>
                                <span className="px-3 py-1.5 rounded-full glass-badge text-white text-xs flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-gold-400" />
                                    {tour.destination}
                                </span>
                                {tour.maxPax && (
                                    <span className="px-3 py-1.5 rounded-full glass-badge text-white text-xs flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5 text-gold-400" />
                                        Max {tour.maxPax} pax
                                    </span>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Main Content - Two Column Layout */}
                <section className="relative -mt-4 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* LEFT COLUMN (2/3) */}
                            <div className="lg:col-span-2">
                                {/* Title & Rating */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-8"
                                >
                                    <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-white mb-2 leading-tight">
                                        {tour.title}
                                    </h1>
                                    <p className="text-gold-500/80 italic mb-4">{tour.subtitle}</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < Math.floor(tour.rating) ? 'text-gold-500 fill-gold-500' : 'text-gold-500/30'}`}
                                                />
                                            ))}
                                            <span className="text-white/60 text-sm ml-1">({tour.reviews} reviews)</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Tabs */}
                                <div className="mb-8">
                                    <div className="flex gap-1 p-1 rounded-xl glass-card overflow-x-auto no-scrollbar">
                                        {TABS.map((tab) => (
                                            <motion.button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`
                                                    flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                                                    ${activeTab === tab.id
                                                        ? 'bg-gold-500 text-obsidian-950'
                                                        : 'text-white/60 hover:text-white hover:bg-white/5'
                                                    }
                                                `}
                                                whileTap={{ scale: 0.97 }}
                                            >
                                                <tab.icon className="w-4 h-4" />
                                                {tab.label}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Tab Content */}
                                <AnimatePresence mode="wait">
                                    {/* OVERVIEW TAB */}
                                    {activeTab === 'overview' && (
                                        <motion.div
                                            key="overview"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="space-y-8"
                                        >
                                            {/* Description */}
                                            <div className="glass-card rounded-2xl p-6">
                                                <h2 className="font-display text-xl text-white mb-4">Tour Description</h2>
                                                <p className="text-white/70 leading-relaxed">{tour.description}</p>
                                            </div>

                                            {/* Highlights */}
                                            <div className="glass-card rounded-2xl p-6">
                                                <h2 className="font-display text-xl text-white mb-4">Tour Highlights</h2>
                                                <div className="flex flex-wrap gap-2">
                                                    {tour.highlights?.map((highlight, i) => (
                                                        <motion.span
                                                            key={i}
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: i * 0.05 }}
                                                            className="px-4 py-2 rounded-lg bg-gold-500/10 text-gold-400 text-sm border border-gold-500/20"
                                                        >
                                                            ✦ {highlight}
                                                        </motion.span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Itinerary */}
                                            {tour.itinerary && (
                                                <div className="glass-card rounded-2xl p-6">
                                                    <h2 className="font-display text-xl text-white mb-6">Itinerary</h2>
                                                    <div className="space-y-0">
                                                        {tour.itinerary.map((item, i) => (
                                                            <motion.div
                                                                key={i}
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: i * 0.1 }}
                                                                className="relative pl-8 pb-6 last:pb-0"
                                                            >
                                                                {/* Timeline line */}
                                                                {i < tour.itinerary.length - 1 && (
                                                                    <div className="absolute left-[11px] top-6 bottom-0 w-px bg-gradient-to-b from-gold-500/40 to-gold-500/10" />
                                                                )}
                                                                {/* Timeline dot */}
                                                                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-gold-500/20 border-2 border-gold-500 flex items-center justify-center">
                                                                    <div className="w-2 h-2 rounded-full bg-gold-500" />
                                                                </div>
                                                                <div>
                                                                    <span className="text-gold-500 text-xs uppercase tracking-wider font-bold">{item.time}</span>
                                                                    <h3 className="text-white font-display text-base mt-1">{item.title}</h3>
                                                                    <p className="text-white/50 text-sm mt-1">{item.description}</p>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* COST INFO TAB */}
                                    {activeTab === 'cost' && (
                                        <motion.div
                                            key="cost"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="space-y-6"
                                        >
                                            {/* Included */}
                                            <div className="glass-card rounded-2xl p-6">
                                                <h2 className="font-display text-xl text-white mb-4 flex items-center gap-2">
                                                    <Check className="w-5 h-5 text-scarab-400" />
                                                    What&apos;s Included
                                                </h2>
                                                <ul className="space-y-3">
                                                    {tour.included?.map((item, i) => (
                                                        <motion.li
                                                            key={i}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.05 }}
                                                            className="flex items-start gap-3"
                                                        >
                                                            <Check className="w-4 h-4 text-scarab-400 flex-shrink-0 mt-0.5" />
                                                            <span className="text-white/70 text-sm">{item}</span>
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Excluded */}
                                            <div className="glass-card rounded-2xl p-6">
                                                <h2 className="font-display text-xl text-white mb-4 flex items-center gap-2">
                                                    <X className="w-5 h-5 text-red-400" />
                                                    What&apos;s Not Included
                                                </h2>
                                                <ul className="space-y-3">
                                                    {tour.excluded?.map((item, i) => (
                                                        <motion.li
                                                            key={i}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.05 }}
                                                            className="flex items-start gap-3"
                                                        >
                                                            <X className="w-4 h-4 text-red-400/60 flex-shrink-0 mt-0.5" />
                                                            <span className="text-white/50 text-sm">{item}</span>
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Price info */}
                                            <div className="glass-gold rounded-2xl p-6">
                                                <h2 className="font-display text-xl text-white mb-4">Pricing</h2>
                                                <div className="space-y-3">
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-3xl font-display text-gold-400">${tour.price}</span>
                                                        <span className="text-white/40">per person</span>
                                                        {tour.originalPrice && (
                                                            <span className="text-white/30 line-through text-lg">${tour.originalPrice}</span>
                                                        )}
                                                    </div>
                                                    <p className="text-white/50 text-sm">
                                                        Children 0-2: Free · Children under 11: 50% discount · Solo supplement may apply for packages.
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* FAQ TAB */}
                                    {activeTab === 'faq' && (
                                        <motion.div
                                            key="faq"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="space-y-3"
                                        >
                                            <h2 className="font-display text-xl text-white mb-4">Frequently Asked Questions</h2>
                                            {tourFaqs.map((faq, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="glass-card rounded-xl overflow-hidden"
                                                >
                                                    <button
                                                        onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                                                        className="w-full flex items-center justify-between p-4 text-left"
                                                    >
                                                        <span className="text-white text-sm font-medium pr-4">{faq.question}</span>
                                                        <motion.div
                                                            animate={{ rotate: expandedFaq === i ? 180 : 0 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <ChevronDown className="w-4 h-4 text-gold-500 flex-shrink-0" />
                                                        </motion.div>
                                                    </button>
                                                    <AnimatePresence>
                                                        {expandedFaq === i && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="px-4 pb-4 border-t border-gold-500/10 pt-3">
                                                                    <p className="text-white/60 text-sm leading-relaxed">{faq.answer}</p>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}

                                    {/* GALLERY TAB */}
                                    {activeTab === 'gallery' && (
                                        <motion.div
                                            key="gallery"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                        >
                                            <h2 className="font-display text-xl text-white mb-4">Gallery</h2>
                                            {(() => {
                                                const galleryImages = tour.gallery?.length ? tour.gallery : [tour.image].filter(Boolean);
                                                return galleryImages.length > 0 ? (
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                        {galleryImages.map((img, i) => (
                                                            <motion.div
                                                                key={i}
                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: i * 0.1 }}
                                                                className={`relative rounded-xl overflow-hidden group cursor-pointer ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                                                            >
                                                                <img
                                                                    src={img}
                                                                    alt={`Gallery ${i + 1}`}
                                                                    className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${i === 0 ? 'h-64 md:h-80' : 'h-40 md:h-48'}`}
                                                                />
                                                                <div className="absolute inset-0 bg-obsidian-950/0 group-hover:bg-obsidian-950/40 transition-colors flex items-center justify-center">
                                                                    <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12 glass-card rounded-2xl">
                                                        <Camera className="w-10 h-10 text-white/20 mx-auto mb-3" />
                                                        <p className="text-white/40 text-sm">No gallery images available for this tour.</p>
                                                    </div>
                                                );
                                            })()}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* RIGHT COLUMN - Sticky Booking Card (1/3) */}
                            <div className="lg:col-span-1">
                                <div className="lg:sticky lg:top-28">
                                    <motion.div
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="glass-card rounded-2xl overflow-hidden"
                                    >
                                        {/* Price Header */}
                                        <div className="p-5 border-b border-gold-500/10">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-sm text-white/50">from</span>
                                                {tour.originalPrice && (
                                                    <span className="text-white/30 line-through text-lg">${tour.originalPrice}</span>
                                                )}
                                                <span className="text-3xl font-display text-gold-400">${tour.price}</span>
                                                <span className="text-white/40 text-sm">/person</span>
                                            </div>
                                        </div>

                                        {/* Booking / Enquiry Tabs */}
                                        <div className="flex border-b border-gold-500/10">
                                            {BOOKING_TABS.map((tab) => (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveBookingTab(tab.id)}
                                                    className={`
                                                        flex-1 py-3 text-sm font-medium transition-all text-center
                                                        ${activeBookingTab === tab.id
                                                            ? 'text-gold-400 border-b-2 border-gold-500 bg-gold-500/5'
                                                            : 'text-white/40 hover:text-white/60'
                                                        }
                                                    `}
                                                >
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Booking / Enquiry Content */}
                                        <div className="p-5">
                                            <AnimatePresence mode="wait">
                                                {activeBookingTab === 'booking' ? (
                                                    <motion.div
                                                        key="booking"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                    >
                                                        <TourBookingCalendar
                                                            tour={tour}
                                                            availability={tour.availability}
                                                        />
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="enquiry"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                    >
                                                        <TourEnquiryForm tour={tour} />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>

                                    {/* Trust Badges */}
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        {[
                                            { icon: Shield, label: 'Secure Booking' },
                                            { icon: Phone, label: '24/7 Support' },
                                        ].map((badge) => (
                                            <div key={badge.label} className="flex items-center gap-2 glass-card rounded-xl p-3">
                                                <badge.icon className="w-4 h-4 text-gold-500" />
                                                <span className="text-white/60 text-xs">{badge.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* AI Recommendations */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <TourRecommendations
                        destination={tour.destination}
                        budget={tour.price}
                        tourType={tour.tourType}
                        excludeTourId={tour.id}
                        title="You May Also Like"
                        limit={4}
                    />
                </section>
            </main>

            <Footer />
        </>
    );
}
