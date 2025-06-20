export interface Test {
  id: string
  type: 'case' | 'group'
  name: string
  desc?: string
}
export interface TestGroup extends Test {
  before?: any
  beforeEach?: any
  after?: any
  afterEach?: any
  children: Test[]
}
export interface TestCase extends Test {
  actions: any[]
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
  children: (TestCase | TestGroup)[]
}

export interface Dimension {
  width: number
  height: number
}
