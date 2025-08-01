export interface Action {
  id: string
  desc?: string
  operations: Operation[]
}
export interface Operation {
  winId?: string
  id: string
  type: string
  params: any
}
