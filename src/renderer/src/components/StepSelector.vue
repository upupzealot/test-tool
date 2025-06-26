<template>
  <a-space
    v-if="test.type === 'group'"
    direction="vertical"
    class="step-selector"
  >
    <div
      v-for="step in steps"
      :class="[
        'step',
        step.push ? 'push' : '',
        step.key === currentStepId ? 'active' : ''
      ]"
      @click="setCurrentStepId(step.key)"
    >
      <a-tag
        :bordered="false"
        :color="step.key === 'children' ? 'green' : 'orange'"
      >
        <PlaySquareFilled v-if="step.key === 'before'" />
        <RightSquareFilled v-if="step.key === 'beforeEach'" />
        <CodeFilled v-if="step.key === 'children'" />
        <LeftSquareFilled v-if="step.key === 'afterEach'" />
        <PlaySquareFilled
          style="transform: scale(-1, 1)"
          v-if="step.key === 'after'"
        />
        {{ step.name }}
      </a-tag>
      <a-typography-text
        type="secondary"
        class="desc"
      >
        {{ step.desc }}
      </a-typography-text>
    </div>
  </a-space>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useProjectStore } from '@renderer/store'

import {
  CodeFilled,
  FolderOutlined,
  LeftSquareFilled,
  PlaySquareFilled,
  RightSquareFilled
} from '@ant-design/icons-vue'

import { StepId, GroupNode } from './types'
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
      steps: [
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
        key: StepId
        push?: boolean
        name: string
        desc: string
      }[]
    }
  },
  computed: {
    ...mapState(useProjectStore, ['currentStepId']),
    test() {
      return this.group.test
    }
  },
  methods: {
    ...mapActions(useProjectStore, ['setCurrentStepId'])
  }
})
</script>

<style lang="css" scoped>
.step-selector {
  min-width: 200px;
}
.step-selector .step {
  border: #eee 1px solid;
  cursor: pointer;
}
.step-selector .step.active {
  background-color: aliceblue;
}
.step-selector .step.push {
  margin-left: 25px;
}
.step-selector .step.push2 {
  margin-left: 50px;
}
.step-selector .step .desc {
  font-size: 12px;
  display: block;
  padding: 4px 8px;
  white-space: pre-wrap;
}
</style>
