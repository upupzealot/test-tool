import { Conf } from 'electron-conf/renderer'
const conf = new Conf()

import { toRaw } from 'vue'
import { defineStore } from 'pinia'
import {
  Dimension,
  GroupNode,
  Project,
  StepId,
  Test,
  TestGroup,
  TestNode
} from './components/types'

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
      currentStepId: '',

      // settings
      browserType: 'chromium',
      browserPathMap: {
        chromium: '',
        chrome: ''
      },
      browserBorder: {
        chromium: null,
        chrome: null
      }
    }) as {
      filePath: string
      project: Project
      testNodeMap: Map<string, TestNode>
      currentNodeId: string
      currentGroupId: string
      currentStepId: StepId
      browserType: 'chromium' | 'chrome'
      browserPathMap: {
        chromium: string
        chrome: string
      }
      browserBorder: {
        chromium: null | Dimension
        chrome: null | Dimension
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
    currentGroupNode(): GroupNode {
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
    async saveProject() {
      const { ipcRenderer } = window.electron
      const projectObj = JSON.parse(JSON.stringify(this.project))
      await ipcRenderer.invoke('update-project-file', this.filePath, projectObj)
    },
    updateTestTree() {
      const testNodeMap = {} as Map<string, TestNode>
      const rootNode = {
        id: '-',
        type: 'group',
        name: '-',
        paths: ['-'],
        children: [],
        test: {
          id: '-',
          type: 'group',
          name: '-',
          children: this.project.children
        } as Test
      } as TestGroup
      let arr = [rootNode] as TestNode[]
      while (arr.length) {
        const testNode = arr.shift()!
        testNodeMap[testNode.id] = testNode

        if (testNode.type === 'group') {
          const childrenNodes = (testNode.test as TestGroup).children.map(
            (childTest) =>
              ({
                id: childTest.id,
                name: childTest.name,
                desc: childTest.desc,
                type: childTest.type,
                paths: [...testNode.paths, childTest.id],
                test: childTest
              }) as TestNode
          )
          testNode.children = childrenNodes
          arr = arr.concat(childrenNodes)
        }
      }
      this.testNodeMap = testNodeMap
    },
    getNode(id: string): TestNode {
      return this.testNodeMap[id]
    },
    setCurrentNodeId(nodeId: string) {
      if (nodeId !== this.currentNodeId) {
        this.currentNodeId = nodeId
        this.currentStepId = ''
      }
    },
    setCurrentGroupId(groupNodeId: string) {
      const groupNode = this.testNodeMap[groupNodeId] as TestNode
      if (groupNode.type === 'group' && groupNodeId !== this.currentGroupId) {
        this.currentNodeId = ''
        this.currentGroupId = groupNodeId
        this.currentStepId = ''
      }
    },
    async setCurrentStepId(stepId: StepId) {
      this.currentStepId = stepId
    },
    createNode(
      parentId: string,
      testObj: { name: string; type: 'group' | 'case'; desc?: string }
    ) {
      const parentNode = this.testNodeMap[parentId] as TestNode
      if (!parentNode) {
        return console.error('父节点不存在')
      }
      if (parentNode.type !== 'group') {
        return console.error('父节点类型不为测试组')
      }

      const test = {
        id: uid.rnd(),
        ...testObj
      } as Test
      if (test.type === 'group') {
        ;(test as TestGroup).children = []
      }
      ;(parentNode.test as TestGroup).children.push(test)

      const testNode = {
        id: test.id,
        name: test.name,
        desc: test.desc,
        paths: [...parentNode.paths, test.id],
        test
      } as TestNode
      if (testNode.type === 'group') {
        ;(testNode as GroupNode).children = []
      }
      this.testNodeMap[testNode.id] = testNode
      parentNode.children.push(testNode)

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

      const chromiumBorderStr = (await conf.get('chromiumBorder')) as string
      const chromeBorderStr = (await conf.get('chromiumBorder')) as string
      const browserBorder = {
        chromium: chromiumBorderStr ? (JSON.parse(chromiumBorderStr) as Dimension) : null,
        chrome: chromeBorderStr ? (JSON.parse(chromeBorderStr) as Dimension) : null
      }
      this.browserBorder = browserBorder
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
    },
    async setBrowserBorder(win: Dimension, viewport: Dimension) {
      const browserBorder = {
        width: win.width - viewport.width,
        height: win.height - viewport.height
      }
      this.browserBorder[this.browserType] = browserBorder

      await conf.set(`${this.browserType}Border`, JSON.stringify(browserBorder))
    }
  }
})
