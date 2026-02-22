import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getBookingById, createPayment, getPaymentByBookingId } from '@/lib/db';

// In production, import Stripe and use real keys:
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        const { bookingId } = await request.json();

        if (!bookingId) {
            return NextResponse.json(
                { error: 'bookingId is required' },
                { status: 400 }
            );
        }

        // Find booking
        const booking = getBookingById(bookingId);
        if (!booking) {
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            );
        }

        // Prevent double payment — idempotency check
        const existingPayment = getPaymentByBookingId(bookingId);
        if (existingPayment) {
            return NextResponse.json({
                clientSecret: existingPayment.transactionId,
                paymentId: existingPayment.id,
                amount: existingPayment.amount,
                currency: existingPayment.currency,
                message: 'Existing payment intent returned (idempotent)',
            });
        }

        // Check booking is not already paid
        if (booking.paymentStatus === 'paid') {
            return NextResponse.json(
                { error: 'Booking is already paid' },
                { status: 400 }
            );
        }

        // Server-side price validation (prevents client tampering)
        const amount = booking.totalPrice;
        const currency = booking.currency || 'USD';

        // ─── Stripe Integration ───
        // In production:
        // const paymentIntent = await stripe.paymentIntents.create({
        //     amount: Math.round(amount * 100), // Stripe uses cents
        //     currency: currency.toLowerCase(),
        //     metadata: { bookingId },
        // });
        // const clientSecret = paymentIntent.client_secret;
        // const transactionId = paymentIntent.id;

        // Dev/simulation mode
        const transactionId = `pi_sim_${uuidv4().replace(/-/g, '').slice(0, 24)}`;
        const clientSecret = `${transactionId}_secret_${uuidv4().replace(/-/g, '').slice(0, 16)}`;

        // Create payment record
        const payment = createPayment({
            bookingId,
            provider: 'stripe',
            amount,
            currency,
            transactionId,
            idempotencyKey: uuidv4(),
        });

        return NextResponse.json({
            clientSecret,
            paymentId: payment.id,
            amount,
            currency,
            message: 'Payment intent created successfully',
        });

    } catch (error) {
        console.error('Stripe create-intent error:', error);
        return NextResponse.json(
            { error: 'Failed to create payment intent' },
            { status: 500 }
        );
    }
}
