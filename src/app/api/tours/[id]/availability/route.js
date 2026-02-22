import { getAvailabilityWithOverrides, getManagedTourById } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const { id } = await params;

    const tour = getManagedTourById(id);

    if (!tour || !tour.enabled) {
        return NextResponse.json(
            { error: 'Tour not found' },
            { status: 404 }
        );
    }

    const availability = getAvailabilityWithOverrides(tour.id);

    return NextResponse.json(availability);
}
