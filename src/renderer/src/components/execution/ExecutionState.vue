<template>
  <div
    class="action-execution"
    v-if="mode === 'action'"
  >
    <ActionExecution :action="executingAction!" />
  </div>
  <template v-if="mode === 'case'">
    <div
      class="action-execution"
      v-for="action in executingCase?.beforeActions"
    >
      {{ action.nodeName }}: {{ action.stepId }}
      <ActionExecution :action="action" />
    </div>
    <div
      class="action-execution"
      v-for="action in executingCase?.beforeEachActions"
    >
      {{ action.nodeName }}: {{ action.stepId }}
      <ActionExecution
        v-for="action in executingCase?.beforeEachActions"
        :action="action"
      />
    </div>
    <div class="action-execution">
      {{ executingCase?.name }}
      <ActionExecution :action="executingCase?.action!" />
    </div>
  </template>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import { useExecutionStore } from '@renderer/store/execution'
import ActionExecution from './ActionExecution.vue'

export default {
  components: { ActionExecution },
  computed: {
    ...mapState(useExecutionStore, ['mode', 'executingAction', 'executingCase'])
  }
}
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
