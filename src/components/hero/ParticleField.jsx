'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

export default function ParticleField({
    particleCount = 30, // Reduced from 50
    colors = ['#f59e0b', '#fbbf24', '#14b8a6'],
    className = ''
}) {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const particlesRef = useRef([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const lastFrameTime = useRef(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Detect mobile for performance optimization
        setIsMobile(window.innerWidth < 768);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        let width = window.innerWidth;
        let height = window.innerHeight;

        // Reduce particle count on mobile
        const actualParticleCount = isMobile ? Math.floor(particleCount / 2) : particleCount;
        const TARGET_FPS = 30; // Cap at 30 FPS for performance
        const FRAME_INTERVAL = 1000 / TARGET_FPS;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        resize();

        // Throttled resize handler
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resize, 100);
        };
        window.addEventListener('resize', handleResize);

        // Throttled mouse tracking
        let mouseThrottled = false;
        const handleMouseMove = (e) => {
            if (mouseThrottled) return;
            mouseThrottled = true;
            mouseRef.current = { x: e.clientX, y: e.clientY };
            setTimeout(() => { mouseThrottled = false; }, 50);
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Simplified Particle class
        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.alpha = Math.random() * 0.4 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Wrap around edges
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw(ctx) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.alpha;
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        // Create particles
        particlesRef.current = Array.from({ length: actualParticleCount }, () => new Particle());

        // Optimized connections - only on desktop and limited checks
        const drawConnections = () => {
            if (isMobile) return; // Skip on mobile

            const particles = particlesRef.current;
            const len = particles.length;

            ctx.strokeStyle = 'rgba(245, 158, 11, 0.08)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();

            // Only check every other particle for connections
            for (let i = 0; i < len; i += 2) {
                const p1 = particles[i];
                for (let j = i + 2; j < len; j += 2) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;

                    // Quick distance check (avoid sqrt when possible)
                    if (Math.abs(dx) < 100 && Math.abs(dy) < 100) {
                        const distSq = dx * dx + dy * dy;
                        if (distSq < 10000) { // 100^2
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                        }
                    }
                }
            }
            ctx.stroke();
        };

        // FPS-limited animation loop
        const animate = (timestamp) => {
            const elapsed = timestamp - lastFrameTime.current;

            if (elapsed >= FRAME_INTERVAL) {
                lastFrameTime.current = timestamp - (elapsed % FRAME_INTERVAL);

                ctx.clearRect(0, 0, width, height);

                particlesRef.current.forEach(particle => {
                    particle.update();
                    particle.draw(ctx);
                });

                drawConnections();
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            clearTimeout(resizeTimeout);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [particleCount, colors, isMobile]);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 pointer-events-none z-0 ${className}`}
        />
    );
}

// Floating dust particles (CSS-based, lighter weight)
export function DustParticles({ count = 30 }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Pre-generate stable random values
    const particles = useMemo(() => {
        if (typeof window === 'undefined') return [];
        return Array.from({ length: count }, () => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            xMid: Math.random() * 50 - 25,
            xEnd: Math.random() * 100 - 50,
            duration: 10 + Math.random() * 10,
            delay: Math.random() * 10,
        }));
    }, [count]);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {particles.map((p, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-gold-500 rounded-full"
                    style={{
                        left: p.left,
                        top: p.top,
                    }}
                    animate={{
                        y: [0, -100, -200],
                        x: [0, p.xMid, p.xEnd],
                        opacity: [0, 0.6, 0],
                        scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: 'linear',
                    }}
                />
            ))}
        </div>
    );
}

// Light rays effect
export function LightRays() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    style={{
                        left: `${20 + i * 15}%`,
                        top: '-10%',
                        width: '2px',
                        height: '120%',
                        background: 'linear-gradient(180deg, rgba(245,158,11,0.3), transparent)',
                        transform: `rotate(${-15 + i * 8}deg)`,
                        transformOrigin: 'top',
                    }}
                    animate={{
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                        duration: 4 + i,
                        repeat: Infinity,
                        delay: i * 0.5,
                    }}
                />
            ))}
        </div>
    );
}
