<template>
  <div class="tree-header">
    <div>
      <a-breadcrumb>
        <a-breadcrumb-item v-for="pathNode in pathNodes">
          <a @click="$emit('enterGroup', pathNode.id)">
            <HomeOutlined v-if="pathNode.id === '-'" />
            <span v-else>{{ pathNode.name }}</span>
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
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {
  HomeOutlined,
  PlusOutlined,
  FolderOutlined,
  CodeOutlined
} from '@ant-design/icons-vue'

import TestForm from './TestForm.vue'
import { Test, TestNode, GroupNode } from './types'

export default defineComponent({
  components: {
    HomeOutlined,
    PlusOutlined,
    FolderOutlined,
    CodeOutlined,
    TestForm
  },
  props: {
    currentGroup: {
      type: Object as PropType<GroupNode>,
      required: true
    },
    getNode: {
      type: Function as PropType<(string) => TestNode>,
      required: true
    }
  },
  emits: ['enterGroup', 'createNode'],
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
  computed: {
    pathNodes() {
      return this.currentGroup.paths.map(this.getNode)
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
.tree-header {
  border: #eee 1px solid;
  padding: 5px 0px 5px 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
