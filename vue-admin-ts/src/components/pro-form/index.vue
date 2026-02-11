<script setup lang="ts">
import { ref, toRef, useSlots } from 'vue'
import type { FormInstance } from 'element-plus'
import type { ProFormProps, ProFormExpose, FormApi } from './types'
import { useFormModel } from './hooks/use-form-model'
import { createProFormContext } from './context'
import FormItem from './components/form-item.vue'

defineOptions({ name: 'ProForm' })

const props = withDefaults(defineProps<ProFormProps>(), {
    colSpan: 24,
    inline: false,
    gutter: 16,
})

// el-form 实例
const elFormRef = ref<FormInstance>()
// 表单列-并设置为响应式
const columnsRef = toRef(props, 'columns')
// 表单数据模型
const { model, getModel, setModel, resetModel } = useFormModel(columnsRef)

/** 触发表单校验，返回是否通过 */
async function validate(): Promise<boolean> {
    try {
        await elFormRef.value?.validate()
        return true
    } catch {
        return false
    }
}

/** 清除校验状态 */
function clearValidate() {
    elFormRef.value?.clearValidate()
}

/** 获取 el-form 实例 */
function getElFormRef() {
    return elFormRef.value!
}

const formApi: FormApi = {
    getModel,
    setModel,
    resetModel,
    validate,
    clearValidate,
    getElFormRef,
}

const slots = useSlots()

createProFormContext({ model, formApi, slots })

defineExpose<ProFormExpose>({
    getModel,
    setModel,
    resetModel,
    validate,
    clearValidate,
    getElFormRef,
})
</script>

<template>
    <el-form
        ref="elFormRef"
        :model="model"
        :rules="rules"
        :label-width="labelWidth"
        :label-position="labelPosition"
        :inline="inline"
    >
        <el-row
            v-if="!inline"
            :gutter="gutter"
        >
            <el-col
                v-for="column in columns"
                :key="column.field"
                :span="column.span ?? colSpan"
            >
                <form-item :column="column" />
            </el-col>
        </el-row>
        <template v-else>
            <form-item
                v-for="column in columns"
                :key="column.field"
                :column="column"
            />
        </template>
    </el-form>
</template>
