import crypto from 'node:crypto'
import type { FlowDataExchangeResult } from '../types/flow-data-exchange-result.ts'

export function encryptResponse (
  response: FlowDataExchangeResult,
  aesKeyBuffer: Buffer,
  initialVectorBuffer: Buffer
): string {
  // flip initial vector
  const flipped_iv = []
  for (const pair of initialVectorBuffer.entries()) {
    flipped_iv.push(~pair[1])
  }

  // encrypt response data
  const cipher = crypto.createCipheriv(
    'aes-128-gcm',
    aesKeyBuffer,
    Buffer.from(flipped_iv)
  )

  const result = Buffer.concat([
    cipher.update(JSON.stringify(response), 'utf-8'),
    cipher.final(),
    cipher.getAuthTag(),
  ]).toString('base64')

  return result
}
