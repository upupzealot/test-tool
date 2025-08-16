<template>
  <a-modal
    v-model:open="modalVisible"
    title="新建窗口"
  >
    <a-form
      ref="windowForm"
      :model="windowForm"
      :rules="rules"
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
import { FormInstance } from 'ant-design-vue'
import { DesktopOutlined, MobileOutlined } from '@ant-design/icons-vue'

import { TestWindow } from '@common/types/test-settings'

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
      windowForm: {} as unknown as TestWindow,
      rules: {
        name: {
          required: true,
          message: '请输入窗口名称'
        },
        mode: {
          required: true,
          message: '请选择窗口类型'
        }
      }
    }
  },
  computed: {
    modalVisible: {
      get() {
        return this.open
      },
      set(visible) {
        if (visible) {
          ;(this.$refs['windowForm'] as FormInstance).resetFields()
        }
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
    async validate() {
      return (this.$refs['windowForm'] as FormInstance).validate()
    },
    onCancel() {
      this.modalVisible = false
    },
    async onSubmit() {
      let valid = true
      try {
        await (this.$refs['windowForm'] as FormInstance).validate()
      } catch (e) {
        valid = false
      }
      if (valid) {
        const winObj = JSON.parse(JSON.stringify(this.windowForm)) as TestWindow
        this.$emit('submitWindow', winObj)
        this.modalVisible = false
      }
    }
  }
})
</script>
