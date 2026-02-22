import { getManagedTours, getAllDestinations } from '@/lib/db';

export default function sitemap() {
    const baseUrl = 'https://gobatravel.com';

    // Static pages
    const staticPages = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
        { url: `${baseUrl}/tours`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/destinations`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/booking`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ];

    // Dynamic tour pages
    const tours = getManagedTours().filter(t => t.enabled);
    const tourPages = tours.map(tour => ({
        url: `${baseUrl}/tours/${tour.slug || tour.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    return [...staticPages, ...tourPages];
}
