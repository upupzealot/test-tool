type OperationOption = {
  key: string
  label: string
  color: string
}

const OperationOptions = [
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
    key: 'assert',
    label: '断言',
    color: 'red'
  }
] as OperationOption[]
export default OperationOptions

export const OperationOptionMap: {
  [key: string]: OperationOption
} = {}
OperationOptions.forEach((option) => {
  OperationOptionMap[option.key] = option
})
