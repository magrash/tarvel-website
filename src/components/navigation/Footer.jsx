'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    MessageCircle,
    Mail,
    Phone,
    MapPin,
    ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        explore: [
            { name: t('nav.destinations'), href: '/destinations' },
            { name: t('nav.tours'), href: '/tours' },
            { name: t('nav.experiences'), href: '/#experiences' },
            { name: t('nav.bookNow'), href: '/booking' },
        ],
        destinations: [
            { name: 'Giza', href: '/destinations?region=Giza' },
            { name: 'Cairo', href: '/destinations?region=Cairo' },
            { name: 'Luxor', href: '/destinations?region=Luxor' },
            { name: 'Aswan', href: '/destinations?region=Aswan' },
            { name: 'Alexandria', href: '/destinations?region=Alexandria' },
            { name: 'Siwa', href: '/destinations?region=Siwa' },
        ],
        tours: [
            { name: 'Full-Day Tours', href: '/tours?type=full-day' },
            { name: 'Half-Day Tours', href: '/tours?type=half-day' },
            { name: 'Packages', href: '/tours?type=package' },
            { name: 'Fayoum', href: '/destinations?region=Fayoum' },
            { name: 'Siwa Oasis', href: '/destinations?region=Siwa' },
        ],
        legal: [
            { name: t('footer.privacy'), href: '/privacy' },
            { name: t('footer.terms'), href: '/terms' },
            { name: t('footer.about'), href: '/about' },
            { name: t('footer.contactUs'), href: '/contact' },
        ],
    };

    const socialLinks = [
        { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
        { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
        { icon: MessageCircle, href: 'https://wa.me/201234567890', label: 'WhatsApp' },
        { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
    ];

    return (
        <footer className="relative glass-dark border-t border-gold-500/20">
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

            {/* Newsletter Section */}
            <div className="border-b border-gold-500/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="text-center lg:text-left">
                            <h3 className="font-display text-xl sm:text-2xl text-gold-500 mb-2">
                                Join the Time Travelers
                            </h3>
                            <p className="text-white/60">
                                Receive exclusive offers and ancient secrets directly to your inbox.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row w-full lg:w-auto max-w-md gap-2 sm:gap-0">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="glass-input flex-1 px-4 sm:px-6 py-3 rounded-lg sm:rounded-l-lg sm:rounded-r-none text-white placeholder:text-white/40 focus:outline-none transition-colors text-sm sm:text-base"
                            />
                            <motion.button
                                className="px-6 py-3 bg-gold-500 text-obsidian-950 font-display font-semibold tracking-wider rounded-lg sm:rounded-l-none sm:rounded-r-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Subscribe
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-8">

                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-block mb-6">
                            <div className="flex items-center gap-3">
                                <span className="text-4xl">𓂀</span>
                                <div>
                                    <h2 className="font-display text-2xl font-bold text-gold-500 tracking-wider">
                                        GOBA
                                    </h2>
                                    <p className="text-xs text-gold-500/60 tracking-[0.2em] uppercase">
                                        Time Travel Experiences
                                    </p>
                                </div>
                            </div>
                        </Link>
                        <p className="text-white/60 mb-6 max-w-xs">
                            Journey through 5000 years of Egyptian history. Where ancient wonders meet futuristic luxury.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3 mb-6">
                            <a href="mailto:hello@gobatravel.com" className="flex items-center gap-3 text-white/60 hover:text-gold-500 transition-colors">
                                <Mail className="w-4 h-4" />
                                <span>hello@gobatravel.com</span>
                            </a>
                            <a href="tel:+201234567890" className="flex items-center gap-3 text-white/60 hover:text-gold-500 transition-colors">
                                <Phone className="w-4 h-4" />
                                <span>+20 123 456 7890</span>
                            </a>
                            <div className="flex items-start gap-3 text-white/60">
                                <MapPin className="w-4 h-4 mt-1" />
                                <span>Cairo, Egypt</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg border border-gold-500/30 text-gold-500 hover:bg-gold-500 hover:text-obsidian-950 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="font-display text-gold-500 tracking-wider uppercase mb-4">
                            {t('footer.quickLinks')}
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.explore.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-white/60 hover:text-gold-500 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-display text-gold-500 tracking-wider uppercase mb-4">
                            {t('nav.destinations')}
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.destinations.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-white/60 hover:text-gold-500 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-display text-gold-500 tracking-wider uppercase mb-4">
                            {t('nav.tours')}
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.tours.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-white/60 hover:text-gold-500 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-display text-gold-500 tracking-wider uppercase mb-4">
                            Legal
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-white/60 hover:text-gold-500 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gold-500/10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-white/40 text-sm text-center md:text-left">
                            © {currentYear} Goba Travel. {t('footer.rights')}
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-white/40 text-xs sm:text-sm">
                            <span>🇪🇬 Egypt Licensed</span>
                            <span>|</span>
                            <span>Secure Payments</span>
                            <span>|</span>
                            <span>24/7 Support</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative hieroglyphs */}
            <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none">
                <div className="text-center text-gold-500/5 text-6xl tracking-[0.5em] whitespace-nowrap">
                    𓀀 𓀁 𓀂 𓀃 𓁀 𓁐 𓂀 𓃭 𓄿 𓅓 𓅃 𓆣 𓇯 𓈖 𓉐 𓊽
                </div>
            </div>
        </footer>
    );
}
