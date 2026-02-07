import './globals.css'

export const metadata = {
    title: 'Goba Travel | Egypt Time-Travel Experience',
    description: 'Journey through 5000 years of Egyptian history. Book your time-travel adventure to the land of pharaohs, pyramids, and ancient mysteries.',
    keywords: 'Egypt tourism, Egypt travel, pyramids, pharaohs, luxury travel, adventure tours, time travel experience',
    openGraph: {
        title: 'Goba Travel | Egypt Time-Travel Experience',
        description: 'Journey through 5000 years of Egyptian history',
        type: 'website',
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className="antialiased">
                {children}
            </body>
        </html>
    )
}
