import crypto from 'node:crypto'
import { TAG_LENGTH } from '../constants.ts'
import type { FlowRequestBody } from '../types/flow-request-body.ts'
import { FlowEndpointException } from './flow-endpoint-exception.ts'

export type DecryptRequestResult = {
  decryptedBody: any
  aesKeyBuffer: Buffer
  initialVectorBuffer: Buffer
}

export function decryptRequest (
  reqBody: FlowRequestBody,
  privatePem: string,
  passphrase: string
): DecryptRequestResult {
  const { encrypted_flow_data, encrypted_aes_key, initial_vector } = reqBody

  const privateKey = crypto.createPrivateKey({ key: privatePem, passphrase })

  let decryptedAesKey = null

  try {
    decryptedAesKey = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      Buffer.from(encrypted_aes_key, 'base64')
    )
  } catch (error) {
    console.error('Error decrypting AES key:', error)

    throw new FlowEndpointException(
      421,
      'Failed to decrypt the request. Please verify your private key.'
    )
  }

  const flowDataBuffer = Buffer.from(encrypted_flow_data, 'base64')
  const initialVectorBuffer = Buffer.from(initial_vector, 'base64')

  const encryptedFlowDataBody = flowDataBuffer.subarray(0, -TAG_LENGTH)
  const encryptedFlowDataTag = flowDataBuffer.subarray(-TAG_LENGTH)

  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    decryptedAesKey,
    initialVectorBuffer
  )

  decipher.setAuthTag(encryptedFlowDataTag)

  const decryptedJSONString = Buffer.concat([
    decipher.update(encryptedFlowDataBody),
    decipher.final()
  ]).toString('utf8')

  return {
    decryptedBody: JSON.parse(decryptedJSONString),
    aesKeyBuffer: decryptedAesKey,
    initialVectorBuffer,
  }
}
