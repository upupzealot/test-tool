import { defineStore } from 'pinia'
import {
  GroupNode,
  Project,
  ActionType,
  Test,
  TestGroup,
  TestNode
} from '../components/types'

import ShortUniqueId from 'short-unique-id'
const uid = new ShortUniqueId({ length: 10 })

export const useStateStore = defineStore('state', {
  state: () =>
    ({
      // edit state
      activeTab: 'test-cases',
      testNodeMap: {},
      currentNodeId: '-',
      currentGroupId: '-',
      currentActionType: ''
    }) as {
      activeTab: string
      testNodeMap: Map<string, TestNode>
      currentNodeId: string
      currentGroupId: string
      currentActionType: ActionType
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
    setActiveTab(activeTab: string) {
      this.activeTab = activeTab
    },
    updateTestTree(project: Project) {
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
          children: project.children
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
        this.currentActionType = ''
      }
    },
    setCurrentGroupId(groupNodeId: string) {
      const groupNode = this.testNodeMap[groupNodeId] as TestNode
      if (groupNode.type === 'group' && groupNodeId !== this.currentGroupId) {
        this.currentNodeId = ''
        this.currentGroupId = groupNodeId
        this.currentActionType = ''
      }
    },
    async setCurrentActionType(actionType: ActionType) {
      this.currentActionType = actionType
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
    }
  }
})
