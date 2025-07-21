<template>
  <div class="settings-container">Test Settings of: {{ currentGroup.name }}</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { GroupNode } from '../types'

export default defineComponent({
  props: {
    currentGroup: {
      type: Object as PropType<GroupNode>,
      required: true
    }
  }
})
</script>

<style lang="css" scoped>
.settings-container {
  border: #eee 1px solid;
  padding: 10px 15px;
  cursor: pointer;
}
</style>
