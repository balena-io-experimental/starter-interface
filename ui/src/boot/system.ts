import { system } from 'src/api/SystemRequests'

// Fetch internet status
system.checkInternetConnection().catch(function (error) {
  console.log('Failed fetching internet status.')
  console.log(error)
})
