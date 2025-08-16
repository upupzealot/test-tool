<template>
  <div class="detail-content">
    <!-- 步骤选择器 -->
    <div class="action-selector-container">
      <ActionSelector :node="node" />
    </div>

    <!-- 动作编辑器 -->
    <div class="action-editor-container">
      <!-- 测试设置 -->
      <TestSettings
        v-if="currentActionType === 'settings'"
        :currentNode="node"
        :parentSettings="parentSettings"
        :settings="settings"
      />

      <!-- 子节点列表 -->
      <TestTreeList
        v-if="node.type === 'group' && currentActionType === 'children'"
        :currentNode="childNode"
        :currentGroup="groupNode"
        @selectNode="onSelectNode"
        @enterGroup="onEnterGroup"
      />

      <!-- 动作编辑器 -->
      <ActionEditor
        v-if="
          currentActionType &&
          currentActionType !== 'settings' &&
          currentActionType !== 'children'
        "
        :contextWindows="windows"
        :action="action"
        @addOperation="onAddOperation"
      />
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { defineComponent, PropType } from 'vue'
import { mapActions, mapState } from 'pinia'
import { useStateStore } from '@renderer/store/state'
import {
  CodeFilled,
  LeftSquareFilled,
  PlaySquareFilled,
  RightSquareFilled
} from '@ant-design/icons-vue'

import { TestCase, TestGroup, TestNode, CaseNode, GroupNode } from '@common/types/test'
import { Action, Operation } from '@common/types/action'
import { DEFAULT_SETTINGS, TestSettings } from '@common/types/test-settings'

import ActionSelector from './ActionSelector.vue'
import ActionHeader from './TestNodeHeader.vue'
import TestTreeList from './TestTreeList.vue'
import TestSettingsComponent from '../test-settings/TestSettings.vue'
import ActionEditor from '../action/ActionEditor.vue'

import ShortUniqueId from 'short-unique-id'
const uid = new ShortUniqueId({ length: 10 })

export default defineComponent({
  components: {
    CodeFilled,
    LeftSquareFilled,
    PlaySquareFilled,
    RightSquareFilled,
    ActionSelector,
    ActionHeader,
    TestSettings: TestSettingsComponent,
    TestTreeList,
    ActionEditor
  },
  props: {
    node: {
      type: Object as PropType<TestNode>,
      required: true
    }
  },
  data() {
    return {
      childNode: null
    } as {
      childNode: TestNode | null
    }
  },
  computed: {
    ...mapState(useStateStore, ['currentActionType']),
    groupNode(): GroupNode {
      return this.node as GroupNode
    },
    action() {
      const { type, test } = this.node
      const actionType = this.currentActionType
      if (type === 'group') {
        if (actionType && actionType !== 'settings' && actionType !== 'children') {
          return (test as TestGroup)[actionType]
        } else {
          return null
        }
      } else {
        // type === 'case'
        return (test as TestCase).action
      }
    },
    parentSettings(): TestSettings {
      const parentPaths = [...this.node.paths]
      parentPaths.pop()
      const pathSettings = parentPaths.map((path) => {
        const pathNode = this.getNode(path)
        return pathNode.test.settings || {}
      })
      return _.merge({}, ...[DEFAULT_SETTINGS, ...pathSettings])
    },
    settings(): TestSettings {
      if (!this.node.test.settings) {
        this.node.test.settings = {}
      }
      return this.node.test.settings
    },
    windows() {
      return _.merge({}, this.parentSettings.windows, this.settings.windows)
    }
  },
  methods: {
    ...mapActions(useStateStore, ['getNode', 'setCurrentGroupId', 'updateTestTree']),
    async onSelectNode(nodeId: string) {
      this.childNode = this.getNode(nodeId)
    },
    async onEnterGroup(groupNodeId: string) {
      const group = this.getNode(groupNodeId)
      if (group.type === 'group') {
        this.setCurrentGroupId(groupNodeId)
      }
    },
    onAddOperation(operation: Operation) {
      const { type } = this.node
      let action = this.action
      const actionType = this.currentActionType
      if (!action) {
        if (type === 'group') {
          const group = this.node as GroupNode
          action = {
            id: uid.rnd()
          } as Action
          group.test[actionType] = action
        } else {
          // type === 'case'
          const kase = this.node as CaseNode
          action = {
            id: uid.rnd()
          } as Action
          kase.test['action'] = action
        }
      }
      if (!action.operations) {
        action.operations = []
      }

      action.operations.push(operation)
    }
  }
})
</script>

<style lang="css" scoped>
.detail-content {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.action-selector-container {
  flex: 0;
  border: #eee 1px solid;
  padding: 10px 15px;

  display: flex;
  flex-direction: column;
}
.action-editor-container {
  flex: 1;
  margin-left: -1px;
}
</style>
