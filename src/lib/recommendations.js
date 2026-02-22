// ========================================
// GOBA TRAVEL — AI Tour Recommendation Engine
// Multi-signal scoring with content-based filtering
// ========================================

import { getManagedTours } from './db';

// Scoring weights
const WEIGHTS = {
    contentMatch: 0.35,
    popularity: 0.25,
    budgetFit: 0.20,
    similarity: 0.20,
};

/**
 * Get ranked tour recommendations based on multiple signals
 * @param {Object} params - Recommendation parameters
 * @param {string} params.destination - Preferred destination
 * @param {number} params.budget - Budget per person (USD)
 * @param {string} params.tourType - Preferred tour type (full-day, half-day, package)
 * @param {string} params.level - Experience level preference
 * @param {number[]} params.viewedTourIds - Previously viewed tour IDs
 * @param {number[]} params.bookedTourIds - Previously booked tour IDs
 * @param {number} params.limit - Max results to return
 * @returns {Array} Ranked tour recommendations with scores and reasons
 */
export function getRecommendations({
    destination = null,
    budget = null,
    tourType = null,
    level = null,
    viewedTourIds = [],
    bookedTourIds = [],
    limit = 6,
}) {
    const tours = getManagedTours().filter(t => t.enabled !== false);

    // Don't recommend already-booked tours
    const excludeIds = new Set(bookedTourIds);

    const scored = tours
        .filter(t => !excludeIds.has(t.id))
        .map(tour => {
            const contentScore = scoreContentMatch(tour, { destination, tourType, level });
            const popularityScore = scorePopularity(tour);
            const budgetScore = scoreBudgetFit(tour, budget);
            const similarityScore = scoreSimilarity(tour, viewedTourIds, tours);

            const totalScore =
                contentScore * WEIGHTS.contentMatch +
                popularityScore * WEIGHTS.popularity +
                budgetScore * WEIGHTS.budgetFit +
                similarityScore * WEIGHTS.similarity;

            const reasons = generateReasons(tour, {
                contentScore, popularityScore, budgetScore, similarityScore,
                destination, budget, tourType,
            });

            return {
                tour,
                score: Math.round(totalScore * 100) / 100,
                breakdown: {
                    content: Math.round(contentScore * 100),
                    popularity: Math.round(popularityScore * 100),
                    budget: Math.round(budgetScore * 100),
                    similarity: Math.round(similarityScore * 100),
                },
                reasons,
            };
        });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, limit);
}

// ─── Scoring Functions ──────────────────────────

function scoreContentMatch(tour, { destination, tourType, level }) {
    let score = 0;
    let factors = 0;

    if (destination) {
        factors++;
        if (tour.destination?.toLowerCase() === destination.toLowerCase()) {
            score += 1.0;
        } else if (tour.destination?.toLowerCase().includes(destination.toLowerCase())) {
            score += 0.5;
        }
    }

    if (tourType) {
        factors++;
        if (tour.tourType === tourType) {
            score += 1.0;
        } else if (
            (tourType === 'full-day' && tour.tourType === 'half-day') ||
            (tourType === 'half-day' && tour.tourType === 'full-day')
        ) {
            score += 0.3; // Partial match for day tours
        }
    }

    if (level) {
        factors++;
        if (tour.level?.toLowerCase() === level.toLowerCase()) {
            score += 1.0;
        }
    }

    return factors > 0 ? score / factors : 0.5; // Default to neutral if no filters
}

function scorePopularity(tour) {
    // Normalize: rating out of 5, reviews capped at 500
    const ratingScore = (tour.rating || 0) / 5;
    const reviewsScore = Math.min((tour.reviews || 0) / 500, 1);
    return ratingScore * 0.6 + reviewsScore * 0.4;
}

function scoreBudgetFit(tour, budget) {
    if (!budget || budget <= 0) return 0.5; // Neutral if no budget specified

    const price = tour.price || 0;
    const ratio = price / budget;

    if (ratio >= 0.7 && ratio <= 1.0) return 1.0;       // Sweet spot: 70-100% of budget
    if (ratio >= 0.5 && ratio < 0.7) return 0.8;         // Good deal: 50-70% of budget
    if (ratio > 1.0 && ratio <= 1.2) return 0.6;         // Slightly over: 100-120%
    if (ratio > 1.2 && ratio <= 1.5) return 0.3;         // Over budget: 120-150%
    if (ratio < 0.5) return 0.4;                           // Very cheap (may seem low-quality)
    return 0.1;                                            // Way over budget
}

function scoreSimilarity(tour, viewedTourIds, allTours) {
    if (!viewedTourIds || viewedTourIds.length === 0) return 0.5; // Neutral

    const viewedTours = allTours.filter(t => viewedTourIds.includes(t.id));
    if (viewedTours.length === 0) return 0.5;

    let totalSim = 0;

    for (const viewed of viewedTours) {
        let sim = 0;
        let factors = 0;

        // Destination match
        factors++;
        if (tour.destination === viewed.destination) sim += 1.0;

        // Tour type match
        factors++;
        if (tour.tourType === viewed.tourType) sim += 1.0;

        // Highlight overlap (Jaccard similarity)
        if (tour.highlights && viewed.highlights) {
            factors++;
            const tourSet = new Set(tour.highlights.map(h => h.toLowerCase()));
            const viewedSet = new Set(viewed.highlights.map(h => h.toLowerCase()));
            const intersection = [...tourSet].filter(h => viewedSet.has(h)).length;
            const union = new Set([...tourSet, ...viewedSet]).size;
            sim += union > 0 ? intersection / union : 0;
        }

        // Price proximity
        factors++;
        const priceDiff = Math.abs((tour.price || 0) - (viewed.price || 0));
        sim += Math.max(0, 1 - priceDiff / 200);

        totalSim += factors > 0 ? sim / factors : 0;
    }

    return totalSim / viewedTours.length;
}

// ─── Reason Generation ──────────────────────────

function generateReasons(tour, { contentScore, popularityScore, budgetScore, destination, budget, tourType }) {
    const reasons = [];

    if (contentScore > 0.7 && destination) {
        reasons.push(`Perfect for ${destination} travelers`);
    }
    if (popularityScore > 0.8) {
        reasons.push(`Highly rated (${tour.rating}★ · ${tour.reviews} reviews)`);
    }
    if (budgetScore > 0.7 && budget) {
        reasons.push(`Great value for your budget`);
    }
    if (tourType && tour.tourType === tourType) {
        reasons.push(`Matches your preferred ${tourType.replace('-', ' ')} style`);
    }
    if (tour.highlights && tour.highlights.length > 4) {
        reasons.push(`Rich itinerary with ${tour.highlights.length} highlights`);
    }

    return reasons.length > 0 ? reasons : ['Popular choice among travelers'];
}
