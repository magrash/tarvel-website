'use client';

import { motion } from 'framer-motion';

export default function Pyramid3D({ size = 200 }) {
    const halfSize = size / 2;
    const height = size * 0.7;

    return (
        <div
            className="relative"
            style={{
                width: size,
                height: height,
                perspective: '800px',
            }}
        >
            {/* Pyramid using CSS triangles with 3D rotation */}
            <motion.div
                className="relative w-full h-full"
                style={{
                    transformStyle: 'preserve-3d',
                }}
                animate={{ rotateY: 360 }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            >
                {/* Front face */}
                <div
                    className="absolute bottom-0 left-1/2"
                    style={{
                        width: 0,
                        height: 0,
                        borderLeft: `${halfSize}px solid transparent`,
                        borderRight: `${halfSize}px solid transparent`,
                        borderBottom: `${height}px solid rgba(245, 158, 11, 0.15)`,
                        transform: `translateX(-50%) rotateY(0deg) translateZ(${halfSize * 0.3}px)`,
                        filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.2))',
                    }}
                />

                {/* Right face */}
                <div
                    className="absolute bottom-0 left-1/2"
                    style={{
                        width: 0,
                        height: 0,
                        borderLeft: `${halfSize}px solid transparent`,
                        borderRight: `${halfSize}px solid transparent`,
                        borderBottom: `${height}px solid rgba(245, 158, 11, 0.1)`,
                        transform: `translateX(-50%) rotateY(90deg) translateZ(${halfSize * 0.3}px)`,
                    }}
                />

                {/* Back face */}
                <div
                    className="absolute bottom-0 left-1/2"
                    style={{
                        width: 0,
                        height: 0,
                        borderLeft: `${halfSize}px solid transparent`,
                        borderRight: `${halfSize}px solid transparent`,
                        borderBottom: `${height}px solid rgba(245, 158, 11, 0.08)`,
                        transform: `translateX(-50%) rotateY(180deg) translateZ(${halfSize * 0.3}px)`,
                    }}
                />

                {/* Left face */}
                <div
                    className="absolute bottom-0 left-1/2"
                    style={{
                        width: 0,
                        height: 0,
                        borderLeft: `${halfSize}px solid transparent`,
                        borderRight: `${halfSize}px solid transparent`,
                        borderBottom: `${height}px solid rgba(245, 158, 11, 0.12)`,
                        transform: `translateX(-50%) rotateY(270deg) translateZ(${halfSize * 0.3}px)`,
                    }}
                />
            </motion.div>

            {/* Glow effect at the base */}
            <motion.div
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-gold-500/20 blur-2xl"
                style={{
                    width: size * 0.8,
                    height: size * 0.2,
                }}
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
        </div>
    );
}
