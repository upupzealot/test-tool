<template>
  <div class="collection">
    <div class="menu">
      <div style="width: 200px">
        <TestTreeList
          mode="path"
          :currentNode="currentNode"
          :currentGroup="currentGroupNode"
          :getNode="getNode"
          @selectNode="onSelectNode"
          @enterGroup="onEnterGroup"
          @createNode="onCreateNode"
        />
      </div>

      <!-- <div style="">
        <TestTreeDoubleList
          :colWidth="160"
          :currentNode="currentNode"
          :currentGroup="currentGroupNode"
          :getNode="getNode"
          @selectNode="onSelectNode"
          @enterGroup="onEnterGroup"
          @createNode="onCreateNode"
        />
      </div> -->

      <div>Node: {{ currentNode?.name }}</div>
      <div>Group: {{ currentGroupNode?.name }}</div>
      <div>Step: {{ currentStepId }}</div>
    </div>
    <div
      class="detail"
      v-if="currentNode"
    >
      <TestNode :node="currentNode" />
    </div>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia'
import { useProjectStore } from '../store'

import { Test } from './types'
import TestTreeList from './TestTreeList.vue'
import TestTreeDoubleList from './TestTreeDoubleList.vue'
import TestNode from './TestNode.vue'

export default {
  components: {
    TestTreeList,
    TestTreeDoubleList,
    TestNode
  },
  computed: {
    ...mapState(useProjectStore, [
      'currentGroupNode',
      'currentPaths',
      'currentNode',
      'currentStepId'
    ])
  },
  methods: {
    ...mapActions(useProjectStore, [
      'getNode',
      'setCurrentNodeId',
      'setCurrentGroupId',
      'createNode'
    ]),
    async onSelectNode(nodeId: string) {
      this.setCurrentNodeId(nodeId)
    },
    async onEnterGroup(groupNodeId: string) {
      const group = this.getNode(groupNodeId)
      if (group.type === 'group') {
        this.setCurrentGroupId(groupNodeId)
      }
    },
    async onCreateNode(parentId: string, testObj: Test) {
      this.createNode(parentId, testObj)
    }
  }
}
</script>
<style lang="css" scoped>
.collection {
  flex: 1;
  width: 100%;
  display: flex;
}

.collection .menu {
  flex: 0;
}

.collection .detail {
  flex: 1;
}
</style>
