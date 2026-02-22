import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getAllBookings, updateBooking } from '@/lib/db';

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

    const { searchParams } = new URL(request.url);
    const filters = {
        status: searchParams.get('status') || undefined,
        tourId: searchParams.get('tourId') || undefined,
        dateFrom: searchParams.get('dateFrom') || undefined,
        dateTo: searchParams.get('dateTo') || undefined,
        paymentStatus: searchParams.get('paymentStatus') || undefined,
    };

    const bookings = getAllBookings(filters);

    return NextResponse.json({
        bookings,
        total: bookings.length,
        filters,
    });
}

export async function PATCH(request) {
    const admin = getAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    try {
        const { bookingId, bookingStatus } = await request.json();

        if (!bookingId || !bookingStatus) {
            return NextResponse.json(
                { error: 'bookingId and bookingStatus are required' },
                { status: 400 }
            );
        }

        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        if (!validStatuses.includes(bookingStatus)) {
            return NextResponse.json(
                { error: `Status must be one of: ${validStatuses.join(', ')}` },
                { status: 400 }
            );
        }

        const booking = updateBooking(bookingId, { bookingStatus });
        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, booking });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }
}
