'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { languages } from '@/lib/data';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState(languages[0]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Destinations', href: '/destinations' },
        { name: 'Tours', href: '/tours' },
        { name: 'Experiences', href: '/#experiences' },
        { name: 'Book Now', href: '/booking', highlight: true },
    ];

    return (
        <>
            <motion.header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? 'bg-obsidian-950/90 backdrop-blur-xl border-b border-gold-500/20'
                    : 'bg-transparent'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">

                        {/* Logo */}
                        <Link href="/" className="relative group">
                            <div className="flex items-center gap-3 hover:scale-[1.02] transition-transform">
                                <div className="relative">
                                    <span className="text-3xl">𓂀</span>
                                    {/* Static glow - no animation */}
                                    <div className="absolute inset-0 bg-gold-500/20 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div>
                                    <h1 className="font-display text-xl font-bold text-gold-500 tracking-wider">
                                        GOBA
                                    </h1>
                                    <p className="text-[10px] text-gold-500/60 tracking-[0.2em] uppercase">
                                        Time Travel
                                    </p>
                                </div>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                    relative font-display text-sm tracking-wider uppercase
                    transition-colors duration-300
                    ${item.highlight
                                            ? 'px-6 py-2 bg-gold-500 text-obsidian-950 rounded hover:bg-gold-400'
                                            : 'text-white/80 hover:text-gold-500'
                                        }
                  `}
                                >
                                    {!item.highlight && (
                                        <motion.span
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold-500 origin-left"
                                            initial={{ scaleX: 0 }}
                                            whileHover={{ scaleX: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Right section */}
                        <div className="flex items-center gap-4">

                            {/* Language Selector */}
                            <div className="relative hidden md:block">
                                <motion.button
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gold-500/30 hover:border-gold-500 transition-colors"
                                    onClick={() => setIsLangOpen(!isLangOpen)}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <Globe className="w-4 h-4 text-gold-500" />
                                    <span className="text-sm text-white/80">{currentLang.flag}</span>
                                    <ChevronDown className={`w-4 h-4 text-gold-500/60 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                                </motion.button>

                                <AnimatePresence>
                                    {isLangOpen && (
                                        <motion.div
                                            className="absolute top-full right-0 mt-2 py-2 w-40 bg-obsidian-900/95 backdrop-blur-xl rounded-lg border border-gold-500/20 shadow-xl"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                        >
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-gold-500/10 transition-colors ${currentLang.code === lang.code ? 'text-gold-500' : 'text-white/80'
                                                        }`}
                                                    onClick={() => {
                                                        setCurrentLang(lang);
                                                        setIsLangOpen(false);
                                                    }}
                                                >
                                                    <span>{lang.flag}</span>
                                                    <span>{lang.name}</span>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Mobile Menu Button */}
                            <motion.button
                                className="lg:hidden p-2 text-gold-500"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-obsidian-950/95 backdrop-blur-xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Menu Content */}
                        <motion.nav
                            className="absolute inset-x-0 top-20 p-6 flex flex-col gap-6"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: 0.1 }}
                        >
                            {navItems.map((item, i) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + i * 0.05 }}
                                >
                                    <Link
                                        href={item.href}
                                        className={`
                      block font-display text-2xl tracking-wider
                      ${item.highlight
                                                ? 'text-gold-500'
                                                : 'text-white/80 hover:text-gold-500'
                                            }
                    `}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}

                            {/* Mobile Language Selector */}
                            <motion.div
                                className="pt-6 border-t border-gold-500/20"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <p className="text-sm text-gold-500/60 mb-4">Select Language</p>
                                <div className="flex flex-wrap gap-3">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            className={`px-4 py-2 rounded-lg border transition-colors ${currentLang.code === lang.code
                                                ? 'border-gold-500 bg-gold-500/10 text-gold-500'
                                                : 'border-gold-500/30 text-white/60 hover:border-gold-500'
                                                }`}
                                            onClick={() => setCurrentLang(lang)}
                                        >
                                            {lang.flag} {lang.name}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Decorative hieroglyphs */}
                            <motion.div
                                className="absolute bottom-10 left-6 right-6 text-center text-gold-500/20 text-2xl tracking-[0.5em]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                𓀀 𓂀 𓃭 𓅃 𓆣
                            </motion.div>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
