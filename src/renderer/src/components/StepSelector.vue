<template>
  <a-space
    v-if="test.type === 'group'"
    direction="vertical"
    class="step-selector"
  >
    <div class="step">
      <a-tag
        :bordered="false"
        color="orange"
      >
        <PlaySquareFilled /> 开始
      </a-tag>
      <a-typography-text
        type="secondary"
        class="desc"
      >
        进入测试组时执行
      </a-typography-text>
    </div>
    <div class="step push">
      <a-tag
        :bordered="false"
        color="orange"
      >
        <RightSquareFilled /> 每次开始
      </a-tag>
      <a-typography-text
        type="secondary"
        class="desc"
      >
        每个用例开始前执行
      </a-typography-text>
    </div>
    <div class="step push">
      <a-tag
        :bordered="false"
        color="green"
      >
        <CodeFilled /> 测试用例
      </a-tag>
      <a-typography-text
        type="secondary"
        class="desc"
      >
        子测试组：N 个
        <br />
        测试用例：M 个
      </a-typography-text>
    </div>
    <div class="step push">
      <a-tag
        :bordered="false"
        color="orange"
      >
        <LeftSquareFilled /> 每次结束
      </a-tag>
      <a-typography-text
        type="secondary"
        class="desc"
      >
        每个用例结束后执行
      </a-typography-text>
    </div>
    <div class="step">
      <a-tag
        :bordered="false"
        color="orange"
      >
        <PlaySquareFilled style="transform: scale(-1, 1)" />
        结束
      </a-tag>
      <a-typography-text
        type="secondary"
        class="desc"
      >
        测试组执行结束后执行
      </a-typography-text>
    </div>
  </a-space>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {
  CodeFilled,
  FolderOutlined,
  LeftSquareFilled,
  PlaySquareFilled,
  RightSquareFilled
} from '@ant-design/icons-vue'

import { TestNode } from './types'
import ActionEditor from './ActionEditor.vue'

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
    node: {
      type: Object as PropType<TestNode>,
      required: true
    }
  },
  computed: {
    test() {
      return this.node.test
    }
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
}
</style>
