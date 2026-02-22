import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getManagedTourById, updateTour, deleteTour } from '@/lib/db';
import { sanitizeObject } from '@/lib/validation';

function getAdmin(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    return verifyToken(authHeader.split(' ')[1]);
}

export async function GET(request, { params }) {
    const admin = getAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const tour = getManagedTourById(params.id);
    if (!tour) {
        return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    return NextResponse.json({ tour });
}

export async function PUT(request, { params }) {
    const admin = getAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const sanitized = sanitizeObject(body);

        const tour = updateTour(params.id, sanitized);
        if (!tour) {
            return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, tour });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to update tour' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const admin = getAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const success = deleteTour(params.id);
    if (!success) {
        return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Tour disabled' });
}
