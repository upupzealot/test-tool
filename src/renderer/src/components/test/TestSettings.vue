<template>
  <div class="settings-container">
    <a-form
      ref="settingsForm"
      :model="settings"
      size="small"
    >
      <a-form-item
        label="延迟"
        name="delay"
        :class="modified.delay ? ['modified'] : []"
      >
        <a-input-number
          v-model:value="settings.delay"
          :placeholder="parentSettings.delay"
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
          :placeholder="parentSettings.retry"
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
          :placeholder="parentSettings.timeout"
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
import { mapActions } from 'pinia'

import { useStateStore } from '@renderer/store/state'
import { TestNode, TestSettings, DEFAULT_SETTINGS } from '../types'

export default defineComponent({
  props: {
    currentNode: {
      type: Object as PropType<TestNode>,
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
    },
    parentSettings() {
      const parentPaths = [...this.currentNode.paths]
      parentPaths.pop()
      const pathSettings = parentPaths.map((path) => {
        const pathNode = this.getNode(path)
        return pathNode.test.settings || {}
      })
      return _.merge({}, ...[DEFAULT_SETTINGS, ...pathSettings]) as TestSettings
    },
    settings() {
      if (!this.currentNode.test.settings) {
        this.currentNode.test.settings = {}
      }
      return this.currentNode.test.settings
    }
  },
  methods: {
    ...mapActions(useStateStore, ['getNode'])
  }
})
</script>

<style lang="css" scoped>
.settings-container {
  border: #eee 1px solid;
  padding: 10px 15px;
  cursor: pointer;
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
