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
  </a-form>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia'
import { useProjectStore } from '../store'

import ChromeIcon from '../assets/Chrome.png'
import ChromiumIcon from '../assets/Chromium.png'

export default {
  data() {
    return {
      ChromeIcon,
      ChromiumIcon,
      form: {}
    }
  },
  async mounted() {
    await this.initBrowserSelection()
  },
  computed: {
    ...mapState(useProjectStore, ['browserType', 'browserPathMap']),
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
    }
  },
  methods: {
    ...mapActions(useProjectStore, [
      'setBrowserType',
      'initBrowserSelection',
      'updateBrowserPathMap'
    ])
  }
}
</script>
