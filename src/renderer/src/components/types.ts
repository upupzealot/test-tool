export type Test = {
  id: string
  type: 'case' | 'group'
  name: string
  desc?: string
  children: Test[]
}

export type TestNode = {
  id: string
  paths: string[]
  test: Test
}

export type Project = {
  name: string
  desc?: string
  tests: Test[]
}
