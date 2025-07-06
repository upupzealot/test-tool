import { Action, Operation, TestCase } from '../types'

export type TestState = 'toTest' | 'passed' | 'failed'

export interface CaseExecution extends TestCase {
  // id: string
  // type: 'case' | 'group'
  // name: string
  // desc?: string
  beforeActions: ActionExecution[]
  beforeEachActions: ActionExecution[]
  action: ActionExecution
  afterEachActions: ActionExecution[]
  afterActions: ActionExecution[]
}

export interface ActionExecution extends Action {
  // id: string
  // desc?: string
  operations: OperationExecution[]
  currentOperationId: string
  pass: boolean
  time: number
  executed: boolean
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
