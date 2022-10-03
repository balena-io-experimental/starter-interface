//
// Display the captive portal when connected to the devices hotspot
//

import Logger from '@/common/logger'
import express from 'express'

// Get the ExpressJS main router process
const router = express.Router()

// Captive portals on devices work by trying an online path to check to see if it receives
// a response. By intercepting the request to that path, we can make a captive portal appear.
// This list constitutes the routes we are aware of.

// Android
router.get('/connectivitycheck.gstatic.com', (_req, res) => {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})
router.get('/gen_204', (_req, res) => {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})
router.get('/generate_204', (_req, res) => {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})
router.get('/mobile/status.php', (_req, res) => {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})
router.get('connectivitycheck.android.com', (_req, res) => {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})
router.get('clients3.google.com', (_req, res) => {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})

// iOS/OSX
router.get('/success.html', (_req, res) => {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})
router.get('/hotspotdetect.html', (_req, res) => {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})
router.get('/hotspot-detect.html', (_req, res) => {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})

// Microsoft
router.get('/ncsi.txt', (_req, res) => {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})
router.get('msftconnecttest.com', (_req, res) => {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})
router.get('msftncsi.com', (_req, res) => {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})

// Kindle
router.get('/wifiredirect.html', (_req, res) => {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})

// FireFox
router.get('detectportal.firefox.com/canonical.html', (_req, res) => {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})

// Misc
router.get('/blank.html', (_req, res) => {
  Logger.info('Redirecting to captive portal.')
  res.redirect(302, '/#/captiveportal')
})

export default router
