// ========================================
// GOBA TRAVEL — User Activity Tracker
// Cookie-based anonymous tracking for AI recommendations
// ========================================

import { trackActivity as dbTrack, getUserActivity } from './db';

/**
 * Track a user viewing a tour page
 */
export function trackView(userId, tourId, metadata = {}) {
    dbTrack({
        userId,
        event: 'view',
        tourId: parseInt(tourId),
        metadata,
    });
}

/**
 * Track a completed booking
 */
export function trackBooking(userId, tourId, metadata = {}) {
    dbTrack({
        userId,
        event: 'booking',
        tourId: parseInt(tourId),
        metadata,
    });
}

/**
 * Build a user preference profile from their activity
 */
export function getUserProfile(userId) {
    const activity = getUserActivity(userId);
    if (!activity || activity.length === 0) {
        return {
            viewedTourIds: [],
            bookedTourIds: [],
            preferredDestinations: [],
            preferredTourTypes: [],
            avgBudget: null,
        };
    }

    const viewedTourIds = [...new Set(
        activity.filter(a => a.event === 'view').map(a => a.tourId)
    )];

    const bookedTourIds = [...new Set(
        activity.filter(a => a.event === 'booking').map(a => a.tourId)
    )];

    // Extract preferences from metadata
    const destinations = activity
        .filter(a => a.metadata?.destination)
        .map(a => a.metadata.destination);
    const tourTypes = activity
        .filter(a => a.metadata?.tourType)
        .map(a => a.metadata.tourType);
    const budgets = activity
        .filter(a => a.metadata?.budget)
        .map(a => a.metadata.budget);

    // Count frequencies for preferences
    const preferredDestinations = getMostFrequent(destinations);
    const preferredTourTypes = getMostFrequent(tourTypes);
    const avgBudget = budgets.length > 0
        ? Math.round(budgets.reduce((a, b) => a + b, 0) / budgets.length)
        : null;

    return {
        viewedTourIds,
        bookedTourIds,
        preferredDestinations,
        preferredTourTypes,
        avgBudget,
    };
}

function getMostFrequent(arr) {
    const counts = {};
    arr.forEach(item => {
        counts[item] = (counts[item] || 0) + 1;
    });
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([item]) => item);
}
