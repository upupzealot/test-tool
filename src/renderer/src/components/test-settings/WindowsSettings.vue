<template>
  <a-list
    bordered
    size="small"
    :locale="{ emptyText: '' }"
    class="window-settings"
  >
    <a-list-item
      v-if="parentWindowList.length"
      class="title-item"
    >
      父级窗口
    </a-list-item>
    <a-list-item
      v-for="win in parentWindowList"
      :key="win.id"
    >
      <span>
        <DesktopOutlined v-if="win.mode === 'desktop'" />
        <MobileOutlined v-if="win.mode === 'mobile'" />
        <span style="padding-left: 10px">{{ win.name }}</span>
      </span>
    </a-list-item>

    <a-list-item class="title-item">本级窗口</a-list-item>
    <a-list-item
      v-for="win in windowList"
      :key="win.id"
    >
      <span :style="{ opacity: isParentWindow(win.id) ? 0.5 : 1 }">
        <DesktopOutlined v-if="win.mode === 'desktop'" />
        <MobileOutlined v-if="win.mode === 'mobile'" />
        <span style="padding-left: 10px">{{ win.name }}</span>
      </span>
    </a-list-item>

    <a-list-item>
      <a-button
        type="link"
        @click="onAddWindow"
        style="padding-left: 0"
        ><PlusOutlined />新建窗口</a-button
      >
    </a-list-item>
  </a-list>
  <a-modal
    v-model:open="addWindowModalVisible"
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
import _ from 'lodash'
import { defineComponent, PropType } from 'vue'
import { PlusOutlined, DesktopOutlined, MobileOutlined } from '@ant-design/icons-vue'

import { TestSettings, TestWindow } from './types'

import ShortUniqueId from 'short-unique-id'
const uid = new ShortUniqueId({ length: 10 })

export default defineComponent({
  components: { PlusOutlined, DesktopOutlined, MobileOutlined },
  props: {
    settings: {
      type: Object as PropType<TestSettings>,
      required: true
    },
    parentSettings: {
      type: Object as PropType<TestSettings>,
      required: true
    }
  },
  emits: ['createWindow'],
  data() {
    return {
      addWindowModalVisible: false,
      windowForm: {
        name: '',
        mode: ''
      } as unknown as TestWindow
    }
  },
  computed: {
    parentWindowList() {
      return _.sortBy(this.parentSettings.windows, 'name')
    },
    windowList() {
      return _.sortBy(this.settings.windows, 'name')
    }
  },
  methods: {
    isParentWindow(winId: string) {
      const parentWindows = this.parentSettings.windows
      return !!(parentWindows && parentWindows[winId])
    },
    onAddWindow() {
      this.windowForm = {} as TestWindow
      this.addWindowModalVisible = true
    },
    onCancel() {
      this.addWindowModalVisible = false
    },
    onSubmit() {
      const winObj = JSON.parse(JSON.stringify(this.windowForm)) as TestWindow
      winObj.id = uid.rnd()
      this.$emit('createWindow', winObj)
      this.addWindowModalVisible = false
    }
  }
})
</script>

<style lang="css" scoped>
.window-settings .title-item {
  color: #bbb;
  padding: 4px 16px;
}
</style>
