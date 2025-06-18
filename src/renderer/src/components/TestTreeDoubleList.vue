<template>
  <div style="display: flex; flex-direction: row">
    <div style="flex: 1">
      <TestTreeList
        mode="path"
        :currentNode="currentNode1"
        :currentGroup="currentGroup1"
        :getNode="getNode"
        @selectNode="onSelectNode1"
        @enterGroup="onEnterGroup"
        @createNode="onCreateNode"
      />
    </div>
    <div style="flex: 1; margin-left: -1px">
      <TestTreeList
        v-if="currentGroup2"
        mode="last"
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
    mode: {
      type: String as PropType<'path' | 'last'>,
      defaultValue: 'path'
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
