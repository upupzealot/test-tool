<template>
  <a-space
    v-if="test.type === 'group'"
    direction="vertical"
    class="action-selector"
  >
    <div
      v-for="action in actions"
      :class="[
        'action',
        action.push ? 'push' : '',
        action.key === currentActionType ? 'active' : ''
      ]"
      @click="setCurrentActionType(action.key)"
    >
      <a-tag
        :bordered="false"
        :color="action.key === 'children' ? 'green' : 'orange'"
      >
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
  </a-space>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useStateStore } from '@renderer/store/state'

import {
  CodeFilled,
  FolderOutlined,
  LeftSquareFilled,
  PlaySquareFilled,
  RightSquareFilled
} from '@ant-design/icons-vue'

import { ActionType, GroupNode } from './types'
import ActionEditor from './action/ActionEditor.vue'
import { mapActions, mapState } from 'pinia'

export default defineComponent({
  components: {
    CodeFilled,
    FolderOutlined,
    LeftSquareFilled,
    PlaySquareFilled,
    RightSquareFilled,
    ActionEditor
  },
  props: {
    group: {
      type: Object as PropType<GroupNode>,
      required: true
    }
  },
  data() {
    return {
      actions: [
        {
          key: 'before',
          name: '开始',
          desc: '进入测试组时执行'
        },
        {
          key: 'beforeEach',
          push: true,
          name: '每次开始',
          desc: '每个用例开始前执行'
        },
        {
          key: 'children',
          push: true,
          name: '子测试组和测试用例',
          desc: '子测试组：N 个\n测试用例：M 个'
        },
        {
          key: 'afterEach',
          push: true,
          name: '每次结束',
          desc: '每个用例结束后执行'
        },
        {
          key: 'after',
          name: '结束',
          desc: '测试组执行结束后执行'
        }
      ] as {
        key: ActionType
        push?: boolean
        name: string
        desc: string
      }[]
    }
  },
  computed: {
    ...mapState(useStateStore, ['currentActionType']),
    test() {
      return this.group.test
    }
  },
  methods: {
    ...mapActions(useStateStore, ['setCurrentActionType'])
  }
})
</script>

<style lang="css" scoped>
.action-selector {
  min-width: 200px;
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
