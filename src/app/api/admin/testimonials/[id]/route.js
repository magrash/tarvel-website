// Admin Single Testimonial API — PUT update, DELETE remove
import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { updateTestimonial, deleteTestimonial } from '@/lib/db';

export const PUT = withAuth(async (request, { params }) => {
    try {
        const { id } = await params;
        const updates = await request.json();
        const testimonial = updateTestimonial(id, updates);
        if (!testimonial) {
            return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
        }
        return NextResponse.json({ testimonial });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
});

export const DELETE = withAuth(async (request, { params }) => {
    const { id } = await params;
    const success = deleteTestimonial(id);
    if (!success) {
        return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
});
