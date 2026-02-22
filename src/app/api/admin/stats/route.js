import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getDashboardStats } from '@/lib/db';

function getAdmin(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    return verifyToken(authHeader.split(' ')[1]);
}

export async function GET(request) {
    const admin = getAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const stats = getDashboardStats();

    return NextResponse.json({ stats });
}
