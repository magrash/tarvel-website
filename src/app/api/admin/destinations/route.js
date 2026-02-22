// Admin Destinations API — GET all, POST new
import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { getAllDestinations, createDestination } from '@/lib/db';

export const GET = withAuth(async () => {
    const destinations = getAllDestinations();
    return NextResponse.json({ destinations });
});

export const POST = withAuth(async (request) => {
    try {
        const data = await request.json();
        if (!data.name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }
        const destination = createDestination(data);
        return NextResponse.json({ destination }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
});
