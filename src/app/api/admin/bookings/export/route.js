import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getAllBookings } from '@/lib/db';

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
    };

    const bookings = getAllBookings(filters);

    // Build CSV
    const headers = ['Booking ID', 'Tour', 'Date', 'Guests', 'Total Price', 'Currency', 'Status', 'Payment', 'Customer Name', 'Customer Email', 'Customer Phone', 'Created At'];
    const rows = bookings.map(b => [
        b.id,
        `"${(b.tourTitle || '').replace(/"/g, '""')}"`,
        b.selectedDate,
        b.guestsCount,
        b.totalPrice,
        b.currency || 'USD',
        b.bookingStatus,
        b.paymentStatus,
        `"${(b.customerInfo?.name || '').replace(/"/g, '""')}"`,
        b.customerInfo?.email || '',
        b.customerInfo?.phone || '',
        b.createdAt,
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    return new Response(csv, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="goba-bookings-${new Date().toISOString().split('T')[0]}.csv"`,
        },
    });
}
