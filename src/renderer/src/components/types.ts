export interface Test {
  id: string
  type: 'case' | 'group'
  name: string
  desc?: string
}
export type StepId = '' | 'before' | 'beforeEach' | 'after' | 'afterEach' | 'children'
export interface Action {
  id: string
  desc?: string
  operations: Operation[]
}
export interface Operation {
  id: string
  type: string
  params: any
}
export interface TestGroup extends Test {
  before?: Action
  beforeEach?: Action
  after?: Action
  afterEach?: Action
  children: Test[]
}
export interface TestCase extends Test {
  action: Action
}

export interface TestNode {
  id: string
  type: 'case' | 'group'
  name: string
  desc?: string
  paths: string[]
  children: TestNode[]
  test: TestCase | TestGroup
}
export interface GroupNode extends TestNode {
  type: 'group'
  children: TestNode[]
  test: TestGroup
}
export interface CaseNode extends TestNode {
  type: 'case'
  test: TestCase
}

export interface Project extends TestGroup {
  id: '-'
  name: string
  desc?: string
  config: {
    presetLocators: {
      key: string
      label: string
      locator: string
    }[]
  }
  children: (TestCase | TestGroup)[]
}

export interface Dimension {
  width: number
  height: number
}
