export type OperationOption = {
  key: string
  label: string
  color: string
}

const OperationOpts = [
  {
    key: 'goto',
    label: '跳转',
    color: 'orange'
  },
  {
    key: 'click',
    label: '点击',
    color: 'green'
  },
  {
    key: 'input',
    label: '输入',
    color: 'cyan'
  },
  {
    key: 'lookup',
    label: '获取',
    color: 'blue'
  },
  {
    key: 'lookup:page',
    label: '获取:页面',
    color: 'blue'
  },
  {
    key: 'wait',
    label: '等待',
    color: 'default'
  },
  {
    key: 'assert',
    label: '断言',
    color: 'red'
  }
] as OperationOption[]
export default OperationOpts

export const OperationOptMap: {
  [key: string]: OperationOption
} = {}
OperationOpts.forEach((option) => {
  OperationOptMap[option.key] = option
})
