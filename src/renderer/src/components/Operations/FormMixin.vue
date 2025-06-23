<script lang="ts">
import { PropType } from 'vue'

import { Operation } from '../types'
import { Form } from 'ant-design-vue'

export default {
  props: {
    operation: {
      type: Object as PropType<Operation>,
      required: true
    }
  },
  methods: {
    async validate() {
      await (this.$refs['paramsForm'] as typeof Form).validate()
    }
  }
}
</script>
