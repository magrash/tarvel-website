import { NextResponse } from 'next/server';
import { getPaymentById, updatePayment, updateBooking } from '@/lib/db';

export async function POST(request) {
    try {
        const { paymentId, paymentIntentId } = await request.json();

        if (!paymentId) {
            return NextResponse.json(
                { error: 'paymentId is required' },
                { status: 400 }
            );
        }

        // Find payment record
        const payment = getPaymentById(paymentId);
        if (!payment) {
            return NextResponse.json(
                { error: 'Payment not found' },
                { status: 404 }
            );
        }

        // Prevent double confirmation
        if (payment.status === 'paid') {
            return NextResponse.json({
                success: true,
                payment,
                message: 'Payment was already confirmed',
            });
        }

        // ─── Stripe Verification ───
        // In production, verify with Stripe:
        // const paymentIntent = await stripe.paymentIntents.retrieve(payment.transactionId);
        // if (paymentIntent.status !== 'succeeded') {
        //     return NextResponse.json({ error: 'Payment not yet succeeded' }, { status: 400 });
        // }

        // Simulation mode: confirm payment
        const updatedPayment = updatePayment(payment.id, {
            status: 'paid',
            confirmedAt: new Date().toISOString(),
        });

        // Update booking status
        updateBooking(payment.bookingId, {
            paymentStatus: 'paid',
            bookingStatus: 'confirmed',
        });

        return NextResponse.json({
            success: true,
            payment: updatedPayment,
            message: 'Payment confirmed and booking updated',
        });

    } catch (error) {
        console.error('Stripe confirm error:', error);
        return NextResponse.json(
            { error: 'Failed to confirm payment' },
            { status: 500 }
        );
    }
}
