import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'ru', "az"],

  // Used when no locale matches
  defaultLocale: 'en',

  // Always show locale prefix in URLs for consistent behavior
  localePrefix: 'always',
});
