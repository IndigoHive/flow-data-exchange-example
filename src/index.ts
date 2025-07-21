import express, { type Request } from 'express'
import { decryptRequest } from './app/decrypt-request.ts'
import { encryptResponse } from './app/encrypt-response.ts'
import { FlowEndpointException } from './app/flow-endpoint-exception.ts'
import { handleFlowDataExchange } from './app/handle-flow-data-exchange.ts'
import { WHATSAPP_PASSPHRASE, WHATSAPP_PRIVATE_KEY_PEM } from './constants.ts'
import { isRequestSignatureValid } from './app/is-request-signature-valid.ts'

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

const app = express()

app.use(express.json({
  verify: (req, _res, buf, encoding) => {
    (req as Request).rawBody = buf?.toString((encoding as BufferEncoding) || 'utf8')
  }
}))

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'Healthy' })
})

app.post('/flow', (req, res) => {
  // Validate the request signature
  if (!isRequestSignatureValid(req)) {
    return res.status(432).end()
  }

  // Decrypt the request body
  let decryptedRequest = null

  try {
    decryptedRequest = decryptRequest(req.body, WHATSAPP_PRIVATE_KEY_PEM, WHATSAPP_PASSPHRASE)
  } catch (err) {
    console.error(err)

    if (err instanceof FlowEndpointException) {
      return res.status(err.statusCode).send()
    }

    return res.status(500).send()
  }

  const { aesKeyBuffer, initialVectorBuffer, decryptedBody } = decryptedRequest

  // Handle the data exchange command
  const result = handleFlowDataExchange(decryptedBody)

  // Encrypt the response body
  const encryptedResponse = encryptResponse(result!, aesKeyBuffer, initialVectorBuffer)

  res.send(encryptedResponse)
})

app.listen(port, (err) => {
  if (err) {
    console.error(`Error starting server: ${err.message}`)
  } else {
    console.log(`Server is running on http://localhost:${port}`)
  }
})
