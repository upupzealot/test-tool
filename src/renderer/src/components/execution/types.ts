import { Action, Operation } from '../types'

export type TestState = 'toTest' | 'passed' | 'failed'

export interface ActionExecution extends Action {
  id: string
  desc?: string
  operations: OperationExecution[]
  currentOperationId: string
  pass: boolean
  time: number
}

export interface OperationExecution extends Operation {
  // id: string
  // type: string
  // params: any
  config: any
  pass: boolean
  message?: string
  time: number
}
