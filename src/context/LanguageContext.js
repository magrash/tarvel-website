'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import translations from '@/lib/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState('en');

    // Get nested translation key like "nav.destinations"
    const t = useCallback((key) => {
        const keys = key.split('.');
        let value = translations[lang];
        for (const k of keys) {
            value = value?.[k];
        }
        // Fallback to English if missing
        if (value === undefined) {
            value = translations.en;
            for (const k of keys) {
                value = value?.[k];
            }
        }
        return value || key;
    }, [lang]);

    const isRTL = lang === 'ar';

    return (
        <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
