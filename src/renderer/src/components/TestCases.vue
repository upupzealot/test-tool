<template>
  <div style="width: 240px">
    <!-- Header -->
    <div class="test-header">
      <div>
        <a-breadcrumb>
          <a-breadcrumb-item v-for="pathNode in currentPaths">
            <a @click="onEnterTestGroup(pathNode.id)">
              <HomeOutlined v-if="pathNode.id === '-'" />
              <span v-else>{{ pathNode.test.name }}</span>
            </a>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
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
      v-model="currentGroupNode.test.children"
    >
      <div
        v-for="test in currentGroupNode.test.children"
        :class="test.id === currentNode?.id ? ['test-item', 'active'] : ['test-item']"
      >
        <!-- <div class="handler"><HolderOutlined /></div> -->
        <div
          class="content"
          @click="onSelectTestNode(test.id)"
          @dblclick="onEnterTestGroup(test.id)"
        >
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
import { HomeOutlined, PlusOutlined, FolderOutlined } from '@ant-design/icons-vue'

import TestForm from './TestForm.vue'
import { Test } from './types'

export default {
  components: { VueDraggable, HomeOutlined, PlusOutlined, FolderOutlined, TestForm },
  data() {
    const projectStore = useProjectStore()

    return {
      projectStore,
      createModalVisible: false,
      testForm: {
        name: '',
        desc: '',
        children: []
      } as unknown as Test
    }
  },
  computed: {
    ...mapState(useProjectStore, ['project', 'currentGroupNode', 'currentPaths', 'currentNode'])
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
        const testObj = (await testForm.validate()) as Test
        if (testObj) {
          this.projectStore.createNode(this.currentGroupNode.id, testObj)
          this.projectStore.updateTestTree()
          this.createModalVisible = false
        }
      } catch (err) {
        console.error(err)
      }
    },
    async onSelectTestNode(testId: string) {
      this.projectStore.updateTestTree()
      this.projectStore.setCurrentNodeId(testId)
    },
    async onEnterTestGroup(testId: string) {
      console.log('onEnterTestGroup', testId)
      this.projectStore.setCurrentGroupId(testId)
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
