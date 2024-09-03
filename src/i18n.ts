import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
const path = require('path');

const namespace = ['main', 'api', 'about', 'model'];

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: path.resolve('../../../locales/{{lng}}/{{ns}}.json'),
    },
    fallbackLng: {
      default: ['en'],
    },
    ns: namespace,
    defaultNS: 'main',
  });

export default i18n;