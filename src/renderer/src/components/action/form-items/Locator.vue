<template>
  <a-form-item
    :autoLink="false"
    class="locator-form-item"
    label="元素"
    :rules="[{ required: true }]"
    @change="validate"
  >
    <div class="locator-item">
      <div class="locator-item-label">选择器</div>
      <a-select
        :class="
          params.selectorPreset === 'custom'
            ? ['preset-select', 'custom']
            : ['preset-select']
        "
        v-model:value="params.selectorPreset"
      >
        <a-select-option value="button">按钮</a-select-option>
        <a-select-option value="link">链接</a-select-option>
        <a-select-option value="tab">标签页</a-select-option>
        <a-select-option value="menu">导航栏</a-select-option>
        <a-select-option value="custom">自定义</a-select-option>
      </a-select>
      <a-input
        class="input"
        v-if="params.selectorPreset === 'custom'"
        v-model:value="params.selector"
      />
    </div>
    <div class="locator-item">
      <div class="locator-item-label">文本</div>
      <TextOpt
        class="locator-item-control"
        :params="params"
      />
    </div>
  </a-form-item>
</template>

<script>
import TextOpt from './TextOpt.vue'

export default {
  components: { TextOpt },
  props: {
    params: {
      type: Object,
      required: true
    }
  },
  methods: {
    async validate() {
      // TODO
    }
  }
}
</script>

<style lang="css" scoped>
.locator-item {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.locator-item:not(:first-child) {
  margin-top: 3px;
}

.locator-item .locator-item-label {
  flex: 0;
  min-width: 55px;
  padding: 0 5px;
  text-align: left;
}
.locator-item-control {
  flex: 1;
}

.locator-item .preset-select {
  flex: 1;
}
.locator-item .preset-select.custom {
  flex: 0;
  margin-right: 2px;
}
.locator-item .input {
  flex: 1;
}

.locator-item .text-select {
  flex: 0;
  margin-right: 2px;
}
</style>
