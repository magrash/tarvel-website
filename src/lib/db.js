// ========================================
// GOBA TRAVEL — Centralized In-Memory Data Store
// Uses globalThis to persist across Next.js hot-reloads
// Replace with MongoDB/PostgreSQL in production
// ========================================

import {
    tours as tourData,
    destinations as destinationData,
    testimonials as testimonialData,
    stats as statsData,
    experiences as experienceData,
    galleryImages as galleryData,
    faqs as faqData,
    getAvailability as getDefaultAvailability
} from './data';
import bcrypt from 'bcryptjs';

// ─── Persistent Store via globalThis ─────────────
// This prevents data loss when Next.js recompiles modules during dev
if (!globalThis.__goba_db) {
    globalThis.__goba_db = {
        // Bookings & payments
        bookings: [],
        nextBookingId: 1,
        payments: [],
        nextPaymentId: 1,

        // User activity
        userActivity: [],

        // Tours (already managed)
        managedTours: tourData.map(t => ({ ...t, enabled: true })),
        nextTourId: Math.max(...tourData.map(t => t.id)) + 1,
        availabilityOverrides: {},

        // Destinations
        destinations: destinationData.map(d => ({ ...d })),
        nextDestinationId: Math.max(...destinationData.map(d => d.id)) + 1,

        // Testimonials
        testimonials: testimonialData.map(t => ({ ...t })),
        nextTestimonialId: Math.max(...testimonialData.map(t => t.id)) + 1,

        // Stats
        stats: { ...statsData },

        // Experiences
        experiences: experienceData.map(e => ({ ...e })),

        // Gallery images
        gallery: galleryData.map((url, i) => ({ id: i + 1, url })),
        nextGalleryId: galleryData.length + 1,

        // FAQs
        faqs: faqData.map((f, i) => ({ id: i + 1, ...f })),
        nextFaqId: faqData.length + 1,

        // Hero content
        hero: {
            title: 'Journey Through',
            titleHighlight: '5000 Years',
            subtitle: 'Experience the magic of ancient Egypt with expertly crafted tours. From the Great Pyramids to the Valley of the Kings, your adventure awaits.',
            ctaPrimary: 'Begin Your Journey',
            ctaPrimaryLink: '/tours',
            ctaSecondary: 'Explore Destinations',
            ctaSecondaryLink: '/destinations',
        },

        // Admin users
        adminUsers: [
            {
                id: 1,
                email: 'admin@goba.com',
                passwordHash: bcrypt.hashSync('admin123', 10),
                role: 'admin',
                name: 'Goba Admin',
            },
        ],

        // Site settings
        siteSettings: {
            siteName: 'Goba Travel',
            contactEmail: 'info@gobatravel.com',
            whatsappNumber: '',
            currency: 'USD',
        },
    };
}

const db = globalThis.__goba_db;

// ─── Bookings ───────────────────────────────────
export function createBooking(data) {
    const booking = {
        id: `BK-${String(db.nextBookingId++).padStart(6, '0')}`,
        ...data,
        paymentStatus: 'unpaid',
        bookingStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    db.bookings.push(booking);
    return booking;
}

export function getBookingById(id) {
    return db.bookings.find(b => b.id === id) || null;
}

export function getAllBookings(filters = {}) {
    let result = [...db.bookings];

    if (filters.status) {
        result = result.filter(b => b.bookingStatus === filters.status);
    }
    if (filters.tourId) {
        result = result.filter(b => b.tourId === parseInt(filters.tourId));
    }
    if (filters.dateFrom) {
        result = result.filter(b => b.selectedDate >= filters.dateFrom);
    }
    if (filters.dateTo) {
        result = result.filter(b => b.selectedDate <= filters.dateTo);
    }
    if (filters.paymentStatus) {
        result = result.filter(b => b.paymentStatus === filters.paymentStatus);
    }

    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return result;
}

export function updateBooking(id, updates) {
    const idx = db.bookings.findIndex(b => b.id === id);
    if (idx === -1) return null;
    db.bookings[idx] = { ...db.bookings[idx], ...updates, updatedAt: new Date().toISOString() };
    return db.bookings[idx];
}

export function deleteBooking(id) {
    const idx = db.bookings.findIndex(b => b.id === id);
    if (idx === -1) return false;
    db.bookings.splice(idx, 1);
    return true;
}

// ─── Payments ───────────────────────────────────
export function createPayment(data) {
    const payment = {
        id: `PAY-${String(db.nextPaymentId++).padStart(6, '0')}`,
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    db.payments.push(payment);
    return payment;
}

export function getPaymentById(id) {
    return db.payments.find(p => p.id === id) || null;
}

export function getPaymentByBookingId(bookingId) {
    return db.payments.find(p => p.bookingId === bookingId && p.status === 'pending') || null;
}

export function updatePayment(id, updates) {
    const idx = db.payments.findIndex(p => p.id === id);
    if (idx === -1) return null;
    db.payments[idx] = { ...db.payments[idx], ...updates, updatedAt: new Date().toISOString() };
    return db.payments[idx];
}

export function getAllPayments(filters = {}) {
    let result = [...db.payments];

    if (filters.status) {
        result = result.filter(p => p.status === filters.status);
    }
    if (filters.provider) {
        result = result.filter(p => p.provider === filters.provider);
    }
    if (filters.bookingId) {
        result = result.filter(p => p.bookingId === filters.bookingId);
    }

    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return result;
}

// ─── Admin Users ────────────────────────────────
export function findAdminByEmail(email) {
    return db.adminUsers.find(u => u.email === email) || null;
}

export function getAdminById(id) {
    return db.adminUsers.find(u => u.id === id) || null;
}

export function updateAdmin(id, updates) {
    const idx = db.adminUsers.findIndex(u => u.id === id);
    if (idx === -1) return null;
    if (updates.password) {
        updates.passwordHash = bcrypt.hashSync(updates.password, 10);
        delete updates.password;
    }
    db.adminUsers[idx] = { ...db.adminUsers[idx], ...updates };
    return db.adminUsers[idx];
}

// ─── Site Settings ──────────────────────────────
export function getSiteSettings() {
    return { ...db.siteSettings };
}

export function updateSiteSettings(updates) {
    db.siteSettings = { ...db.siteSettings, ...updates };
    return db.siteSettings;
}

// ─── User Activity (for AI Recommendations) ─────
export function trackActivity(data) {
    db.userActivity.push({
        ...data,
        timestamp: new Date().toISOString(),
    });
    if (db.userActivity.length > 1000) {
        db.userActivity = db.userActivity.slice(-1000);
    }
}

export function getUserActivity(userId) {
    return db.userActivity.filter(a => a.userId === userId);
}

export function getAllActivity() {
    return [...db.userActivity];
}

// ─── Tour Management (Admin) ────────────────────
export function getManagedTours() {
    return [...db.managedTours];
}

export function getManagedTourById(id) {
    // Support lookup by numeric ID or by slug string
    const numericId = parseInt(id);
    return db.managedTours.find(t =>
        t.id === numericId || t.slug === id
    ) || null;
}

export function createTour(data) {
    const tour = {
        id: db.nextTourId++,
        ...data,
        enabled: true,
        rating: 0,
        reviews: 0,
        createdAt: new Date().toISOString(),
    };
    db.managedTours.push(tour);
    return tour;
}

export function updateTour(id, updates) {
    const idx = db.managedTours.findIndex(t => t.id === parseInt(id));
    if (idx === -1) return null;
    db.managedTours[idx] = { ...db.managedTours[idx], ...updates };
    return db.managedTours[idx];
}

export function deleteTour(id) {
    const idx = db.managedTours.findIndex(t => t.id === parseInt(id));
    if (idx === -1) return false;
    db.managedTours.splice(idx, 1);
    return true;
}

// ─── Availability Overrides ─────────────────────
export function setAvailabilityOverride(tourId, dates) {
    db.availabilityOverrides[tourId] = dates;
}

export function getAvailabilityWithOverrides(tourId) {
    const overrides = db.availabilityOverrides[tourId];
    const base = getDefaultAvailability(tourId);

    if (!overrides) {
        // No admin overrides — use default availability
        return {
            available: base.available || [],
            unavailable: base.unavailable || [],
        };
    }

    // Merge: admin overrides take precedence over base
    const overrideAvailSet = new Set(overrides.available || []);
    const overrideBlockSet = new Set(overrides.unavailable || []);
    const allOverrideDates = new Set([...overrideAvailSet, ...overrideBlockSet]);

    // Start with override dates
    const finalAvailable = [...overrideAvailSet];
    const finalUnavailable = [...overrideBlockSet];

    // Add base dates that aren't in any override
    for (const d of (base.available || [])) {
        if (!allOverrideDates.has(d)) finalAvailable.push(d);
    }
    for (const d of (base.unavailable || [])) {
        if (!allOverrideDates.has(d)) finalUnavailable.push(d);
    }

    return { available: finalAvailable, unavailable: finalUnavailable };
}

// ─── Destinations ───────────────────────────────
export function getAllDestinations() {
    return [...db.destinations];
}

export function getDestinationById(id) {
    return db.destinations.find(d => d.id === parseInt(id)) || null;
}

export function createDestination(data) {
    const dest = {
        id: db.nextDestinationId++,
        ...data,
    };
    db.destinations.push(dest);
    return dest;
}

export function updateDestination(id, updates) {
    const idx = db.destinations.findIndex(d => d.id === parseInt(id));
    if (idx === -1) return null;
    db.destinations[idx] = { ...db.destinations[idx], ...updates };
    return db.destinations[idx];
}

export function deleteDestination(id) {
    const idx = db.destinations.findIndex(d => d.id === parseInt(id));
    if (idx === -1) return false;
    db.destinations.splice(idx, 1);
    return true;
}

// ─── Testimonials ───────────────────────────────
export function getAllTestimonials() {
    return [...db.testimonials];
}

export function getTestimonialById(id) {
    return db.testimonials.find(t => t.id === parseInt(id)) || null;
}

export function createTestimonial(data) {
    const testimonial = {
        id: db.nextTestimonialId++,
        ...data,
    };
    db.testimonials.push(testimonial);
    return testimonial;
}

export function updateTestimonial(id, updates) {
    const idx = db.testimonials.findIndex(t => t.id === parseInt(id));
    if (idx === -1) return null;
    db.testimonials[idx] = { ...db.testimonials[idx], ...updates };
    return db.testimonials[idx];
}

export function deleteTestimonial(id) {
    const idx = db.testimonials.findIndex(t => t.id === parseInt(id));
    if (idx === -1) return false;
    db.testimonials.splice(idx, 1);
    return true;
}

// ─── Stats ──────────────────────────────────────
export function getStats() {
    return { ...db.stats };
}

export function updateStats(updates) {
    db.stats = { ...db.stats, ...updates };
    return db.stats;
}

// ─── Experiences ────────────────────────────────
export function getAllExperiences() {
    return [...db.experiences];
}

export function updateExperience(id, updates) {
    const idx = db.experiences.findIndex(e => e.id === id);
    if (idx === -1) return null;
    db.experiences[idx] = { ...db.experiences[idx], ...updates };
    return db.experiences[idx];
}

// ─── Gallery ────────────────────────────────────
export function getAllGallery() {
    return [...db.gallery];
}

export function addGalleryImage(url) {
    const img = { id: db.nextGalleryId++, url };
    db.gallery.push(img);
    return img;
}

export function removeGalleryImage(id) {
    const idx = db.gallery.findIndex(g => g.id === parseInt(id));
    if (idx === -1) return false;
    db.gallery.splice(idx, 1);
    return true;
}

export function reorderGallery(orderedIds) {
    const ordered = [];
    for (const id of orderedIds) {
        const img = db.gallery.find(g => g.id === id);
        if (img) ordered.push(img);
    }
    db.gallery = ordered;
    return db.gallery;
}

// ─── FAQs ───────────────────────────────────────
export function getAllFaqs() {
    return [...db.faqs];
}

export function getFaqById(id) {
    return db.faqs.find(f => f.id === parseInt(id)) || null;
}

export function createFaq(data) {
    const faq = {
        id: db.nextFaqId++,
        ...data,
    };
    db.faqs.push(faq);
    return faq;
}

export function updateFaq(id, updates) {
    const idx = db.faqs.findIndex(f => f.id === parseInt(id));
    if (idx === -1) return null;
    db.faqs[idx] = { ...db.faqs[idx], ...updates };
    return db.faqs[idx];
}

export function deleteFaq(id) {
    const idx = db.faqs.findIndex(f => f.id === parseInt(id));
    if (idx === -1) return false;
    db.faqs.splice(idx, 1);
    return true;
}

// ─── Hero Content ───────────────────────────────
export function getHero() {
    return { ...db.hero };
}

export function updateHero(updates) {
    db.hero = { ...db.hero, ...updates };
    return db.hero;
}

// ─── Stats (Dashboard KPIs) ─────────────────────
export function getDashboardStats() {
    const totalBookings = db.bookings.length;
    const totalRevenue = db.bookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const totalTours = db.managedTours.filter(t => t.enabled).length;
    const pendingBookings = db.bookings.filter(b => b.bookingStatus === 'pending').length;
    const confirmedBookings = db.bookings.filter(b => b.bookingStatus === 'confirmed').length;
    const totalPayments = db.payments.length;
    const paidPayments = db.payments.filter(p => p.status === 'completed').length;

    return {
        totalBookings,
        totalRevenue,
        totalTours,
        pendingBookings,
        confirmedBookings,
        totalPayments,
        paidPayments,
        avgRating: 4.9,
    };
}

// ─── Get All Content (public API) ───────────────
export function getAllContent() {
    return {
        destinations: getAllDestinations(),
        tours: getManagedTours().filter(t => t.enabled),
        testimonials: getAllTestimonials(),
        stats: getStats(),
        experiences: getAllExperiences(),
        gallery: getAllGallery(),
        faqs: getAllFaqs(),
        hero: getHero(),
        siteSettings: getSiteSettings(),
    };
}
