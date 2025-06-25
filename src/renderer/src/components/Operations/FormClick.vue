<template>
  <a-form
    ref="paramsForm"
    :model="params"
    size="small"
  >
    <LocatorItem :params="params" />
  </a-form>
</template>

<script lang="ts">
import FormMixin from './FormMixin.vue'
import LocatorItem from './LocatorItem.vue'

export default {
  mixins: [FormMixin],
  components: { LocatorItem }
}
</script>
