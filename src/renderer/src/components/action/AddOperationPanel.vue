<template>
  <div class="add-operation-btns">
    插入指令：
    <a-tag
      v-for="option in OperationOpts"
      :color="option.color"
      class="operation-btn"
      @click="addOperation(option.key)"
    >
      {{ option.label }}
    </a-tag>
    <EditWindowModal
      v-model:open="windowModalVisible"
      :window="windowForm"
      @submitWindow="onSubmit"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'

import { useStateStore } from '@renderer/store/state'
import OperationOpts from './OperationOpts'
import { TestWindow } from '../test-settings/types'
import EditWindowModal from '../test-settings/EditWindowModal.vue'

import ShortUniqueId from 'short-unique-id'
const uid = new ShortUniqueId({ length: 10 })

export default defineComponent({
  components: { EditWindowModal },
  emits: ['addOperation'],
  data() {
    return {
      OperationOpts,
      windowForm: {} as TestWindow,
      windowModalVisible: false
    }
  },
  computed: {
    ...mapWritableState(useStateStore, ['currentWindowId'])
  },
  methods: {
    addOperation(type: string) {
      if (type === 'open') {
        this.windowForm = {} as TestWindow
        this.windowModalVisible = true
      } else {
        this.$emit('addOperation', {
          winId: this.currentWindowId,
          id: uid.rnd(),
          type,
          params: {}
        })
      }
    },
    onCancel() {
      this.windowModalVisible = false
    },
    onSubmit(windowForm) {
      const winObj = JSON.parse(JSON.stringify(windowForm))
      const winId = uid.rnd()
      this.$emit('addOperation', {
        winId,
        id: winId,
        type: 'open',
        params: {
          ...winObj
        }
      })
    }
  }
})
</script>

<style lang="css" scoped>
.add-operation-btns {
  border-top: #eee 1px solid;
  padding: 10px 15px;
}
.add-operation-btns .operation-btn {
  cursor: pointer;
}
</style>
