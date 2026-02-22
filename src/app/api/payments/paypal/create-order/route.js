import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getBookingById, createPayment, getPaymentByBookingId } from '@/lib/db';

export async function POST(request) {
    try {
        const { bookingId } = await request.json();

        if (!bookingId) {
            return NextResponse.json(
                { error: 'bookingId is required' },
                { status: 400 }
            );
        }

        const booking = getBookingById(bookingId);
        if (!booking) {
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            );
        }

        // Idempotency check
        const existingPayment = getPaymentByBookingId(bookingId);
        if (existingPayment && existingPayment.provider === 'paypal') {
            return NextResponse.json({
                orderId: existingPayment.transactionId,
                approvalUrl: `https://www.sandbox.paypal.com/checkoutnow?token=${existingPayment.transactionId}`,
                paymentId: existingPayment.id,
                message: 'Existing PayPal order returned (idempotent)',
            });
        }

        if (booking.paymentStatus === 'paid') {
            return NextResponse.json(
                { error: 'Booking is already paid' },
                { status: 400 }
            );
        }

        const amount = booking.totalPrice;
        const currency = booking.currency || 'USD';

        // ─── PayPal Integration ───
        // In production, use PayPal REST API:
        // const order = await paypalClient.orders.create({
        //     intent: 'CAPTURE',
        //     purchase_units: [{
        //         amount: { currency_code: currency, value: amount.toFixed(2) },
        //         description: booking.tourTitle,
        //     }],
        // });

        // Simulation mode
        const orderId = `PAYPAL-${uuidv4().replace(/-/g, '').slice(0, 17).toUpperCase()}`;
        const approvalUrl = `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}`;

        const payment = createPayment({
            bookingId,
            provider: 'paypal',
            amount,
            currency,
            transactionId: orderId,
            idempotencyKey: uuidv4(),
        });

        return NextResponse.json({
            orderId,
            approvalUrl,
            paymentId: payment.id,
            amount,
            currency,
            message: 'PayPal order created successfully',
        });

    } catch (error) {
        console.error('PayPal create-order error:', error);
        return NextResponse.json(
            { error: 'Failed to create PayPal order' },
            { status: 500 }
        );
    }
}
