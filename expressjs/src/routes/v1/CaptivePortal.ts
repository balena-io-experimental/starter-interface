import express from 'express'
import Logger from '@/common/logger'
const router = express.Router()

// Captive portals on devices work by trying an online path to check to see if it recieves
// a response. By intercepting the request to that path, we can make a captive portal appear.
// This list constitutes the routes we are aware of.

// Android
router.get('/connectivitycheck.gstatic.com', function (_req, res) {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})
router.get('/gen_204', function (_req, res) {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})
router.get('/generate_204', function (_req, res) {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})
router.get('/mobile/status.php', function (_req, res) {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})
router.get('connectivitycheck.android.com', function (_req, res) {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})
router.get('clients3.google.com', function (_req, res) {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})

// iOS/OSX
router.get('/success.html', function (req, res) {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})
router.get('/hotspotdetect.html', function (_req, res) {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})
router.get('/hotspot-detect.html', function (_req, res) {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})

// Microsoft
router.get('/ncsi.txt', function (_req, res) {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})
router.get('msftconnecttest.com', function (_req, res) {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})
router.get('msftncsi.com', function (_req, res) {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})

// Kindle
router.get('/wifiredirect.html', function (_req, res) {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})

// FireFox
router.get('detectportal.firefox.com/canonical.html', function (_req, res) {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})

// Misc
router.get('/blank.html', function (_req, res) {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})

export default router
