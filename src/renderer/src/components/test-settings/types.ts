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
