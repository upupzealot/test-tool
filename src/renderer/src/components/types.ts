export interface Test {
  id: string
  type: 'case' | 'group'
  name: string
  desc?: string
}

export interface TestGroup extends Test {
  children: Test[]
}

export interface TestCase extends Test {}

export interface TestNode {
  id: string
  paths: string[]
  test: TestCase | TestGroup
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
