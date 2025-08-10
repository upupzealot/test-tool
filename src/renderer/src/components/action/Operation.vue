<template>
  <div class="operation">
    <a-tag
      :color="option.color"
      class="operation-tag"
    >
      {{ option.label }}
    </a-tag>
    <FormOpen
      v-if="operation.type === 'open'"
      :operation="operation"
    />
    <FormGoto
      v-if="operation.type === 'goto'"
      :operation="operation"
    />
    <FormInput
      v-if="operation.type === 'input'"
      :operation="operation"
    />
    <FormClick
      v-if="operation.type === 'click'"
      :operation="operation"
    />
    <FormLookup
      v-if="operation.type === 'lookup'"
      :operation="operation"
    />
    <FormPageLookup
      v-if="operation.type === 'lookup:page'"
      :operation="operation"
    />
    <FormWait
      v-if="operation.type === 'wait'"
      :operation="operation"
    />
    <FormAssert
      v-if="operation.type === 'assert'"
      :action="action"
      :operation="operation"
    />
    <div
      class="delete-btn"
      @click="showDeleteConfirm"
    >
      <CloseOutlined />
    </div>
  </div>
</template>

<script lang="ts">
import { createVNode, defineComponent, PropType } from 'vue'

import { Modal } from 'ant-design-vue'
import { CloseOutlined, WarningOutlined } from '@ant-design/icons-vue'

import { Action, Operation } from './types'
import { OperationOptMap } from './OperationOpts'
import FormOpen from './forms/Open.vue'
import FormGoto from './forms/Goto.vue'
import FormInput from './forms/Input.vue'
import FormClick from './forms/Click.vue'
import FormLookup from './forms/Lookup.vue'
import FormPageLookup from './forms/PageLookup.vue'
import FormWait from './forms/Wait.vue'
import FormAssert from './forms/Assert.vue'

export default defineComponent({
  components: {
    FormOpen,
    FormGoto,
    FormInput,
    FormClick,
    FormLookup,
    FormPageLookup,
    FormWait,
    FormAssert,
    CloseOutlined
  },
  props: {
    action: {
      type: Object as PropType<Action>,
      required: true
    },
    operation: {
      type: Object as PropType<Operation>,
      required: true
    }
  },
  emits: ['delete'],
  computed: {
    option() {
      return OperationOptMap[this.operation.type]
    }
  },
  methods: {
    showDeleteConfirm() {
      const self = this
      Modal.confirm({
        title: '确认删除',
        icon: createVNode(WarningOutlined),
        content: `确认删除该 ${this.option.label} 操作？`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          self.onDelete()
        }
      })
    },
    onDelete() {
      this.$emit('delete')
    }
  }
})
</script>

<style lang="css">
.operation form.ant-form .ant-form-item {
  margin-bottom: 10px;
}
.operation form.ant-form {
  margin-bottom: -5px;
}
</style>

<style lang="css" scoped>
.operation-tag {
  position: absolute;
  top: 0;
  left: 0;
  cursor: move;
}

.operation .delete-btn {
  display: none;

  position: absolute;
  color: red;
  font-size: 12px;
  top: 2px;
  right: 4px;
  cursor: pointer;
}
.operation:hover .delete-btn {
  display: block;
}
</style>
