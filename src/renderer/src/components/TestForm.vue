<template>
  <a-form
    ref="testForm"
    :model="form"
    :layout="'horizontal'"
    :colon="false"
    :label-align="'right'"
    :label-col="{
      style: {
        width: '60px',
        maxWidth: '60px',
        textAlign: 'right',
        paddingBottom: 0,
        paddingRight: '10px'
      }
    }"
    :wrapper-col="{ style: { flex: 1 } }"
    style="padding-top: 10px"
  >
    <a-form-item
      label="类型"
      name="type"
      :rules="[{ required: true, message: '请选择类型' }]"
    >
      <a-radio-group v-model:value="form.type">
        <a-radio-button value="group"><FolderOutlined /> 测试组</a-radio-button>
        <a-radio-button value="case"><CodeOutlined /> 测试用例</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item
      label="名称"
      name="name"
      :rules="[{ required: true, message: '请输入项目名称' }]"
    >
      <a-input v-model:value="form.name" />
    </a-form-item>
    <a-form-item
      label="描述"
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
import { defineComponent, PropType, toRaw } from 'vue'
import { Form } from 'ant-design-vue'
import { FolderOutlined, CodeOutlined } from '@ant-design/icons-vue'

import { Test } from './types'

export default defineComponent({
  components: { FolderOutlined, CodeOutlined },
  props: {
    form: {
      type: Object as PropType<Test>,
      required: true
    },
    mode: {
      type: String as PropType<'create' | 'edit'>,
      defaultValue: 'create'
    }
  },
  methods: {
    async validate(): Promise<Test | null> {
      const testForm = this.$refs['testForm'] as typeof Form
      try {
        await testForm.validate()
        const projectObj = toRaw(this.form)
        return projectObj
      } catch (err) {
        return null
      }
    }
  }
})
</script>
