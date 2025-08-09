<template>
  <div class="operation-container">
    <div
      v-if="windowList.length"
      class="windows-headers"
    >
      <div
        v-for="win in windowList"
        :class="win.id ? ['header-item'] : ['header-item', 'default']"
      >
        {{ win.name || '默认窗口' }}
      </div>
      <a-dropdown>
        <a-button
          type="link"
          class="add-btn"
          ><PlusOutlined
        /></a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item
              v-for="win in contextWindows"
              :disabled="usingWinIds.includes(win.id)"
              @click="onUseWindow(win.id)"
            >
              {{ win.name }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>

    <template v-if="action && action.operations">
      <VueDraggable
        v-model="action.operations"
        :handle="'.operation-tag'"
      >
        <Operation
          v-for="operation in action.operations"
          :action="action"
          :operation="operation"
          @delete="onDeleteOperation(operation.id)"
        />
      </VueDraggable>
    </template>
    <div class="operation add-btn-panel">
      插入指令：
      <a-tag
        v-for="option in OperationOpts"
        :color="option.color"
        class="add-btn"
        @click="addOperation(option.key)"
      >
        {{ option.label }}
      </a-tag>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { defineComponent, PropType } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { PlusOutlined } from '@ant-design/icons-vue'

import { TestWindow } from '../test-settings/types'
import { Action } from './types'
import OperationOpts from './OperationOpts'
import Operation from './Operation.vue'

import ShortUniqueId from 'short-unique-id'
const uid = new ShortUniqueId({ length: 10 })

export default defineComponent({
  components: {
    PlusOutlined,
    VueDraggable,
    Operation
  },
  props: {
    contextWindows: {
      type: Object as PropType<{ [key: string]: TestWindow }>,
      required: true
    },
    action: {
      type: Object as PropType<Action>,
      required: false
    }
  },
  emits: ['addOperation'],
  data() {
    return {
      usingWinIds: [] as string[],
      OperationOpts,
      running: false
    }
  },
  computed: {
    windowMap() {
      const operations = this.action?.operations || []
      const openOperations = operations.filter((op) => op.type === 'open')
      const operationWindows = {} as { [key: string]: TestWindow }
      openOperations.forEach((open) => {
        operationWindows[open.id] = open.params as TestWindow
      })

      return _.merge({}, this.contextWindows, operationWindows)
    },
    windowsOrder() {
      const operations = this.action?.operations || []
      const opWinIds = operations.map((op) => op.winId || 'default')
      const winIds = _.uniq(opWinIds)
      return _.sortBy(winIds, (winId) => {
        return opWinIds.indexOf(winId)
      })
    },
    windowList() {
      const opWindows = this.windowsOrder.map((winId) => {
        if (winId === 'default') {
          return {} as TestWindow
        } else {
          return this.windowMap[winId]
        }
      })
      const usingWindows = this.usingWinIds.map((winId) => this.windowMap[winId])
      return _.uniqBy([...opWindows, ...usingWindows], 'id')
    }
  },
  methods: {
    onUseWindow(winId: string) {
      this.usingWinIds.push(winId)
    },
    addOperation(type: string) {
      this.$emit('addOperation', {
        id: uid.rnd(),
        type,
        params: {}
      })
    },
    onDeleteOperation(operationId: string) {
      const { action } = this
      if (!action) {
        return
      }
      action.operations = action.operations.filter(
        (operation) => operation.id !== operationId
      )
    }
  }
})
</script>

<style lang="css" scoped>
.operation-container .windows-headers {
  margin-bottom: -1px;
  display: flex;
  flex-direction: row;
  position: relative;
}
.operation-container .windows-headers .header-item {
  border: #eee 1px solid;
  padding: 5px;
  text-align: center;
  flex: 1;
  cursor: pointer;
}
.operation-container .windows-headers .header-item:not(:first-child) {
  margin-left: -1px;
}
.operation-container .windows-headers .header-item.default {
  color: #ccc;
  font-style: italic;
}
.operation-container .windows-headers .add-btn {
  position: absolute;
  right: 0;
  padding: 5px 10px;
}

.operation-container {
  border: #eee 1px solid;
  padding: 10px 15px;
}
.operation-container .operation {
  position: relative;
  flex: 0;
  border: #eee 1px solid;
  min-height: 46px;
  padding: 30px 20px 10px 10px;
}
.operation-container .operation:not(:first-child) {
  margin-top: -1px;
}
.operation-container .operation.add-btn-panel {
  padding: 10px 15px;
}
.operation-container .operation.add-btn-panel .add-btn {
  cursor: pointer;
}
</style>
