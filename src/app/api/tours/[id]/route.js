import { getManagedTourById, getAvailabilityWithOverrides } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const { id } = await params;

    // Find tour by ID from the managed (admin-editable) store
    const tour = getManagedTourById(id);

    if (!tour || !tour.enabled) {
        return NextResponse.json(
            { error: 'Tour not found' },
            { status: 404 }
        );
    }

    // Attach availability overrides
    const availability = getAvailabilityWithOverrides(tour.id);

    return NextResponse.json({
        ...tour,
        availability,
    });
}
