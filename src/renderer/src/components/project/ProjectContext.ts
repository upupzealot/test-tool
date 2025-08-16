import {
  ActionType,
  Project,
  Test,
  TestCase,
  TestGroup,
  TestNode
} from '@common/types/test'
import { Action } from '@common/types/action'

export default class ProjectContext {
  project: Project
  testNodeMap: { [key: string]: TestNode }
  testMap: { [key: string]: Test }
  actionMap: {
    [key: string]: {
      testId: string
      actionType: ActionType
    }
  }

  constructor(project: Project) {
    this.project = project
    if (!project.children) {
      project.children = []
    }
    if (!project.settings) {
      project.settings = {}
    }
    const rootNode = {
      id: '-',
      type: 'group',
      name: project.name,
      // desc: project.desc,
      desc: '项目设置',
      paths: ['-'],
      children: [],
      test: {
        id: '-',
        type: 'group',
        name: '-',
        children: project.children,
        settings: project.settings
      } as Test
    } as TestGroup

    this.testNodeMap = {} as { [key: string]: TestNode }
    this.testMap = {} as { [key: string]: TestGroup | TestCase }
    this.actionMap = {} as {
      [key: string]: {
        testId: string
        actionType: ActionType
      }
    }
    let arr = [rootNode] as TestNode[]
    while (arr.length) {
      const testNode = arr.shift()!
      this.testNodeMap[testNode.id] = testNode
      this.testMap[testNode.id] = testNode.test

      if (testNode.type === 'group') {
        const group = testNode.test as TestGroup
        const childrenNodes = group.children.map(
          (childTest) =>
            ({
              id: childTest.id,
              name: childTest.name,
              desc: childTest.desc,
              type: childTest.type,
              paths: [...testNode.paths, childTest.id],
              test: childTest,
              children: [] // 后续的循环填入
            }) as TestNode
        )
        testNode.children = childrenNodes
        arr = arr.concat(childrenNodes)
        ;(['before', 'beforeEach', 'after', 'afterEach'] as ActionType[]).forEach(
          (actionType) => {
            const action = group[actionType] as Action
            if (action) {
              this.actionMap[action.id] = {
                testId: group.id,
                actionType
              }
            }
          }
        )
      } else {
        const kase = testNode.test as TestCase
        const action = kase.action
        if (action) {
          this.actionMap[action.id] = {
            testId: kase.id,
            actionType: 'action'
          }
        }
      }
    }
  }
}
