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
        @click="showAddWindow"
        style="padding-left: 0"
        ><PlusOutlined />新建窗口</a-button
      >
    </a-list-item>
  </a-list>

  <EditWindowModal
    v-model:open="windowModalVisible"
    :window="windowForm"
    @submitWindow="onAddWindow"
  />
</template>

<script lang="ts">
import _ from 'lodash'
import { defineComponent, PropType } from 'vue'
import { PlusOutlined, DesktopOutlined, MobileOutlined } from '@ant-design/icons-vue'

import { TestSettings, TestWindow } from '@common/types/test-settings'
import EditWindowModal from './EditWindowModal.vue'

import ShortUniqueId from 'short-unique-id'
const uid = new ShortUniqueId({ length: 10 })

export default defineComponent({
  components: { PlusOutlined, DesktopOutlined, MobileOutlined, EditWindowModal },
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
  emits: ['addWindow'],
  data() {
    return {
      windowModalVisible: false,
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
    showAddWindow() {
      this.windowForm = {} as TestWindow
      this.windowModalVisible = true
    },
    onAddWindow(winObj: TestWindow) {
      winObj.id = uid.rnd()
      this.$emit('addWindow', winObj)
    },
    showEditWindow(winObj: TestWindow) {
      this.windowForm = winObj
      this.windowModalVisible = true
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
