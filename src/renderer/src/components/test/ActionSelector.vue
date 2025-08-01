<template>
  <a-space
    direction="vertical"
    class="action-selector"
  >
    <template v-for="action in actions">
      <div
        v-if="action.type.includes(node.type)"
        :class="[
          'action',
          action.push ? 'push' : '',
          action.key === currentActionType ? 'active' : ''
        ]"
        @click="setCurrentActionType(action.key)"
      >
        <a-tag
          :bordered="false"
          :color="action.color"
        >
          <SettingFilled v-if="action.key === 'settings'" />
          <MenuUnfoldOutlined v-if="action.key === 'operations'" />
          <PlaySquareFilled v-if="action.key === 'before'" />
          <RightSquareFilled v-if="action.key === 'beforeEach'" />
          <CodeFilled v-if="action.key === 'children'" />
          <LeftSquareFilled v-if="action.key === 'afterEach'" />
          <PlaySquareFilled
            style="transform: scale(-1, 1)"
            v-if="action.key === 'after'"
          />
          {{ action.name }}
        </a-tag>
        <a-typography-text
          type="secondary"
          class="desc"
        >
          {{ action.desc }}
        </a-typography-text>
      </div>
      <a-divider
        v-if="action.key === 'settings'"
        style="margin: 7px 0"
      />
    </template>
  </a-space>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useStateStore } from '@renderer/store/state'

import {
  SettingFilled,
  CodeFilled,
  FolderOutlined,
  MenuUnfoldOutlined,
  LeftSquareFilled,
  PlaySquareFilled,
  RightSquareFilled
} from '@ant-design/icons-vue'

import { ActionType, TestNode } from '../types'
import { mapActions, mapState } from 'pinia'

export default defineComponent({
  components: {
    SettingFilled,
    CodeFilled,
    FolderOutlined,
    MenuUnfoldOutlined,
    LeftSquareFilled,
    PlaySquareFilled,
    RightSquareFilled
  },
  props: {
    node: {
      type: Object as PropType<TestNode>,
      required: true
    }
  },
  data() {
    return {
      actions: [
        {
          key: 'settings',
          name: '设置',
          desc: '运行设置',
          color: 'purple',
          type: ['case', 'group']
        },
        {
          key: 'operations',
          name: '测试步骤',
          desc: '执行测试步骤',
          color: 'orange',
          type: ['case']
        },
        {
          key: 'before',
          name: '开始',
          desc: '进入测试组时执行',
          color: 'orange',
          type: ['group']
        },
        {
          key: 'beforeEach',
          push: true,
          name: '每次开始',
          desc: '每个用例开始前执行',
          color: 'orange',
          type: ['group']
        },
        {
          key: 'children',
          push: true,
          name: '子测试组和测试用例',
          desc: '子测试组：N 个\n测试用例：M 个',
          color: 'green',
          type: ['group']
        },
        {
          key: 'afterEach',
          push: true,
          name: '每次结束',
          desc: '每个用例结束后执行',
          color: 'orange',
          type: ['group']
        },
        {
          key: 'after',
          name: '结束',
          desc: '测试组执行结束后执行',
          color: 'orange',
          type: ['group']
        }
      ] as {
        key: ActionType
        push?: boolean
        name: string
        desc: string
        color: string
        type: string[]
      }[]
    }
  },
  computed: {
    ...mapState(useStateStore, ['currentActionType']),
    test() {
      return this.node.test
    }
  },
  methods: {
    ...mapActions(useStateStore, ['setCurrentActionType'])
  }
})
</script>

<style lang="css" scoped>
.action-selector {
  min-width: 180px;
}
.action-selector .action {
  border: #eee 1px solid;
  cursor: pointer;
}
.action-selector .action.active {
  background-color: aliceblue;
}
.action-selector .action.push {
  margin-left: 25px;
}
.action-selector .action.push2 {
  margin-left: 50px;
}
.action-selector .action .desc {
  font-size: 12px;
  display: block;
  padding: 4px 8px;
  white-space: pre-wrap;
}
</style>
