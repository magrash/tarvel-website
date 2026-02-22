// Public Content API — serves all data for public pages (no auth required)
import { NextResponse } from 'next/server';
import { getAllContent } from '@/lib/db';

export async function GET() {
    const content = getAllContent();
    return NextResponse.json(content);
}
