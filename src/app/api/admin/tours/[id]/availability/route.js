import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getAvailabilityWithOverrides, setAvailabilityOverride } from '@/lib/db';

function getAdmin(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    return verifyToken(authHeader.split(' ')[1]);
}

// GET current availability for a tour
export async function GET(request, { params }) {
    const admin = getAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;
    const availability = getAvailabilityWithOverrides(id);
    return NextResponse.json({ availability });
}

// POST — save full availability state
export async function POST(request, { params }) {
    const admin = getAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const { available, unavailable } = await request.json();

        if (!Array.isArray(available) || !Array.isArray(unavailable)) {
            return NextResponse.json(
                { error: 'available and unavailable must be arrays' },
                { status: 400 }
            );
        }

        setAvailabilityOverride(id, { available, unavailable });

        return NextResponse.json({
            success: true,
            availability: getAvailabilityWithOverrides(id),
        });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 });
    }
}

