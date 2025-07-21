export type FlowDataExchangeNextScreen = {
  screen: string
  data: Record<string, any>
}

export type FlowDataExchangeFinalResponse = {
  screen: 'SUCCESS'
  data: {
    extension_message_response: {
      params: Record<string, any> & { flow_token: string }
    }
  }
}

export type FlowDataExchangeBadRequest = {
  screen: string
  data: {
    error_message: string
  }
}

export type FlowDataExchangeHealthCheck = {
  data: {
    status: 'active'
  }
}

export type FlowDataExchangeAckError = {
  data: {
    acknowledged: true
  }
}

export type FlowDataExchangeResult =
  | FlowDataExchangeNextScreen
  | FlowDataExchangeFinalResponse
  | FlowDataExchangeBadRequest
  | FlowDataExchangeHealthCheck
  | FlowDataExchangeAckError
