// Admin Testimonials API — GET all, POST new
import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { getAllTestimonials, createTestimonial } from '@/lib/db';

export const GET = withAuth(async () => {
    const testimonials = getAllTestimonials();
    return NextResponse.json({ testimonials });
});

export const POST = withAuth(async (request) => {
    try {
        const data = await request.json();
        if (!data.name || !data.text) {
            return NextResponse.json({ error: 'Name and text are required' }, { status: 400 });
        }
        const testimonial = createTestimonial(data);
        return NextResponse.json({ testimonial }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
});
