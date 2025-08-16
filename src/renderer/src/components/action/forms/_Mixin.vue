<script lang="ts">
import { PropType } from 'vue'

import { Operation } from '@common/types/action'
import { Form } from 'ant-design-vue'

export default {
  props: {
    operation: {
      type: Object as PropType<Operation>,
      required: true
    }
  },
  computed: {
    params() {
      return this.operation.params
    }
  },
  methods: {
    async validate() {
      await (this.$refs['paramsForm'] as typeof Form).validate()
    }
  }
}
</script>
