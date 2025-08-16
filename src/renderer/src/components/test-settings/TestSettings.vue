<template>
  <div class="settings-container">
    <a-form
      ref="settingsForm"
      :model="settings"
      size="small"
    >
      <a-form-item
        label="窗口"
        name="windows"
        size="default"
      >
        <WindowsSettings
          :settings="settings"
          :parentSettings="parentSettings"
          @addWindow="onAddWindow"
        />
      </a-form-item>

      <a-form-item
        label="延迟"
        name="delay"
        :class="modified.delay ? ['modified'] : []"
      >
        <a-input-number
          v-model:value="settings.delay"
          :placeholder="`${parentSettings.delay}`"
        >
          <template #addonAfter> ms </template>
        </a-input-number>
        <div class="dot"></div>
      </a-form-item>

      <a-form-item
        label="重试"
        name="retry"
        :class="modified.retry ? ['modified'] : []"
      >
        <a-input-number
          v-model:value="settings.retry"
          :placeholder="`${parentSettings.retry}`"
        />
        <div class="dot"></div>
      </a-form-item>

      <a-form-item
        label="超时"
        name="timeout"
        :class="modified.timeout ? ['modified'] : []"
      >
        <a-input-number
          v-model:value="settings.timeout"
          :placeholder="`${parentSettings.timeout}`"
        >
          <template #addonAfter> ms </template>
        </a-input-number>
        <div class="dot"></div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { defineComponent, PropType } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'

import { DEFAULT_SETTINGS, TestSettings, TestWindow } from '@common/types/test-settings'
import WindowsSettings from './WindowsSettings.vue'

export default defineComponent({
  components: { PlusOutlined, WindowsSettings },
  props: {
    parentSettings: {
      type: Object as PropType<TestSettings>,
      required: true
    },
    settings: {
      type: Object as PropType<TestSettings>,
      required: true
    }
  },
  data() {
    return {
      DEFAULT_SETTINGS
    }
  },
  computed: {
    modified() {
      return {
        delay:
          !_.isNil(this.settings.delay) &&
          this.settings.delay !== this.parentSettings.delay,
        retry:
          !_.isNil(this.settings.retry) &&
          this.settings.retry !== this.parentSettings.retry,
        timeout:
          !_.isNil(this.settings.timeout) &&
          this.settings.timeout !== this.parentSettings.timeout
      }
    }
  },
  methods: {
    onAddWindow(winObj: TestWindow) {
      if (!this.settings.windows) {
        this.settings.windows = {}
      }
      this.settings.windows[winObj.id] = winObj
    }
  }
})
</script>

<style lang="css" scoped>
.settings-container {
  border: #eee 1px solid;
  padding: 10px 15px;
}

.ant-form-item .dot {
  position: absolute;
  left: -2px;
  top: -2px;
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: blueviolet;
  z-index: 999;
  display: none;
}

.ant-form-item.modified .dot {
  display: block;
}
</style>
