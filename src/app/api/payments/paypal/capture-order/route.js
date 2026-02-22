import { NextResponse } from 'next/server';
import { getPaymentById, updatePayment, updateBooking } from '@/lib/db';

export async function POST(request) {
    try {
        const { orderId, paymentId } = await request.json();

        if (!paymentId) {
            return NextResponse.json(
                { error: 'paymentId is required' },
                { status: 400 }
            );
        }

        const payment = getPaymentById(paymentId);
        if (!payment) {
            return NextResponse.json(
                { error: 'Payment not found' },
                { status: 404 }
            );
        }

        // Prevent double capture
        if (payment.status === 'paid') {
            return NextResponse.json({
                success: true,
                payment,
                message: 'Payment was already captured',
            });
        }

        // ─── PayPal Capture ───
        // In production:
        // const capture = await paypalClient.orders.capture(orderId);
        // if (capture.status !== 'COMPLETED') {
        //     return NextResponse.json({ error: 'Capture failed' }, { status: 400 });
        // }

        // Simulation mode
        const updatedPayment = updatePayment(payment.id, {
            status: 'paid',
            capturedAt: new Date().toISOString(),
        });

        updateBooking(payment.bookingId, {
            paymentStatus: 'paid',
            bookingStatus: 'confirmed',
        });

        return NextResponse.json({
            success: true,
            payment: updatedPayment,
            message: 'PayPal payment captured and booking confirmed',
        });

    } catch (error) {
        console.error('PayPal capture error:', error);
        return NextResponse.json(
            { error: 'Failed to capture PayPal payment' },
            { status: 500 }
        );
    }
}
