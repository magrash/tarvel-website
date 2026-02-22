// Admin Single Destination API — PUT update, DELETE remove
import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { getDestinationById, updateDestination, deleteDestination } from '@/lib/db';

export const PUT = withAuth(async (request, { params }) => {
    try {
        const { id } = await params;
        const updates = await request.json();
        const destination = updateDestination(id, updates);
        if (!destination) {
            return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
        }
        return NextResponse.json({ destination });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
});

export const DELETE = withAuth(async (request, { params }) => {
    const { id } = await params;
    const success = deleteDestination(id);
    if (!success) {
        return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
});
