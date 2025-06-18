export interface Test {
  id: string
  type: 'case' | 'group'
  name: string
  desc?: string
}

export interface TestNode<T extends Test> {
  id: string
  paths: string[]
  test: T
}

export interface TestGroup extends Test {
  children: Test[]
}

export interface TestCase extends Test {}

export interface Project extends TestGroup {
  id: '-'
  name: string
  desc?: string
  children: Test[]
}
