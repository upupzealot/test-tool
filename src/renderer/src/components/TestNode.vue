<template>
  <!-- 标题区域 -->
  <div class="container">
    <div class="title">
      <FolderOutlined />
      {{ test.name }}
    </div>
    <a-typography-text
      type="secondary"
      class="desc"
    >
      {{ test.desc }}
    </a-typography-text>
    <a-divider style="margin: 10px 0" />

    <!-- 测试组侧边栏 -->
    <div style="display: flex; flex-direction: row; padding: 5px 0">
      <a-space
        v-if="test.type === 'group'"
        direction="vertical"
        style="min-width: 200px; flex: 0"
      >
        <div class="hook">
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
        <div class="hook every">
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
        <div class="hook every">
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
        <div class="hook every">
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
        <div class="hook">
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

      <!-- 动作编辑器 -->
      <div class="action-editor-container"><ActionEditor /></div>
    </div>
  </div>
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
.container {
  border: #eee 1px solid;
  margin-left: -1px;
  padding: 10px 15px;
}

.container .title {
  font-weight: bold;
  font-size: 16px;
}
.container .desc {
  font-size: 12px;
  display: block;
  padding: 4px 8px;
}
.container .hook {
  border: #eee 1px solid;
  cursor: pointer;
}
.container .hook.every {
  margin-left: 25px;
}
.container .hook.every2 {
  margin-left: 50px;
}

.action-editor-container {
  flex: 1;
  border: #eee 1px solid;
  margin-left: -1px;
  padding: 10px 15px;
}
</style>
