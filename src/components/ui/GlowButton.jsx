'use client';

import Link from 'next/link';

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
        hover:scale-[1.02] hover:-translate-y-0.5
        active:scale-[0.98]
    `;

    const variants = {
        primary: `
            bg-gradient-to-br from-white/10 via-gold-500/8 to-white/5
            text-gold-400
            border border-white/15 border-t-white/30 border-l-white/20
            shadow-[0_4px_24px_rgba(0,0,0,0.25),0_0_20px_rgba(245,158,11,0.08),inset_0_1px_2px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(245,158,11,0.05)]
            backdrop-blur-2xl
            hover:from-white/15 hover:via-gold-500/15 hover:to-white/8
            hover:text-gold-300
            hover:border-t-white/45 hover:border-l-white/30
            hover:shadow-[0_8px_40px_rgba(245,158,11,0.2),0_0_60px_rgba(245,158,11,0.1),inset_0_1px_3px_rgba(255,255,255,0.25),inset_0_-1px_2px_rgba(245,158,11,0.1)]
        `,
        secondary: `
            bg-gradient-to-br from-gold-500/8 to-gold-600/3
            border border-gold-500/30 border-t-gold-500/50
            text-gold-500
            backdrop-blur-xl
            shadow-[0_4px_16px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(245,158,11,0.1)]
            hover:from-gold-500/85 hover:to-gold-600/80
            hover:text-obsidian-950
            hover:border-t-white/40
            hover:shadow-[0_8px_32px_rgba(245,158,11,0.35),inset_0_1px_2px_rgba(255,255,255,0.3)]
        `,
        teal: `
            bg-gradient-to-br from-scarab-500/90 via-scarab-500/85 to-scarab-600/90
            text-white
            border border-white/20 border-t-white/40
            shadow-[0_4px_16px_rgba(20,184,166,0.3),inset_0_1px_2px_rgba(255,255,255,0.25)]
            backdrop-blur-xl
            hover:shadow-[0_8px_32px_rgba(20,184,166,0.45),0_0_40px_rgba(20,184,166,0.15),inset_0_1px_3px_rgba(255,255,255,0.35)]
            hover:border-t-white/55
        `,
        ghost: `
            bg-gradient-to-br from-white/6 to-white/2
            border border-white/10 border-t-white/18
            text-gold-500
            backdrop-blur-xl
            shadow-[0_2px_12px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.08)]
            hover:from-white/10 hover:to-white/5
            hover:border-gold-500/30 hover:border-t-gold-500/50
        `,
    };

    const sizes = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-5 py-2.5 text-xs sm:px-6 sm:py-3 sm:text-sm',
        lg: 'px-6 py-3 text-sm sm:px-8 sm:py-4 sm:text-base',
        xl: 'px-8 py-4 text-base sm:px-12 sm:py-5 sm:text-lg',
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    const ButtonContent = () => (
        <>
            {/* Shimmer effect - CSS only, hover triggered */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
            </div>

            {/* Content */}
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </>
    );

    if (href) {
        return (
            <Link
                href={href}
                className={`group inline-block rounded-lg ${classes}`}
                {...props}
            >
                <ButtonContent />
            </Link>
        );
    }

    return (
        <button
            className={`group rounded-lg ${classes}`}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            <ButtonContent />
        </button>
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
        <button
            className={`
                relative p-3 rounded-full
                bg-gradient-to-br from-white/8 to-white/3
                backdrop-blur-xl
                border border-white/12 border-t-white/22
                text-gold-500
                shadow-[0_2px_12px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)]
                hover:border-gold-500/40 hover:from-white/12 hover:to-white/6
                hover:shadow-[0_4px_20px_rgba(0,0,0,0.25),inset_0_1px_2px_rgba(255,255,255,0.15)]
                hover:scale-110 active:scale-95
                transition-all duration-400
                ${className}
            `}
            onClick={onClick}
            {...props}
        >
            {icon}
            {tooltip && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {tooltip}
                </span>
            )}
        </button>
    );
}
