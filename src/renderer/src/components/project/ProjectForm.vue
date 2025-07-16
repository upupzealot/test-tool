<template>
  <a-form
    ref="projectForm"
    :model="form"
    :layout="'horizontal'"
    size="small"
    :colon="false"
    :label-align="'right'"
    :label-col="{
      style: {
        width: '90px',
        maxWidth: '90px',
        textAlign: 'right',
        paddingBottom: 0,
        paddingRight: '10px'
      }
    }"
    :wrapper-col="{ style: { flex: 1 } }"
    style="padding-top: 10px"
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
    <a-divider orientation="left">基本信息</a-divider>
    <a-form-item
      label="项目名称"
      name="name"
      :rules="[{ required: true, message: '请输入项目名称' }]"
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

    <template v-if="mode !== 'create'">
      <a-divider orientation="left">项目配置</a-divider>
      <ProjectConf :form="form" />
    </template>
  </a-form>
</template>

<script lang="ts">
import { Form } from 'ant-design-vue'
import { defineComponent, PropType, toRaw } from 'vue'

import { Project } from '../types'
import ProjectConf from './ProjectConf.vue'

export default defineComponent({
  components: { ProjectConf },
  props: {
    form: {
      type: Object as PropType<Project>,
      required: true
    },
    mode: {
      type: String as PropType<'create' | 'edit'>,
      default: 'edit'
    },
    filePath: {
      type: String as PropType<string>,
      default: ''
    }
  },
  methods: {
    async validate(): Promise<Project | null> {
      const projectForm = this.$refs['projectForm'] as typeof Form
      try {
        await projectForm.validate()
        const projectObj = toRaw(this.form)
        return projectObj
      } catch (err) {
        return null
      }
    }
  }
})
</script>
