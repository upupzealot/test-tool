import { Conf } from 'electron-conf/renderer'
const conf = new Conf()

import { defineStore } from 'pinia'
import { Project, Test, TestGroup, TestNode } from './components/types'

import ShortUniqueId from 'short-unique-id'
const uid = new ShortUniqueId({ length: 10 })

export const useProjectStore = defineStore('project', {
  state: () =>
    ({
      // project file
      filePath: '',
      project: {
        name: '',
        desc: ''
      },

      // edit state
      testNodeMap: {},
      currentNodeId: '-',
      currentGroupId: '-',

      // settings
      browserType: 'chromium',
      browserPathMap: {
        chromium: '',
        chrome: ''
      }
    }) as {
      filePath: string
      project: Project
      testNodeMap: Map<string, TestNode>
      currentNodeId: string
      currentGroupId: string
      browserType: 'chromium' | 'chrome'
      browserPathMap: {
        chromium: string
        chrome: string
      }
    },
  getters: {
    currentNode(): TestNode | null {
      if (this.currentNodeId) {
        return this.testNodeMap[this.currentNodeId]
      } else {
        return null
      }
    },
    currentGroupNode(): TestNode {
      return this.testNodeMap[this.currentGroupId || '-']
    },
    currentPaths(): TestNode[] {
      return this.currentGroupNode.paths.map((path) => this.testNodeMap[path])
    }
  },
  actions: {
    async setPath(filePath: string) {
      this.filePath = filePath
      await conf.set('lastOpen', filePath)
    },
    async getPath() {
      return await conf.get('lastOpen')
    },
    setProject(project: Project) {
      this.project = project
      this.updateTestTree()
    },
    updateTestTree() {
      const testNodeMap = {} as Map<string, TestNode>
      testNodeMap['-'] = {
        id: '-',
        paths: ['-'],
        test: {
          id: '-',
          type: 'group',
          name: '-',
          children: this.project.children
        } as Test
      } as TestNode
      let arr: TestNode[] = this.project.children.map((test) => ({
        id: test.id,
        paths: ['-', test.id],
        test
      }))
      while (arr.length) {
        const testNode = arr.shift()!
        testNodeMap[testNode.id] = testNode

        if (testNode.test.type === 'group') {
          arr = arr.concat(
            (testNode.test as TestGroup).children.map((childTest) => ({
              id: childTest.id,
              paths: [...testNode.paths, childTest.id],
              test: childTest
            }))
          )
        }
      }
      this.testNodeMap = testNodeMap
    },
    getNode(id: string): TestNode {
      return this.testNodeMap[id]
    },
    setCurrentNodeId(testId: string) {
      this.currentNodeId = testId
    },
    setCurrentGroupId(testId: string) {
      const groupNode = this.testNodeMap[testId] as TestNode
      if (groupNode.test.type === 'group') {
        this.currentNodeId = ''
        this.currentGroupId = testId
      }
    },
    createNode(
      parentId: string,
      testObj: { name: string; type: 'group' | 'case'; desc?: string }
    ) {
      const parentNode = this.testNodeMap[parentId] as TestNode
      if (!parentNode) {
        return console.error('父节点不存在')
      }
      if (parentNode.test.type !== 'group') {
        return console.error('父节点类型不为测试组')
      }

      const test = {
        id: uid.rnd(),
        ...testObj
      } as Test
      if (test.type === 'group') {
        ;(test as TestGroup).children = []
      }

      const testNode = {
        id: test.id,
        paths: [...parentNode.paths, test.id],
        test
      } as TestNode
      this.testNodeMap[testNode.id] = testNode
      ;(parentNode.test as TestGroup).children.push(test)
      this.updateTestTree()
    },
    async initBrowserSelection() {
      const browserType = await conf.get('browserType')
      this.browserType = (browserType as 'chromium' | 'chrome') || 'chromium'

      const { ipcRenderer } = window.electron
      const browserPathMap = (await ipcRenderer.invoke('get-browser-paths')) as {
        chromium: string
        chrome: string
      }
      let chromiumPath = (await conf.get('chromiumPath')) as string
      let chromePath = (await conf.get('chromePath')) as string
      if (!chromiumPath) {
        chromiumPath = browserPathMap.chromium || ''
        await conf.set('chromiumPath', chromiumPath)
      }
      if (!chromePath) {
        chromePath = browserPathMap.chrome || ''
        await conf.set('chromePath', chromePath)
      }
      this.browserPathMap = {
        chromium: chromiumPath,
        chrome: chromePath
      }
    },
    async setBrowserType(type: 'chromium' | 'chrome') {
      this.browserType = type
      await conf.set('browserType', type)
    },
    async updateBrowserPathMap() {
      const { ipcRenderer } = window.electron
      const browserPathMap = await ipcRenderer.invoke('get-browser-paths')

      await conf.set('chromiumPath', browserPathMap.chromium)
      await conf.set('chromePath', browserPathMap.chrome)
      this.browserPathMap = browserPathMap
    }
  }
})
