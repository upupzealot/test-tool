<template>
  <div class="tree-row">
    <div
      class="tree-col"
      :style="{ width: `${colWidth}px` }"
    >
      <TestTreeList
        mode="path"
        :colWidth="colWidth"
        :currentNode="currentNode1"
        :currentGroup="currentGroup1"
        :getNode="getNode"
        @selectNode="onSelectNode1"
        @enterGroup="onEnterGroup"
        @createNode="onCreateNode"
      />
    </div>
    <div
      v-if="currentGroup2"
      class="tree-col"
      :style="{ width: `${colWidth}px` }"
    >
      <TestTreeList
        mode="last"
        :colWidth="colWidth"
        :currentNode="currentNode"
        :currentGroup="currentGroup2"
        :getNode="getNode"
        @selectNode="onSelectNode2"
        @enterGroup="onEnterGroup"
        @createNode="onCreateNode"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { Test, TestNode } from './types'
import TestTreeList from './TestTreeList.vue'

export default defineComponent({
  components: {
    TestTreeList
  },
  props: {
    colWidth: {
      type: Number as PropType<number>,
      defaultValue: 200
    },
    currentNode: {
      type: [Object, null] as PropType<TestNode | null>,
      required: true
    },
    currentGroup: {
      type: Object as PropType<TestNode>,
      required: true
    },
    getNode: {
      type: Function as PropType<(string) => TestNode>,
      required: true
    }
  },
  emits: ['selectNode', 'enterGroup', 'createNode'],
  data() {
    return {
      currentNode1: null,
      currentNode2: null,
      currentGroup1: this.currentGroup,
      currentGroup2: null
    } as {
      currentNode1: TestNode | null
      currentNode2: TestNode | null
      currentGroup1: TestNode
      currentGroup2: TestNode | null
    }
  },
  computed: {
    pathNodes() {
      return this.currentGroup.paths.map(this.getNode)
    }
  },
  methods: {
    async onSelectNode1(testId: string) {
      const selectedNode = this.getNode(testId)
      this.currentNode1 = selectedNode
      if (selectedNode.test.type === 'group') {
        this.currentGroup2 = selectedNode
        this.currentNode1 = selectedNode
        this.$emit('enterGroup', selectedNode.id)
      } else {
        this.currentGroup2 = null
      }
      this.$emit('selectNode', testId)
    },
    async onSelectNode2(testId: string) {
      const selectedNode = this.getNode(testId)
      this.currentNode2 = selectedNode
      this.$emit('selectNode', testId)
    },
    async onEnterGroup(testId: string) {
      const selectedNode = this.getNode(testId)
      if (selectedNode.test.type !== 'group') {
        return
      }
      this.currentNode1 = null
      this.currentGroup1 = selectedNode
      this.currentNode2 = null
      this.currentGroup2 = null
      this.$emit('enterGroup', testId)
    },
    async onCreateNode(parentId: string, testObj: Test) {
      this.$emit('createNode', parentId, testObj)
    }
  }
})
</script>

<style lang="css" scoped>
.tree-row {
  display: flex;
  flex-direction: row;
}
.tree-col {
  flex: 1;
}
.tree-col:not(:first-child) {
  margin-left: -1px;
}
</style>
