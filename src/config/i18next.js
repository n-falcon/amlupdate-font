import i18n from 'i18next'
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector'
import langEsCl from '../locales/esCl.json'
import langEsCr from '../locales/esCl.json'
import langEsPe from '../locales/esPe.json'
import langEnCl from '../locales/enCl.json'
import langEnCr from '../locales/enCl.json'
import langEnPe from '../locales/enPe.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      esCHI: {
        translations: langEsCl
      },
      esCR: {
        translations: langEsCr
      },
      esPER: {
        translations: langEsPe
      },
      enCHI: {
        translations: langEnCl
      },
      enCR: {
        translations: langEnCr
      },
      enPER: {
        translations: langEnPe
      }
    },

    detection: {
      //order: ['navigator'],
      lookupQuerystring: 'lang'
    },

    fallbackLng: "esCHI",
    debug: true,

    ns: ["translations"],

    defaultNS: "translations",

    keySeparator: false, // we use content as keys

    interpolation: {
      formatSeparator: ","
    },

    react: {
      wait: true
    }
  })

export default i18n
