<template>
  <VueDraggable
    class="test-list"
    v-model="currentGroup.children"
  >
    <div
      v-for="testNode in currentGroup.children"
      :class="testNode.id === currentNode?.id ? ['tree-item', 'active'] : ['tree-item']"
    >
      <!-- <div class="handler"><HolderOutlined /></div> -->
      <div
        class="content"
        @click="$emit('selectNode', testNode.id)"
        @dblclick="$emit('enterGroup', testNode.id)"
      >
        <div class="title">
          <FolderOutlined v-if="testNode.type === 'group'" />
          <CodeOutlined v-if="testNode.type === 'case'" />
          {{ testNode.name }}
        </div>
        <div class="desc">{{ testNode.desc }}</div>
      </div>
    </div>
  </VueDraggable>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { FolderOutlined, CodeOutlined } from '@ant-design/icons-vue'

import { TestNode, GroupNode } from './types'

export default defineComponent({
  components: {
    VueDraggable,
    FolderOutlined,
    CodeOutlined
  },
  props: {
    currentNode: {
      type: [Object, null] as PropType<TestNode | null>,
      required: true
    },
    currentGroup: {
      type: Object as PropType<GroupNode>,
      required: true
    }
  },
  emits: ['selectNode', 'enterGroup']
})
</script>

<style lang="css" scoped>
.tree-item {
  border: #eee 1px solid;
  padding: 5px 5px 5px 15px;
  cursor: pointer;

  display: flex;
  flex-direction: row;
  align-items: center;
}
.tree-item:not(:first-child) {
  margin-top: -1px;
}
.tree-item.active {
  background-color: aliceblue;
}

.tree-item .handler {
  flex: 0;
  margin: 8px;
  cursor: move;
}
.tree-item .content {
  flex: 1;
}

.tree-item .title {
  font-weight: bold;
}
.tree-item .desc {
  color: #999;
  font-size: 12px;
}
</style>
