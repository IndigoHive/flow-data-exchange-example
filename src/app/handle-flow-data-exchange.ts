import type { FlowDataExchangeCommand } from '../types/flow-data-exchange-command.ts'
import type { FlowDataExchangeResult } from '../types/flow-data-exchange-result.ts'

export function handleFlowDataExchange (body: FlowDataExchangeCommand): FlowDataExchangeResult | null {
  switch (body.action) {
    case 'ping':
      return {
        data: {
          status: 'active'
        }
      }
    case 'INIT':
      if (body.data.error) {
        console.error('Error in INIT action:', body.data)

        return {
          data: {
            acknowledged: true
          }
        }
      } else {
        // TODO: Handle INIT action
        return null
      }
    case 'BACK':
      // TODO: Handle BACK action
      return null
    case 'data_exchange':
      if (body.data.error) {
        console.error('Error in data_exchange action:', body.data)

        return {
          data: {
            acknowledged: true
          }
        }
      } else {
        // TODO: handle data_exchange action
        return null
      }
  }
}
