import { ActionType, TestCase, TestGroup } from './test'
import { Action, Operation } from './action'

export type TestState = 'toTest' | 'passed' | 'failed'

export interface GroupExecution extends TestGroup {
  // id: string
  // type: 'case' | 'group'
  // name: string
  // desc?: string
  beforeActions: ActionExecution[]
  beforeEachActions: ActionExecution[]
  children: (CaseExecution | GroupExecution)[]
  afterEachActions: ActionExecution[]
  afterActions: ActionExecution[]
}

export interface CaseExecution extends TestCase {
  // id: string
  // type: 'case' | 'group'
  // name: string
  // desc?: string
  beforeEachActions: ActionExecution[]
  action: ActionExecution
  afterEachActions: ActionExecution[]
}

export interface ActionExecution extends Action {
  // id: string
  // desc?: string
  nodeId: string
  nodeName: string
  nodeDesc?: string
  type: ActionType
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
