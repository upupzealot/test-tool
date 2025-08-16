<template>
  <div
    v-if="showCurrentGroup"
    :class="currentGroup.id === currentNode?.id ? ['tree-item', 'active'] : ['tree-item']"
  >
    <div
      class="content"
      @click="$emit('selectNode', currentGroup.id)"
      @dblclick="$emit('enterGroup', currentGroup.id)"
    >
      <template v-if="currentGroup.id === '-'">
        <div class="title"><HomeOutlined /> {{ currentGroup.name }}</div>
        <div class="desc">{{ currentGroup.desc }}</div>
      </template>
      <template v-else>
        <div class="title">
          <FolderOpenOutlined />
          {{ currentGroup.name }}
        </div>
        <div class="desc">
          {{ currentGroup.desc }}
        </div>
      </template>
    </div>
  </div>
  <VueDraggable
    :class="showCurrentGroup ? ['test-list'] : []"
    :disabled="!sortable"
    v-model="currentGroup.children"
    @update="$emit('sorted', currentGroup.children)"
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
import {
  HomeOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  CodeOutlined
} from '@ant-design/icons-vue'

import { GroupNode, TestNode } from '@common/types/test'

export default defineComponent({
  components: {
    VueDraggable,
    HomeOutlined,
    FolderOutlined,
    FolderOpenOutlined,
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
    },
    showCurrentGroup: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false
    },
    sortable: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false
    }
  },
  emits: ['sorted', 'selectNode', 'enterGroup']
})
</script>

<style lang="css" scoped>
.test-list {
  margin-top: -1px;
}
.test-list .tree-item {
  padding-left: 30px;
}
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
