import { getBookingById } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const { id } = await params;

    const booking = getBookingById(id);

    if (!booking) {
        return NextResponse.json(
            { error: 'Booking not found' },
            { status: 404 }
        );
    }

    return NextResponse.json({ booking });
}
