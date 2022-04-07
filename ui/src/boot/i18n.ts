import enUS from 'src/i18n/en-US.json'
import { Quasar, LocalStorage } from 'quasar'
import { boot } from 'quasar/wrappers'
import { createI18n, LocaleMessageDictionary, VueMessageType } from 'vue-i18n'

// Set default language
const defaultLang = 'en-US'
const loadedLanguages = [defaultLang]

// Store all the i18n files in glob
const langGlob = import.meta.glob('src/i18n/*.json')

// Create i18n instance
const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  locale: 'en-US',
  messages: {
    'en-US': enUS
  }
})

// Set language to previously chosen according to local storage, otherwise use browser default
if (LocalStorage.getItem('lang')) {
  void loadLanguageAsync(LocalStorage.getItem('lang') as string)
} else if (langGlob[`../i18n/${Quasar.lang.getLocale() as string}.json`]) {
  void loadLanguageAsync(Quasar.lang.getLocale() as string)
}

export function loadLanguageAsync(isoName: string) {
  // Store the chosen language in local storage
  LocalStorage.set('lang', isoName)

  // If the language was already loaded
  if (loadedLanguages.includes(isoName)) {
    return Promise.resolve((i18n.global.locale.value = isoName))
  }

  // If the language hasn't been loaded yet
  return langGlob[`../i18n/${isoName}.json`]().then((messages) => {
    i18n.global.setLocaleMessage(
      isoName,
      messages.default as LocaleMessageDictionary<VueMessageType>
    )
    loadedLanguages.push(isoName)
    return Promise.resolve((i18n.global.locale.value = isoName))
  })
}

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n)
})

export { i18n }
