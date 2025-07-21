export type FlowDataExchangePing = {
  version: '3.0'
  action: 'ping'
}

export type FlowDataExchangeInit = {
  version: '3.0'
  action: 'INIT'
  data: Record<string, any>
  flow_token: string
}

export type FlowDataExchangeBack = {
  version: '3.0'
  action: 'BACK'
  flow_token: string
}

export type FlowDataExchangeDataExchange = {
  version: '3.0'
  action: 'data_exchange'
  screen: string
  data: Record<string, any>
  flow_token: string
}

export type FlowDataExchangeError = {
  version: '3.0'
  action: 'INIT' | 'data_exchange'
  data: {
    error: string
    error_message: string
  }
  flow_token: string
}

export type FlowDataExchangeCommand =
  | FlowDataExchangePing
  | FlowDataExchangeInit
  | FlowDataExchangeBack
  | FlowDataExchangeDataExchange
  | FlowDataExchangeError
