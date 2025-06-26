<template>
  <div class="num-opt">
    <a-select
      v-model:value="params.numOpt"
      class="select"
    >
      <a-select-option value="=">=</a-select-option>
      <a-select-option value=">">></a-select-option>
      <a-select-option value=">=">≥</a-select-option>
      <a-select-option value="<"><</a-select-option>
      <a-select-option value="<=">≤</a-select-option>
    </a-select>
    <a-input
      class="input"
      v-model:value.number="params.num"
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
.num-opt {
  display: flex;
}
.num-opt .select {
  flex: 0;
  min-width: 65px;
}
.num-opt .input {
  flex: 1;
  margin-left: 2px;
}
</style>
