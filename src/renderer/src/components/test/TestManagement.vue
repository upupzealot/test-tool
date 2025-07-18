<template>
  <div class="test-management">
    <div class="header">
      <TestTreeHeader
        :currentGroup="currentGroupNode"
        :getNode="getNode"
        @enterGroup="onEnterGroup"
        @createNode="onCreateNode"
      />
    </div>
    <div class="body">
      <div class="side-tree">
        <div style="width: 200px">
          <TestTreeList
            :currentNode="currentNode"
            :currentGroup="currentGroupNode"
            :showCurrentGroup="true"
            :sortable="true"
            @sorted="onSorted"
            @selectNode="onSelectNode"
            @enterGroup="onEnterGroup"
          />
        </div>
      </div>
      <div
        class="test-node"
        v-if="currentNode && currentNode.id !== '-'"
      >
        <TestNodeHeader
          v-if="currentNode"
          :node="currentNode!"
          :actionType="currentActionType"
          style="margin-left: -1px"
        />
        <TestNodeBody
          :node="currentNode"
          style="margin-left: -1px"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia'
import { useProjectStore } from '../../store/project'
import { useStateStore } from '../../store/state'

import { Test } from '../types'
import TestNodeHeader from './TestNodeHeader.vue'
import TestNodeBody from './TestNodeBody.vue'
import TestTreeHeader from './TestTreeHeader.vue'
import TestTreeList from './TestTreeList.vue'

export default {
  components: {
    TestNodeHeader,
    TestNodeBody,
    TestTreeHeader,
    TestTreeList
  },
  computed: {
    ...mapState(useProjectStore, ['project']),
    ...mapState(useStateStore, ['currentGroupNode', 'currentNode', 'currentActionType'])
  },
  methods: {
    ...mapActions(useStateStore, [
      'getNode',
      'setCurrentNodeId',
      'setCurrentGroupId',
      'createNode',
      'updateTestTree'
    ]),
    async onSorted(children) {
      const ids = children.map((test) => test.id)
      this.currentGroupNode.test.children.sort((t1, t2) => {
        return ids.indexOf(t1.id) - ids.indexOf(t2.id)
      })
      this.updateTestTree(this.project)
    },
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
      this.updateTestTree(this.project)
    }
  }
}
</script>
<style lang="css" scoped>
.test-management {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.test-management .header {
  flex: 0;
}
.test-management .body {
  flex: 1;
  display: flex;
  flex-direction: row;
  margin-top: -1px;
}

.test-management .side-tree {
  flex: 0;
  width: 200px;
}
.test-management .test-node {
  flex: 1;
}
</style>
