import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getManagedTours, createTour } from '@/lib/db';
import { validateTourInput, sanitizeObject } from '@/lib/validation';

function generateSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}


function getAdmin(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    return verifyToken(authHeader.split(' ')[1]);
}

export async function GET(request) {
    const admin = getAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const tours = getManagedTours();
    return NextResponse.json({ tours, total: tours.length });
}

export async function POST(request) {
    const admin = getAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const sanitized = sanitizeObject(body);

        const errors = validateTourInput(sanitized);
        if (errors) {
            return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
        }

        const tour = createTour({
            ...sanitized,
            slug: generateSlug(sanitized.title),
            minPax: sanitized.minPax || 1,
            maxPax: sanitized.maxPax || 12,
            days: sanitized.days || 1,
            nights: sanitized.nights || 0,
            currency: 'USD',
        });

        return NextResponse.json({ success: true, tour }, { status: 201 });

    } catch (error) {
        console.error('Create tour error:', error);
        return NextResponse.json({ error: 'Failed to create tour' }, { status: 500 });
    }
}
