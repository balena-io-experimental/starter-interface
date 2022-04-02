import { boot } from 'quasar/wrappers'
import { createI18n, LocaleMessageDictionary, VueMessageType } from 'vue-i18n'
import enUS from 'src/i18n/en-US.json'

// Set default language
const defaultLang = 'en-US'
const loadedLanguages = [defaultLang]

// Store all the i18n files in glob
const langGlob = import.meta.glob('src/i18n/*.json')

// Create i18n instance
const i18n = createI18n({
  globalInjection: true,
  locale: 'en-US',
  messages: {
    'en-US': enUS
  }
})

export async function loadLanguageAsync(isoName: string) {
  // If the language was already loaded
  if (loadedLanguages.includes(isoName)) {
    return Promise.resolve(isoName)
  }

  // If the language hasn't been loaded yet
  if (langGlob[`../i18n/${isoName}.json`]) {
    return await langGlob[`../i18n/${isoName}.json`]().then((messages) => {
      i18n.global.setLocaleMessage(
        isoName,
        messages.default as LocaleMessageDictionary<VueMessageType>
      )
      loadedLanguages.push(isoName)
      return Promise.resolve(isoName)
    })
  } else {
    return Promise.resolve(defaultLang)
  }
}

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n)
})

export { i18n }
