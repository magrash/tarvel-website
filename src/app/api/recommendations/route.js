import { NextResponse } from 'next/server';
import { getRecommendations } from '@/lib/recommendations';
import { getUserProfile } from '@/lib/tracker';

export async function GET(request) {
    const { searchParams } = new URL(request.url);

    const destination = searchParams.get('destination') || null;
    const budget = searchParams.get('budget') ? parseFloat(searchParams.get('budget')) : null;
    const tourType = searchParams.get('tourType') || null;
    const level = searchParams.get('level') || null;
    const userId = searchParams.get('userId') || null;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 6;
    const excludeTourId = searchParams.get('excludeTourId') ? parseInt(searchParams.get('excludeTourId')) : null;

    // Build profile from user activity if userId provided
    let viewedTourIds = [];
    let bookedTourIds = [];

    if (userId) {
        const profile = getUserProfile(userId);
        viewedTourIds = profile.viewedTourIds;
        bookedTourIds = profile.bookedTourIds;
    }

    // Add current tour to exclusions if on a detail page
    if (excludeTourId) {
        bookedTourIds = [...bookedTourIds, excludeTourId];
    }

    const recommendations = getRecommendations({
        destination,
        budget,
        tourType,
        level,
        viewedTourIds,
        bookedTourIds,
        limit,
    });

    return NextResponse.json({
        recommendations: recommendations.map(r => ({
            ...r.tour,
            score: r.score,
            breakdown: r.breakdown,
            reasons: r.reasons,
        })),
        total: recommendations.length,
        params: { destination, budget, tourType, level, userId },
    });
}
