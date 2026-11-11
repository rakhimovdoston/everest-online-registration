import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Cookies from 'js-cookie';

import uzTranslation from './locales/uz/translation.json';
import ruTranslation from './locales/ru/translation.json';
import enTranslation from './locales/en/translation.json';

// Get language from cookie or use default
const getInitialLanguage = () => {
  const savedLanguage = Cookies.get('language');
  if (savedLanguage && ['uz', 'ru', 'en'].includes(savedLanguage)) {
    return savedLanguage;
  }
  return 'uz'; // Default language
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      uz: {
        translation: uzTranslation,
      },
      ru: {
        translation: ruTranslation,
      },
      en: {
        translation: enTranslation,
      },
    },
    lng: getInitialLanguage(),
    fallbackLng: 'uz',
    interpolation: {
      escapeValue: false,
    },
  });

// Keep <html lang>, <title> and meta description in the active language
const applySeo = (lng) => {
  const t = i18n.getFixedT(lng);
  document.documentElement.lang = lng;
  document.title = t('seo.title');
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('seo.description'));
};

applySeo(i18n.language);

i18n.on('languageChanged', (lng) => {
  Cookies.set('language', lng, { expires: 365 });
  applySeo(lng);
});

export default i18n;
