// Admin Content API — GET/PUT hero, stats, gallery, experiences, FAQs
import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import {
    getHero, updateHero,
    getStats, updateStats,
    getAllGallery, addGalleryImage, removeGalleryImage, reorderGallery,
    getAllExperiences, updateExperience,
    getAllFaqs, createFaq, updateFaq, deleteFaq,
} from '@/lib/db';

export const GET = withAuth(async () => {
    return NextResponse.json({
        hero: getHero(),
        stats: getStats(),
        gallery: getAllGallery(),
        experiences: getAllExperiences(),
        faqs: getAllFaqs(),
    });
});

export const PUT = withAuth(async (request) => {
    try {
        const data = await request.json();
        const { section, action, ...payload } = data;

        switch (section) {
            case 'hero':
                return NextResponse.json({ hero: updateHero(payload) });

            case 'stats':
                return NextResponse.json({ stats: updateStats(payload) });

            case 'gallery':
                if (action === 'add') {
                    const img = addGalleryImage(payload.url);
                    return NextResponse.json({ image: img, gallery: getAllGallery() });
                }
                if (action === 'remove') {
                    removeGalleryImage(payload.id);
                    return NextResponse.json({ gallery: getAllGallery() });
                }
                if (action === 'reorder') {
                    const gallery = reorderGallery(payload.orderedIds);
                    return NextResponse.json({ gallery });
                }
                return NextResponse.json({ gallery: getAllGallery() });

            case 'experiences':
                if (payload.id) {
                    const exp = updateExperience(payload.id, payload);
                    return NextResponse.json({ experience: exp, experiences: getAllExperiences() });
                }
                return NextResponse.json({ experiences: getAllExperiences() });

            case 'faqs':
                if (action === 'create') {
                    const faq = createFaq(payload);
                    return NextResponse.json({ faq, faqs: getAllFaqs() });
                }
                if (action === 'update' && payload.id) {
                    const faq = updateFaq(payload.id, payload);
                    return NextResponse.json({ faq, faqs: getAllFaqs() });
                }
                if (action === 'delete' && payload.id) {
                    deleteFaq(payload.id);
                    return NextResponse.json({ faqs: getAllFaqs() });
                }
                return NextResponse.json({ faqs: getAllFaqs() });

            default:
                return NextResponse.json({ error: 'Unknown section' }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
});
