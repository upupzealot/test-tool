<template>
  <div style="width: 240px">
    <TestTreeList
      :currentNode="currentNode"
      :currentGroup="currentGroupNode"
      :pathNodes="currentPaths"
      @selectNode="onSelectNode"
      @enterGroup="onEnterGroup"
      @createNode="onCreateNode"
    />
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia'
import { useProjectStore } from '../store'

import { Test } from './types'
import TestTreeList from './TestTreeList.vue'

export default {
  components: {
    TestTreeList
  },
  data() {
    const projectStore = useProjectStore()

    return {
      projectStore
    }
  },
  computed: {
    ...mapState(useProjectStore, ['currentGroupNode', 'currentPaths', 'currentNode'])
  },
  methods: {
    ...mapActions(useProjectStore, ['getNode', 'setCurrentNodeId', 'setCurrentGroupId']),
    async onSelectNode(testId: string) {
      this.setCurrentNodeId(testId)
    },
    async onEnterGroup(testId: string) {
      const { test } = this.getNode(testId)
      if (test.type === 'group') {
        this.setCurrentGroupId(testId)
      }
    },
    async onCreateNode(parentId: string, testObj: Test) {
      this.projectStore.createNode(parentId, testObj)
    }
  }
}
</script>
