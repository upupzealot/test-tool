import { Conf } from 'electron-conf/renderer'
const conf = new Conf()

import { defineStore } from 'pinia'
import { Project, Test, TestNode } from './components/types'

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
      currentGroupId: '-'
    }) as {
      filePath: string
      project: Project
      testNodeMap: Map<string, TestNode>
      currentNodeId: string
      currentGroupId: string
    },
  getters: {
    currentNode(): TestNode | null {
      if (this.currentNodeId) {
        return this.testNodeMap[this.currentNodeId]
      } else {
        return null
      }
    },
    currentGroup(): TestNode {
      return this.testNodeMap[this.currentGroupId || '-']
    },
    currentPaths(): TestNode[] {
      return this.currentGroup.paths.map((path) => this.testNodeMap[path])
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
      let arr: TestNode[] = this.project.tests.map((test) => ({
        id: test.id,
        paths: ['-', test.id],
        test
      }))
      testNodeMap['-'] = {
        id: '-',
        paths: ['-'],
        test: {
          id: '-',
          type: 'group',
          name: '-',
          children: this.project.tests
        } as Test
      } as TestNode
      while (arr.length) {
        const testNode = arr.shift()!
        testNodeMap[testNode.id] = testNode
        arr = arr.concat(
          testNode.test.children.map((childTest) => ({
            id: childTest.id,
            paths: [...testNode.paths, childTest.id],
            test: childTest
          }))
        )
      }
      this.testNodeMap = testNodeMap
    },
    setCurrentNodeId(testId: string) {
      this.currentNodeId = testId
    },
    setCurrentGroupId(testId: string) {
      this.currentNodeId = ''
      this.currentGroupId = testId
    }
  }
})
