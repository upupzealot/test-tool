<template>
  <div class="text-opt">
    <a-select
      v-model:value="params.textOpt"
      class="select"
    >
      <a-select-option value="equals">等于</a-select-option>
      <a-select-option value="includes">包含</a-select-option>
      <a-select-option value="startsWith">开头</a-select-option>
      <a-select-option value="endsWith">结尾</a-select-option>
      <!-- <a-select-option value="regex">正则</a-select-option> -->
    </a-select>
    <a-input
      class="input"
      v-model:value="params.text"
    ></a-input>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    params: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="css" scoped>
.text-opt {
  display: flex;
}
.text-opt .select {
  flex: 0;
}
.text-opt .input {
  flex: 1;
  margin-left: 2px;
}
</style>
