<template>
  <!-- <div style="width: 240px">
    <TestTreeList
      mode="path"
      :currentNode="currentNode"
      :currentGroup="currentGroupNode"
      :getNode="getNode"
      @selectNode="onSelectNode"
      @enterGroup="onEnterGroup"
      @createNode="onCreateNode"
    />
  </div> -->

  <div style="width: 480px">
    <TestTreeDoubleList
      :currentNode="currentNode"
      :currentGroup="currentGroupNode"
      :getNode="getNode"
      @selectNode="onSelectNode"
      @enterGroup="onEnterGroup"
      @createNode="onCreateNode"
    />
  </div>

  <div>currentNode: {{ currentNode?.test.name }}</div>
  <div>currentGroup:{{ currentGroupNode?.test.name }}</div>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia'
import { useProjectStore } from '../store'

import { Test } from './types'
import TestTreeList from './TestTreeList.vue'
import TestTreeDoubleList from './TestTreeDoubleList.vue'

export default {
  components: {
    TestTreeList,
    TestTreeDoubleList
  },
  computed: {
    ...mapState(useProjectStore, ['currentGroupNode', 'currentPaths', 'currentNode'])
  },
  methods: {
    ...mapActions(useProjectStore, [
      'getNode',
      'setCurrentNodeId',
      'setCurrentGroupId',
      'createNode'
    ]),
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
      this.createNode(parentId, testObj)
    }
  }
}
</script>
