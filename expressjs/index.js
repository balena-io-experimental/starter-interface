import axios from 'axios'
import express from 'express'
import process from 'process'

// Initiate ExpressJS
const app = express()

// Set Axios defaults
axios.defaults.timeout = 2500

// ExpressJS setup
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// Functions
function generatePath (path) {
  // Check the API key and paths as they can change during use
  const generatedPath = `${process.env.BALENA_SUPERVISOR_ADDRESS}/` +
    `${path}?apikey=${process.env.BALENA_SUPERVISOR_API_KEY}`
  return generatedPath
}

// Routes
app.post('/api', function (req, res) {
  const params = req.body.params
  const path = req.body.path
  const type = req.body.type

  // Generate the path
  const apiPath = generatePath(path)

  // Construct the payload
  const payload = {
    method: type,
    data: params,
    url: apiPath
  }

  // Sned the request
  axios(payload)
    .then((response) => {
      // Return the same http code as Axios request
      res.status(response.status)
      // Return the Axios request
      res.json(response.data)
    })
    // On error, return Axios error
    .catch(function (error) {
      if (error.response) {
        res.status(error.response.status)
      } else {
        res.status(500)
      }
      res.json(error)
    })
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})
