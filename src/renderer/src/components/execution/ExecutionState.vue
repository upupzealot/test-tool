<template>
  <template v-if="mode === 'action' && executingAction">
    <ActionExecution :action="executingAction!" />
  </template>
  <template v-if="mode === 'case'">
    <CaseExecution :kase="executingCase!" />
  </template>
  <div
    v-if="mode === 'group'"
    style="display: flex; flex-direction: row"
  >
    <div style="flex: 0; min-width: 240px">
      <GroupExecution
        :group="executingGroup!"
        :depth="0"
      />
    </div>
    <div
      v-if="executingCase"
      style="flex: 1; margin-left: -1px"
    >
      <CaseExecution :kase="executingCase!" />
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import { useExecutionStore } from '@renderer/store/execution'
import ActionExecution from './ActionExecution.vue'
import CaseExecution from './CaseExecution.vue'
import GroupExecution from './GroupExecution.vue'

export default {
  components: { ActionExecution, CaseExecution, GroupExecution },
  computed: {
    ...mapState(useExecutionStore, [
      'mode',
      'executingAction',
      'executingCase',
      'executingGroup'
    ])
  }
}
</script>
