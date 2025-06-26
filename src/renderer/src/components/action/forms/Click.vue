<template>
  <a-form
    ref="paramsForm"
    :model="params"
    size="small"
  >
    <ItemLocator :params="params" />
  </a-form>
</template>

<script lang="ts">
import _Mixin from './_Mixin.vue'
import ItemLocator from '../form-items/Locator.vue'

export default {
  mixins: [_Mixin],
  components: { ItemLocator }
}
</script>
