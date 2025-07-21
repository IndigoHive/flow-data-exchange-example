export class FlowEndpointException extends Error {
  readonly statusCode: number

  constructor (statusCode: number, message: string) {
    super(message)

    this.name = this.constructor.name
    this.statusCode = statusCode 
  }
}
