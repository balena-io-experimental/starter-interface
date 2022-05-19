// Languages for the language switcher menu.

// They will display in the same order as given here.

// Value = name of the json file stored in the i18n folder (without extension). Files must
// follow the standard naming used by browsers to benefit from auto detection of locale.

// Label = the name to display in the language switcher for that language.

export default [
  { value: 'en-US', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
  { value: 'pt-BR', label: 'Português' }
]

// Quasar has its own language packs that are used as generic labels for things like tables. To keep
// the build small, only the language packs for active languages are imported. When adding additional
// languages, change the glob in the import statement to include the new language pack. Entires
// should match those included in the default export above.

// '../../../node_modules/quasar/lang/(en-US|fr).mjs' <-- imports English and French
// '../../../node_modules/quasar/lang/(en-US|fr|it).mjs' <-- imports English, French and Italian

export const qLangList = import.meta.glob(
  '../../../node_modules/quasar/lang/(en-US|es|fr|pt-BR).mjs'
)
