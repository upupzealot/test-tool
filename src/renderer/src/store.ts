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
      currentGroupId: '-'
    }) as {
      filePath: string
      project: Project
      testNodeMap: Map<string, TestNode<Test>>
      currentNodeId: string
      currentGroupId: string
    },
  getters: {
    currentNode(): TestNode<Test> | null {
      if (this.currentNodeId) {
        return this.testNodeMap[this.currentNodeId]
      } else {
        return null
      }
    },
    currentGroupNode(): TestNode<TestGroup> {
      return this.testNodeMap[this.currentGroupId || '-']
    },
    currentPaths(): TestNode<TestGroup>[] {
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
      const testNodeMap = {} as Map<string, TestNode<Test>>
      testNodeMap['-'] = {
        id: '-',
        paths: ['-'],
        test: {
          id: '-',
          type: 'group',
          name: '-',
          children: this.project.children
        } as Test
      } as TestNode<Test>
      let arr: TestNode<Test>[] = this.project.children.map((test) => ({
        id: test.id,
        paths: ['-', test.id],
        test
      }))
      while (arr.length) {
        const testNode = arr.shift()!
        testNodeMap[testNode.id] = testNode

        if (testNode.test.type === 'group') {
          console.log(11111, testNode)
          arr = arr.concat(
            (testNode as TestNode<TestGroup>).test.children.map((childTest) => ({
              id: childTest.id,
              paths: [...testNode.paths, childTest.id],
              test: childTest
            }))
          )
        }
      }
      this.testNodeMap = testNodeMap
    },
    setCurrentNodeId(testId: string) {
      this.currentNodeId = testId
    },
    setCurrentGroupId(testId: string) {
      this.currentNodeId = ''
      this.currentGroupId = testId
    },
    createNode(parentId: string, testObj: { name: string; type: 'group' | 'case'; desc?: string }) {
      const parentNode = this.testNodeMap[parentId] as TestNode<TestGroup>
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
      } as TestNode<Test>
      this.testNodeMap[testNode.id] = testNode

      parentNode.test.children.push(test)
      this.updateTestTree()
    }
  }
})
