<template>
  <div
    class="action-execution"
    v-for="action in kase.beforeActions"
  >
    {{ action.nodeName }}: {{ action.type }}
    <ActionExecution :action="action" />
  </div>
  <div
    class="action-execution"
    v-for="action in kase.beforeEachActions"
  >
    {{ action.nodeName }}: {{ action.type }}
    <ActionExecution
      v-for="action in kase.beforeEachActions"
      :action="action"
    />
  </div>
  <div class="action-execution">
    {{ kase.name }}
    <ActionExecution :action="kase.action!" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { CaseExecution } from '@common/types/execution'

import ActionExecution from './ActionExecution.vue'

export default defineComponent({
  components: { ActionExecution },
  props: {
    kase: {
      type: Object as PropType<CaseExecution>,
      required: true
    }
  }
})
</script>

<style lang="css" scoped>
.action-execution {
  border: #eee 1px solid;
  padding: 10px 15px;
}
.action-execution:not(:first-child) {
  margin-top: -1px;
}
</style>
