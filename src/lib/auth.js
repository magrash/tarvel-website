// ========================================
// GOBA TRAVEL — JWT Authentication Utilities
// ========================================

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'goba-travel-admin-secret-key-2026';
const JWT_EXPIRY = '24h';

export function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
    );
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

export function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}

export function comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

// Middleware wrapper for protected admin routes
export function withAuth(handler) {
    return async (request, context) => {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        if (decoded.role !== 'admin') {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            );
        }

        // Attach user to request
        request.adminUser = decoded;
        return handler(request, context);
    };
}
