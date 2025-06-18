<template>
  <!-- Header -->
  <div class="test-header">
    <div>
      <a-breadcrumb>
        <a-breadcrumb-item v-for="pathNode in pathNodes">
          <a @click="$emit('enterGroup', pathNode.test.id)">
            <HomeOutlined v-if="pathNode.id === '-'" />
            <span v-else>{{ pathNode.test.name }}</span>
          </a>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <a-button
      type="link"
      class="create-btn"
      @click="showCreateModal"
    >
      <PlusOutlined />
    </a-button>
    <a-modal
      v-model:open="createModalVisible"
      title="新建测试用例（组）"
    >
      <TestForm
        ref="testForm"
        :form="testForm"
        mode="create"
      />
      <template #footer>
        <a-button
          key="back"
          @click="onCancel"
        >
          取消
        </a-button>
        <a-button
          key="submit"
          type="primary"
          @click="onSubmit"
        >
          保存
        </a-button>
      </template>
    </a-modal>
  </div>

  <!-- Test List -->
  <VueDraggable
    class="test-list"
    v-model="(currentGroup.test as TestGroup).children"
  >
    <div
      v-for="test in (currentGroup.test as TestGroup).children"
      :class="test.id === currentNode?.id ? ['test-item', 'active'] : ['test-item']"
    >
      <!-- <div class="handler"><HolderOutlined /></div> -->
      <div
        class="content"
        @click="$emit('selectNode', test.id)"
        @dblclick="$emit('enterGroup', test.id)"
      >
        <div class="title">
          <FolderOutlined v-if="test.type === 'group'" />
          <CodeOutlined v-if="test.type === 'case'" />
          {{ test.name }}
        </div>
        <div class="desc">{{ test.desc }}</div>
      </div>
    </div>
  </VueDraggable>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import {
  HomeOutlined,
  PlusOutlined,
  FolderOutlined,
  CodeOutlined
} from '@ant-design/icons-vue'

import TestForm from './TestForm.vue'
import { Test, TestNode, TestGroup } from './types'

export default defineComponent({
  components: {
    VueDraggable,
    HomeOutlined,
    PlusOutlined,
    FolderOutlined,
    CodeOutlined,
    TestForm
  },
  props: {
    currentNode: {
      type: [Object, null] as PropType<TestNode | null>,
      required: true
    },
    currentGroup: {
      type: Object as PropType<TestNode>,
      required: true
    },
    pathNodes: {
      type: Array as PropType<Array<TestNode>>,
      required: true
    }
  },
  emits: ['selectNode', 'enterGroup', 'createNode'],
  data() {
    return {
      createModalVisible: false,
      testForm: {
        name: '',
        desc: '',
        children: []
      } as unknown as Test
    }
  },
  methods: {
    async showCreateModal() {
      // @ts-ignore-next-line
      this.testForm = { type: '', name: '', desc: '' }
      this.createModalVisible = true
    },
    async onCancel() {
      this.createModalVisible = false
    },
    async onSubmit() {
      const testForm = this.$refs['testForm'] as typeof TestForm
      try {
        const testObj = (await testForm.validate()) as Test
        if (testObj) {
          this.$emit('createNode', this.currentGroup.id, testObj)
          this.createModalVisible = false
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
})
</script>

<style lang="css" scoped>
.test-header {
  border: #eee 1px solid;
  padding: 5px 0px 5px 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
/* .test-header .create-btn {
} */
.test-item {
  border: #eee 1px solid;
  padding: 5px 5px 5px 15px;
  cursor: pointer;

  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: -1px;
}
.test-item.active {
  background-color: aliceblue;
}

.test-item .handler {
  flex: 0;
  margin: 8px;
  cursor: move;
}
.test-item .content {
  flex: 1;
}

.test-item .title {
  font-weight: bold;
}
.test-item .desc {
  color: #999;
  font-size: 12px;
}
</style>
