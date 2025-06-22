<template>
  <div class="operation">
    <a-tag
      :color="option.color"
      class="operation-tag"
    >
      {{ option.label }}
    </a-tag>
    <ParamsForm :operation="operation" />
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

import { Operation } from '../types'
import { OperationOptionMap } from './OperationOptions'
import ParamsForm from './ParamsForm.vue'

export default defineComponent({
  components: { ParamsForm, CloseOutlined },
  props: {
    operation: {
      type: Object as PropType<Operation>,
      required: true
    }
  },
  emits: ['delete'],
  computed: {
    option() {
      return OperationOptionMap[this.operation.type]
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

<style lang="css" scoped>
.operation-tag {
  position: absolute;
  top: 0;
  left: 0;
}

.operation form.ant-form {
  margin-bottom: -34px;
}

.operation form.ant-form .ant-form-item:last-child {
  margin-bottom: 10px;
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
