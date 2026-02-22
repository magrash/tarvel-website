export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/admin/'],
            },
        ],
        sitemap: 'https://gobatravel.com/sitemap.xml',
    };
}
