import { system } from 'src/api/systemRequests'

// Fetch internet status
system.checkInternetConnection().catch(function (error) {
  console.error('Failed fetching internet status.')
  console.error(error)
})
