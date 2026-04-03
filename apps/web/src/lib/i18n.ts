import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../../public/locales/en/translation.json';
import mr from '../../public/locales/mr/translation.json';
import hiEn from '../../public/locales/hi-en/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      mr: { translation: mr },
      "hi-en": { translation: hiEn }
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
