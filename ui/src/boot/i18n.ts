/* eslint-disable @typescript-eslint/no-unsafe-call */
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

const i18n = createI18n({
  locale: 'en-US',
  messages
})

export default ({ app }: any) => {
  // Set i18n instance on app
  app.use(i18n)
}

export { i18n }
