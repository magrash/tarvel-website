import './globals.css'
import Providers from './Providers'

export const metadata = {
    metadataBase: new URL('https://gobatravel.com'),
    title: {
        default: 'Goba Travel | Premium Egypt Tours & Experiences',
        template: '%s | Goba Travel',
    },
    description: 'Discover Egypt with Goba Travel — premium guided tours to the Pyramids of Giza, Luxor temples, Nile cruises, and more. Expert Egyptologist guides, 5-star service, and unforgettable adventures across 5,000 years of history.',
    keywords: [
        'Egypt tours', 'Egypt travel agency', 'Pyramids of Giza tours',
        'Luxor tours', 'Nile cruise Egypt', 'Cairo day trips',
        'Egypt vacation packages', 'private Egypt tours',
        'Egyptologist guide', 'Red Sea diving Egypt',
        'Valley of the Kings', 'Alexandria tours',
        'Siwa Oasis', 'Fayoum Egypt', 'best Egypt tours',
        'luxury Egypt travel', 'budget Egypt tours',
        'adventure tours Egypt', 'family tours Egypt',
    ],
    authors: [{ name: 'Goba Travel', url: 'https://gobatravel.com' }],
    creator: 'Goba Travel',
    publisher: 'Goba Travel',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        title: 'Goba Travel | Premium Egypt Tours & Experiences',
        description: 'Discover Egypt with Goba Travel — premium guided tours, Nile cruises, and unforgettable adventures.',
        url: 'https://gobatravel.com',
        siteName: 'Goba Travel',
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Goba Travel — Explore Egypt',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Goba Travel | Premium Egypt Tours',
        description: 'Discover Egypt with premium guided tours, Nile cruises, and 5-star experiences.',
        images: ['/og-image.jpg'],
    },
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
    category: 'travel',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="theme-color" content="#0d0d0d" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className="antialiased">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}
