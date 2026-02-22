import { NextResponse } from 'next/server';
import { trackView, trackBooking } from '@/lib/tracker';

export async function POST(request) {
    try {
        const { userId, event, tourId, metadata } = await request.json();

        if (!event || !tourId) {
            return NextResponse.json(
                { error: 'event and tourId are required' },
                { status: 400 }
            );
        }

        const validEvents = ['view', 'booking'];
        if (!validEvents.includes(event)) {
            return NextResponse.json(
                { error: `event must be one of: ${validEvents.join(', ')}` },
                { status: 400 }
            );
        }

        const trackerId = userId || 'anonymous';

        if (event === 'view') {
            trackView(trackerId, tourId, metadata || {});
        } else if (event === 'booking') {
            trackBooking(trackerId, tourId, metadata || {});
        }

        return NextResponse.json({ success: true, tracked: event });

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to track activity' },
            { status: 500 }
        );
    }
}
