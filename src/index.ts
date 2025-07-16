import express from 'express'

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

const app = express()

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'Healthy' })
})

app.listen(port, (err) => {
  if (err) {
    console.error(`Error starting server: ${err.message}`)
  } else {
    console.log(`Server is running on http://localhost:${port}`)
  }
})
