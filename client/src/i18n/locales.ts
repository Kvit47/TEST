export const locales = ['en', 'ru', 'az'] as const;
export type Locale = (typeof locales)[number];