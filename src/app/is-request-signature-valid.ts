import crypto from 'node:crypto'
import type { Request } from 'express'
import { WHATSAPP_APP_SECRET } from '../constants.ts'

export function isRequestSignatureValid (req: Request): boolean {
  if (!WHATSAPP_APP_SECRET) {
    console.warn('WHATSAPP_APP_SECRET is not set. Skipping signature validation.')
    return true
  }

  if (!req.rawBody) {
    console.error('Request does not contain rawBody for signature validation.')
    return false
  }

  const signatureHeader = req.headers['x-hub-signature-256'] as string | undefined

  if (!signatureHeader) {
    console.warn('No signature header found in the request.')
    return false
  }

  const signatureBuffer = Buffer.from(signatureHeader.replace('sha256=', ''), 'utf-8')

  const hmac = crypto.createHmac("sha256", WHATSAPP_APP_SECRET)
  const digestString = hmac.update(req.rawBody).digest('hex')
  const digestBuffer = Buffer.from(digestString, "utf-8")

  if ( !crypto.timingSafeEqual(digestBuffer, signatureBuffer)) {
    console.error('Error: Request Signature did not match')
    return false
  }
  return true
}
