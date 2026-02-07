'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const cursorRef = useRef(null);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 400 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        // Add hover detection for interactive elements
        const addHoverListeners = () => {
            const interactiveElements = document.querySelectorAll('a, button, [data-cursor="hover"]');
            interactiveElements.forEach((el) => {
                el.addEventListener('mouseenter', () => setIsHovering(true));
                el.addEventListener('mouseleave', () => setIsHovering(false));
            });
        };

        window.addEventListener('mousemove', moveCursor);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);

        // Initial setup and mutation observer for dynamic elements
        addHoverListeners();
        const observer = new MutationObserver(addHoverListeners);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
            observer.disconnect();
        };
    }, [cursorX, cursorY, isVisible]);

    // Hide custom cursor on touch devices
    if (typeof window !== 'undefined' && 'ontouchstart' in window) {
        return null;
    }

    return (
        <>
            {/* Main cursor ring */}
            <motion.div
                ref={cursorRef}
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
            >
                <motion.div
                    className="relative -translate-x-1/2 -translate-y-1/2"
                    animate={{
                        scale: isHovering ? 1.5 : 1,
                        opacity: isVisible ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Outer ring */}
                    <motion.div
                        className="w-10 h-10 rounded-full border-2 border-gold-500"
                        animate={{
                            borderColor: isHovering ? '#14b8a6' : '#f59e0b',
                        }}
                    />

                    {/* Inner hieroglyph */}
                    <motion.span
                        className="absolute inset-0 flex items-center justify-center text-xs text-gold-500"
                        animate={{
                            opacity: isHovering ? 1 : 0,
                            scale: isHovering ? 1 : 0.5,
                            color: isHovering ? '#14b8a6' : '#f59e0b',
                        }}
                    >
                        𓂀
                    </motion.span>
                </motion.div>
            </motion.div>

            {/* Center dot */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999]"
                style={{
                    x: cursorX,
                    y: cursorY,
                }}
            >
                <motion.div
                    className="w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500"
                    animate={{
                        scale: isHovering ? 0 : 1,
                        opacity: isVisible ? 1 : 0,
                        backgroundColor: isHovering ? '#14b8a6' : '#f59e0b',
                    }}
                />
            </motion.div>

            {/* Trail particles */}
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    className="fixed top-0 left-0 pointer-events-none z-[9998]"
                    style={{
                        x: cursorXSpring,
                        y: cursorYSpring,
                    }}
                    transition={{
                        delay: (i + 1) * 0.05,
                    }}
                >
                    <motion.div
                        className="w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/30"
                        style={{
                            scale: 1 - i * 0.2,
                        }}
                        animate={{
                            opacity: isVisible ? 0.3 - i * 0.1 : 0,
                        }}
                    />
                </motion.div>
            ))}

            {/* Hide default cursor */}
            <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>
        </>
    );
}
