<template>
  <div
    class="execution-item"
    @click="expand = !expand"
  >
    <span :style="{ marginLeft: `${depth * 15}px` }">
      <FolderOpenOutlined v-if="expand" />
      <FolderOutlined v-else />
      {{ group.name }}
    </span>
  </div>
  <template
    v-if="expand"
    v-for="execution in testExecutions"
  >
    <div
      v-if="execution.kase.type === 'case'"
      :class="
        executingCase?.id === execution.kase.id
          ? ['execution-item', 'selected']
          : ['execution-item']
      "
      @click="onSelectKase(execution.kase as CaseExecution)"
    >
      <span :style="{ marginLeft: `${execution.depth * 15}px` }">
        <CodeOutlined /> {{ execution.kase.name }}
      </span>
    </div>
    <ExecutionList
      v-if="execution.kase.type === 'group'"
      :group="execution.kase as GroupExecution"
      :depth="depth + 1"
    />
  </template>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { mapWritableState } from 'pinia'

import { CodeOutlined, FolderOutlined, FolderOpenOutlined } from '@ant-design/icons-vue'
import { CaseExecution, GroupExecution } from './types'
import { useExecutionStore } from '@renderer/store/execution'
import ActionExecution from './ActionExecution.vue'

export default defineComponent({
  name: 'ExecutionList',
  components: { FolderOutlined, FolderOpenOutlined, CodeOutlined, ActionExecution },
  data() {
    return {
      expand: true
    }
  },
  props: {
    group: {
      type: Object as PropType<GroupExecution>,
      required: true
    },
    depth: {
      type: Number as PropType<number>,
      required: true
    }
  },
  computed: {
    ...mapWritableState(useExecutionStore, ['executingCase']),
    testExecutions() {
      return this.group.children.map((test) => ({
        kase: test,
        depth: this.depth + 1
      }))
    }
  },
  methods: {
    onSelectKase(kase: CaseExecution) {
      this.executingCase = kase
    }
  }
})
</script>

<style lang="css" scoped>
.execution-item {
  border: #eee 1px solid;
  padding: 10px 15px;
  cursor: pointer;
}
.execution-item:not(:first-child) {
  margin-top: -1px;
}
.execution-item.selected {
  background-color: aliceblue;
}
</style>
