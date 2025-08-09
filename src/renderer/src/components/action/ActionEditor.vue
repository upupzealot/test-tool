<template>
  <div class="action-editor">
    <div
      v-if="windowList.length"
      class="window-headers"
    >
      <template v-for="(win, i) in windowList">
        <div
          :class="
            win.id === currentWindowId ? ['window-header', 'active'] : ['window-header']
          "
        >
          <div :style="{ width: `${50 * i}px` }" />
          <div
            :class="win.id ? ['title'] : ['title', 'default']"
            @click="onSelectWindow(win.id)"
          >
            {{ win.name || '默认窗口' }}
          </div>
          <div :style="{ width: `${50 * (windowList.length - 1 - i)}px` }" />
        </div>
      </template>
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
        class="operation-list"
      >
        <div
          v-for="operation in action.operations"
          :class="
            operation.winId === currentWindowId
              ? ['operation-item', 'active']
              : ['operation-item']
          "
        >
          <div :style="{ width: `${50 * windowsOrder.indexOf(operation.winId)}px` }" />
          <Operation
            :action="action"
            :operation="operation"
            @delete="onDeleteOperation(operation.id)"
          />
          <div
            :style="{
              width: `${50 * (windowsOrder.length - 1 - windowsOrder.indexOf(operation.winId))}px`
            }"
          />
        </div>
      </VueDraggable>
    </template>

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
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { defineComponent, PropType } from 'vue'
import { mapWritableState } from 'pinia'
import { VueDraggable } from 'vue-draggable-plus'
import { PlusOutlined } from '@ant-design/icons-vue'

import { TestWindow } from '../test-settings/types'
import { Action } from './types'
import { useStateStore } from '@renderer/store/state'
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
    ...mapWritableState(useStateStore, ['currentWindowId']),
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
    onSelectWindow(winId: string) {
      this.currentWindowId = winId
    },
    addOperation(type: string) {
      this.$emit('addOperation', {
        winId: this.currentWindowId,
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
.action-editor {
  border: #eee 1px solid;
  display: flex;
  flex-direction: column;
}
.action-editor .window-headers {
  display: flex;
  flex-direction: column;
  position: relative;
}
.window-headers .window-header {
  display: flex;
  flex-direction: row;
}
.window-headers .add-btn {
  position: absolute;
  top: 0;
  right: 0;
  padding: 5px 10px;
}

.window-header .title {
  border: #eee 1px solid;
  padding: 5px;
  text-align: center;
  flex: 1;
  cursor: pointer;
}
.window-header:not(:first-of-type) .title {
  margin-top: -1px;
}
.window-header:first-of-type .title {
  border-top: none;
  border-left: none;
}
.window-header:last-of-type .title {
  /* border-bottom: none; */
  border-right: none;
}
.window-header.active .title {
  background-color: aliceblue;
}
.window-header .title.default {
  color: #ccc;
  font-style: italic;
}

.operation-list {
  margin: -1px;
}
.operation-item {
  display: flex;
  flex-direction: row;
}
.operation-item.active .operation {
  background-color: aliceblue;
}
.operation-item:not(:first-of-type) {
  margin-top: -1px;
}
.operation {
  position: relative;
  flex: 1;
  border: #eee 1px solid;
  min-height: 46px;
  padding: 30px 20px 10px 10px;
}
.add-operation-btns {
  border-top: #eee 1px solid;
  padding: 10px 15px;
}
.add-operation-btns .operation-btn {
  cursor: pointer;
}
</style>
