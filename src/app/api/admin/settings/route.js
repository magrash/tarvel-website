import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getSiteSettings, updateSiteSettings, updateAdmin, getAdminById } from '@/lib/db';

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

    const settings = getSiteSettings();
    const adminUser = getAdminById(admin.userId);

    return NextResponse.json({
        settings,
        admin: adminUser ? {
            id: adminUser.id,
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role,
        } : null,
    });
}

export async function PUT(request) {
    const admin = getAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { settings, profile } = body;

        let updatedSettings = null;
        let updatedProfile = null;

        if (settings) {
            updatedSettings = updateSiteSettings(settings);
        }

        if (profile) {
            updatedProfile = updateAdmin(admin.userId, profile);
            if (updatedProfile) {
                updatedProfile = {
                    id: updatedProfile.id,
                    name: updatedProfile.name,
                    email: updatedProfile.email,
                    role: updatedProfile.role,
                };
            }
        }

        return NextResponse.json({
            success: true,
            settings: updatedSettings,
            admin: updatedProfile,
        });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
