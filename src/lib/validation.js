// ========================================
// GOBA TRAVEL — Input Validation Helpers
// ========================================

export function validateEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
}

export function validatePhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
    // Allow international format: +1234567890, spaces, dashes
    const re = /^\+?[\d\s\-()]{7,20}$/;
    return re.test(phone.trim());
}

export function validateDate(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) && dateStr.match(/^\d{4}-\d{2}-\d{2}$/);
}

export function validateBookingInput(data) {
    const errors = [];

    if (!data.tourId) errors.push('tourId is required');
    if (!data.selectedDate) errors.push('selectedDate is required');
    else if (!validateDate(data.selectedDate)) errors.push('Invalid date format (use YYYY-MM-DD)');
    if (!data.guestsCount || data.guestsCount < 1) errors.push('guestsCount must be at least 1');
    if (!data.customerInfo) errors.push('customerInfo is required');
    else {
        if (!data.customerInfo.name) errors.push('Customer name is required');
        if (!data.customerInfo.email) errors.push('Customer email is required');
        else if (!validateEmail(data.customerInfo.email)) errors.push('Invalid email format');
        if (!data.customerInfo.phone) errors.push('Customer phone is required');
        else if (!validatePhone(data.customerInfo.phone)) errors.push('Invalid phone format');
    }

    return errors.length > 0 ? errors : null;
}

export function validatePaymentInput(data) {
    const errors = [];

    if (!data.bookingId) errors.push('bookingId is required');

    return errors.length > 0 ? errors : null;
}

export function validateTourInput(data) {
    const errors = [];

    if (!data.title || data.title.trim().length < 3) errors.push('Title must be at least 3 characters');
    if (!data.price || data.price <= 0) errors.push('Price must be greater than 0');
    if (!data.destination) errors.push('Destination is required');
    if (!data.tourType) errors.push('Tour type is required');
    if (data.minPax && data.maxPax && data.minPax > data.maxPax) {
        errors.push('minPax cannot exceed maxPax');
    }

    return errors.length > 0 ? errors : null;
}

export function sanitizeInput(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
}

export function sanitizeObject(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            sanitized[key] = sanitizeInput(value);
        } else if (typeof value === 'object' && !Array.isArray(value)) {
            sanitized[key] = sanitizeObject(value);
        } else {
            sanitized[key] = value;
        }
    }
    return sanitized;
}
