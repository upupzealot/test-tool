<template>
  <a-modal
    v-model:open="modalVisible"
    title="新建窗口"
  >
    <a-form
      ref="windowForm"
      :model="windowForm"
      size="default"
      style="padding-top: 10px"
    >
      <a-form-item
        label="窗口名称"
        name="name"
      >
        <a-input v-model:value="windowForm.name"></a-input>
      </a-form-item>
      <a-form-item
        label="窗口类型"
        name="mode"
      >
        <a-radio-group v-model:value="windowForm.mode">
          <a-radio value="desktop"><DesktopOutlined /> 桌面端</a-radio>
          <a-radio value="mobile"><MobileOutlined /> 移动端</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button
        key="back"
        size="default"
        @click="onCancel"
      >
        取消
      </a-button>
      <a-button
        key="submit"
        type="primary"
        size="default"
        @click="onSubmit"
      >
        保存
      </a-button>
    </template>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { DesktopOutlined, MobileOutlined } from '@ant-design/icons-vue'

import { TestWindow } from './types'

export default defineComponent({
  components: { DesktopOutlined, MobileOutlined },
  props: {
    open: {
      type: Boolean as PropType<boolean>,
      required: true
    },
    window: {
      type: Object as PropType<TestWindow>,
      required: true
    }
  },
  emits: ['update:open', 'submitWindow'],
  data() {
    return {
      windowForm: {} as unknown as TestWindow
    }
  },
  computed: {
    modalVisible: {
      get() {
        return this.open
      },
      set(visible) {
        this.$emit('update:open', visible)
      }
    }
  },
  watch: {
    open() {
      if (this.modalVisible) {
        this.windowForm = JSON.parse(JSON.stringify(this.window))
      }
    }
  },
  methods: {
    onCancel() {
      this.modalVisible = false
    },
    onSubmit() {
      const winObj = JSON.parse(JSON.stringify(this.windowForm)) as TestWindow
      this.$emit('submitWindow', winObj)
      this.modalVisible = false
    }
  }
})
</script>
