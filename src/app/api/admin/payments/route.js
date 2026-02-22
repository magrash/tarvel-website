import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getAllPayments } from '@/lib/db';

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
        provider: searchParams.get('provider') || undefined,
        bookingId: searchParams.get('bookingId') || undefined,
    };

    const payments = getAllPayments(filters);

    return NextResponse.json({
        payments,
        total: payments.length,
        filters,
    });
}
