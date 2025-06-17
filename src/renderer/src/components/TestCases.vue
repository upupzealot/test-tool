<template>
  <div style="width: 240px">
    <!-- Header -->
    <div class="test-header">
      <div>测试组</div>
      <a-button
        type="link"
        class="create-btn"
        @click="createTest"
      >
        <PlusOutlined />
      </a-button>
      <a-modal
        v-model:open="createModalVisible"
        title="新建用例（组）"
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
      v-model="project.tests"
    >
      <div
        class="test-item"
        v-for="test in project.tests"
      >
        <!-- <div class="handler"><HolderOutlined /></div> -->
        <div class="content">
          <div class="title"><FolderOutlined /> {{ test.name }}</div>
          <div class="desc">{{ test.desc }}</div>
        </div>
      </div>
    </VueDraggable>
  </div>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import { useProjectStore } from '../store'
import { VueDraggable } from 'vue-draggable-plus'
import { PlusOutlined, FolderOutlined } from '@ant-design/icons-vue'

import TestForm from './TestForm.vue'
import { Test } from './types'

export default {
  components: { VueDraggable, PlusOutlined, FolderOutlined, TestForm },
  data() {
    return {
      createModalVisible: false,
      testForm: {
        name: '',
        desc: '',
        children: []
      } as Test
    }
  },
  computed: {
    ...mapState(useProjectStore, ['project'])
  },
  methods: {
    async createTest() {
      // @ts-ignore-next-line
      this.testForm = { name: '' }
      this.createModalVisible = true
    },
    async onCancel() {
      this.createModalVisible = false
    },
    async onSubmit() {
      const testForm = this.$refs['testForm'] as typeof TestForm
      try {
        const testObj = await testForm.validate()
        if (testObj) {
          this.project.tests.push(testObj)
          this.createModalVisible = false
        }
      } catch (err) {}
    }
  }
}
</script>

<style lang="css" scoped>
/* .test-list {
  width: 200px;
} */
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
