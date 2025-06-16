<template>
  <a-form
    ref="projectForm"
    :model="form"
    :layout="'horizontal'"
    :label-col="{
      style: { maxWidth: '80px', textAlign: 'right', paddingBottom: 0, paddingRight: '10px' }
    }"
    :wrapper-col="{ style: { flex: 1 } }"
  >
    <a-form-item
      label="文件路径"
      name="filePath"
      v-if="filePath"
    >
      <a-input
        disabled
        v-model:value="filePath"
      />
    </a-form-item>
    <a-divider></a-divider>
    <a-form-item
      label="项目名称"
      name="name"
      :rules="[{ required: true, message: '请输入项目名称!' }]"
    >
      <a-input v-model:value="form.name" />
    </a-form-item>
    <a-form-item
      label="项目简介"
      name="desc"
    >
      <a-textarea
        v-model:value="form.desc"
        :auto-size="{ minRows: 2, maxRows: 5 }"
      />
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { Form } from 'ant-design-vue'
import { defineComponent, PropType, toRaw } from 'vue'

import { Project } from './types'

export default defineComponent({
  props: {
    form: {
      type: Object as PropType<Project>,
      required: true
    },
    mode: {
      type: String as PropType<'create' | 'edit'>,
      defaultValue: 'create'
    },
    filePath: {
      type: String as PropType<string>,
      defaultValue: ''
    }
  },
  methods: {
    async validate(): Promise<Project | null> {
      const createForm = this.$refs['projectForm'] as typeof Form
      try {
        await createForm.validate()
        const projectObj = toRaw(this.form)
        return projectObj
      } catch (err) {
        return null
      }
    }
  }
})
</script>
