export const DEFAULT_SETTINGS: TestSettings = {
  windows: {},
  windowsOrder: [],
  delay: 0,
  retry: 1,
  timeout: 10 * 1000
}

export interface TestWindow {
  id: string
  name: string
  mode: 'mobile' | 'desktop'
}

export interface TestSettings {
  windows?: { [key: string]: TestWindow }
  windowsOrder?: string[]
  delay?: number
  retry?: number
  timeout?: number
}
