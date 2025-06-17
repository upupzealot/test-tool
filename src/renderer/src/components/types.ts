export type Test = {
  type: 'case' | 'group'
  name: string
  desc?: string
  children: []
}

export type Project = {
  name: string
  desc?: string
  tests: Test[]
}
