'use client';

import { motion } from 'framer-motion';

export default function GlowButton({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    href,
    disabled = false,
    ...props
}) {
    const baseClasses = `
    relative overflow-hidden font-display font-semibold tracking-wider uppercase
    transition-all duration-300 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

    const variants = {
        primary: `
      bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600
      text-obsidian-950 
      hover:shadow-[0_0_40px_rgba(245,158,11,0.5)]
      border-0
    `,
        secondary: `
      bg-transparent border-2 border-gold-500
      text-gold-500
      hover:bg-gold-500 hover:text-obsidian-950
      hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]
    `,
        teal: `
      bg-gradient-to-r from-scarab-600 via-scarab-500 to-scarab-600
      text-white
      hover:shadow-[0_0_40px_rgba(20,184,166,0.5)]
      border-0
    `,
        ghost: `
      bg-transparent border border-gold-500/30
      text-gold-500
      hover:border-gold-500 hover:bg-gold-500/10
    `,
    };

    const sizes = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
        xl: 'px-12 py-5 text-lg',
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    const ButtonContent = () => (
        <>
            {/* Shimmer effect */}
            <motion.div
                className="absolute inset-0 -translate-x-full"
                animate={{
                    translateX: ['-100%', '100%'],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: 'linear',
                }}
            >
                <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
            </motion.div>

            {/* Content */}
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>

            {/* Energy lines on sides */}
            <motion.div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-0 bg-gradient-to-b from-transparent via-gold-300 to-transparent"
                whileHover={{ height: '80%' }}
                transition={{ duration: 0.3 }}
            />
            <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-0 bg-gradient-to-b from-transparent via-gold-300 to-transparent"
                whileHover={{ height: '80%' }}
                transition={{ duration: 0.3 }}
            />
        </>
    );

    if (href) {
        return (
            <motion.a
                href={href}
                className={`inline-block rounded-lg ${classes}`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                {...props}
            >
                <ButtonContent />
            </motion.a>
        );
    }

    return (
        <motion.button
            className={`rounded-lg ${classes}`}
            onClick={onClick}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            {...props}
        >
            <ButtonContent />
        </motion.button>
    );
}

// Icon Button variant
export function IconButton({
    icon,
    className = '',
    onClick,
    tooltip,
    ...props
}) {
    return (
        <motion.button
            className={`
        relative p-3 rounded-full
        bg-obsidian-800/50 border border-gold-500/30
        text-gold-500
        hover:border-gold-500 hover:bg-gold-500/10
        transition-all duration-300
        ${className}
      `}
            onClick={onClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            {...props}
        >
            {icon}
            {tooltip && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {tooltip}
                </span>
            )}
        </motion.button>
    );
}
