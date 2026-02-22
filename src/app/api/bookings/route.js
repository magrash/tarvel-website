import { getManagedTourById, getAvailabilityWithOverrides, createBooking, getAllBookings } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();

        const { tourId, selectedDate, guestsCount, customerInfo } = body;

        // Validate required fields
        if (!tourId || !selectedDate || !guestsCount || !customerInfo) {
            return NextResponse.json(
                { error: 'Missing required fields: tourId, selectedDate, guestsCount, customerInfo' },
                { status: 400 }
            );
        }

        if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
            return NextResponse.json(
                { error: 'Customer info must include name, email, and phone' },
                { status: 400 }
            );
        }

        // Find tour from managed store (consistent with detail page)
        const tour = getManagedTourById(tourId);
        if (!tour || !tour.enabled) {
            return NextResponse.json(
                { error: 'Tour not found' },
                { status: 404 }
            );
        }

        // Validate guest count
        const minPax = tour.minPax || 1;
        const maxPax = tour.maxPax || 12;
        if (guestsCount < minPax || guestsCount > maxPax) {
            return NextResponse.json(
                { error: `Guest count must be between ${minPax} and ${maxPax}` },
                { status: 400 }
            );
        }

        // Validate date availability (use same override-aware function as detail page)
        const availability = getAvailabilityWithOverrides(tour.id);
        if (!availability.available.includes(selectedDate)) {
            return NextResponse.json(
                { error: 'Selected date is not available' },
                { status: 400 }
            );
        }

        // Calculate total price
        const totalPrice = tour.price * guestsCount;

        // Create booking via centralized db
        const booking = createBooking({
            tourId: tour.id,
            tourTitle: tour.title,
            selectedDate,
            guestsCount,
            totalPrice,
            currency: tour.currency || 'USD',
            customerInfo,
        });

        return NextResponse.json({
            success: true,
            booking,
            message: 'Booking created successfully! Proceed to payment.',
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 }
        );
    }
}

export async function GET() {
    return NextResponse.json({ bookings: getAllBookings() });
}
