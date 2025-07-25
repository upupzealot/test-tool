export interface Test {
  id: string
  type: 'case' | 'group'
  name: string
  desc?: string
  settings?: TestSettings
}
export type ActionType =
  | ''
  | 'settings'
  | 'operations'
  | 'before'
  | 'beforeEach'
  | 'after'
  | 'afterEach'
  | 'children'

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
  children: (Test | TestGroup)[]
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

export interface ProjectConfig {
  presetLocators: {
    key: string
    label: string
    locator: string
  }[]
}

export const DEFAULT_SETTINGS: TestSettings = {
  delay: 0,
  retry: 1,
  timeout: 10 * 1000
}
export interface TestSettings {
  delay?: number
  retry?: number
  timeout?: number
}

export interface Project extends TestGroup {
  id: '-'
  // name: string
  // desc?: string
  // children: (TestCase | TestGroup)[]
  config: ProjectConfig
}

export interface Dimension {
  width: number
  height: number
}
