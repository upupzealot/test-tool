<template>
  <a-form
    ref="projectForm"
    :model="form"
    :layout="'horizontal'"
    :colon="false"
    :label-align="'right'"
    :label-col="{
      style: {
        width: '80px',
        maxWidth: '80px',
        textAlign: 'right',
        paddingBottom: 0,
        paddingRight: '10px'
      }
    }"
    :wrapper-col="{ style: { flex: 1 } }"
    style="padding-top: 10px"
  >
    <a-form-item
      label="浏览器路径"
      name="chromePath"
    >
      <template #label> aaa </template>
      <a-input-search
        v-model:value="bPath"
        @search="updateBrowserPathMap"
      >
        <template #addonBefore>
          <a-select
            v-model:value="bType"
            style="width: 150px"
          >
            <a-select-option value="chromium">
              <img
                width="28"
                :src="ChromiumIcon"
              />
              Chromium
            </a-select-option>
            <a-select-option value="chrome">
              <img
                width="28"
                :src="ChromeIcon"
              />
              Chrome
            </a-select-option>
          </a-select>
        </template>
      </a-input-search>
    </a-form-item>
    <a-form-item label="测试浏览器">
      <a-input-search
        v-model:value="testUrl"
        placeholder="https://www.baidu.com/"
        @search="updateBrowserPathMap"
      >
        <template #enterButton>
          <a-button
            :loading="testing"
            @click="testBrowser"
          >
            {{ testing ? '测试中' : '开始测试' }}
          </a-button>
        </template>
      </a-input-search>
    </a-form-item>
  </a-form>
  <div>BrowserPath: {{ bPath }}</div>
  <div>
    BrowserBorder: {{ bBorder ? `${bBorder.width}px, ${bBorder.height}px` : null }}
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia'
import { useSettingsStore } from '../../store/settings'

import ChromeIcon from '@renderer/assets/Chrome.png'
import ChromiumIcon from '@renderer/assets/Chromium.png'

export default {
  data() {
    return {
      ChromeIcon,
      ChromiumIcon,
      form: {},
      testUrl: '',
      testing: false
    }
  },
  async mounted() {
    await this.initBrowserSelection()
  },
  computed: {
    ...mapState(useSettingsStore, ['browserType', 'browserPathMap', 'browserBorder']),
    bType: {
      get() {
        return this.browserType
      },
      async set(value) {
        await this.setBrowserType(value)
      }
    },
    bPath: {
      get() {
        return this.browserPathMap[this.browserType]
      },
      set(value) {
        this.browserPathMap[this.browserType] = value
      }
    },
    bBorder() {
      return this.browserBorder[this.browserType]
    }
  },
  methods: {
    ...mapActions(useSettingsStore, [
      'setBrowserType',
      'initBrowserSelection',
      'updateBrowserPathMap',
      'setBrowserBorder'
    ]),
    async testBrowser() {
      const testUrl = this.testUrl || 'https://www.baidu.com/'

      const { ipcRenderer } = window.electron
      this.testing = true
      try {
        const testResult = await ipcRenderer.invoke('test-browser', this.bPath, testUrl)
        this.setBrowserBorder(testResult.window, testResult.viewport)
        this.testing = false
      } catch (err) {
        console.error('测试失败', err)
        this.testing = false
      }
    }
  }
}
</script>
