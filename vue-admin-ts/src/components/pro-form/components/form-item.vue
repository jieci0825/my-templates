<script setup lang="ts">
import { computed, toRef } from 'vue'
import type { ProFormColumn } from '../types'
import { useProFormContext } from '../context'
import { useFormDeps } from '../hooks/use-form-deps'
import { isFunction } from '@/utils'
import FormField from './form-field.vue'

defineOptions({ name: 'ProFormItem' })

const props = defineProps<{
    column: ProFormColumn
}>()

const { model, formApi, slots: proFormSlots } = useProFormContext()
const columnRef = toRef(props, 'column')

const {
    shouldRender: depsShouldRender,
    shouldShow: depsShouldShow,
    isDisabled,
    dynamicRules,
    isRequired,
    dynamicComponentProps,
} = useFormDeps(columnRef, model, formApi)

/** 简单 hidden 计算 */
const isHidden = computed(() => {
    const { hidden } = props.column
    if (isFunction(hidden)) {
        return hidden(model)
    }
    return !!hidden
})

/** 最终是否渲染：dependencies.if 优先于 hidden */
const shouldRender = computed(() => {
    if (props.column.dependencies?.if) {
        return depsShouldRender.value
    }
    return !isHidden.value
})

/** 最终是否可见：仅由 dependencies.show 控制 */
const shouldShow = computed(() => {
    if (props.column.dependencies?.show) {
        return depsShouldShow.value
    }
    return true
})

/** 合并联动产生的 formItemProps 覆盖项（rules / required） */
const formItemOverrides = computed(() => {
    const overrides: Record<string, any> = {}
    const deps = props.column.dependencies

    if (deps?.rules || deps?.required) {
        const base = props.column.formItemProps?.rules
        const baseArray = Array.isArray(base) ? base : base ? [base] : []
        const requiredRules = isRequired.value
            ? [{ required: true, message: `${props.column.label}不能为空` }]
            : []
        overrides.rules = [...baseArray, ...dynamicRules.value, ...requiredRules]
    }

    if (deps?.required) {
        overrides.required = isRequired.value
    }

    return overrides
})

/** 合并后的 el-form-item 绑定 */
const formItemBindings = computed(() => ({
    ...props.column.formItemProps,
    ...formItemOverrides.value,
}))

/** 合并后传递给 form-field 的 fieldProps（基础 + disabled + 动态 componentProps） */
const mergedFieldProps = computed(() => {
    const base = { ...props.column.fieldProps }

    if (props.column.dependencies?.disabled && isDisabled.value) {
        base.disabled = true
    }

    if (props.column.dependencies?.componentProps) {
        Object.assign(base, dynamicComponentProps.value)
    }

    return base
})
</script>

<template>
    <el-form-item
        v-if="shouldRender"
        v-show="shouldShow"
        v-bind="formItemBindings"
        :label="column.label"
        :prop="column.field"
    >
        <!-- 具名插槽：优先级最高 -->
        <component
            v-if="column.slot && proFormSlots[column.slot]"
            :is="() => proFormSlots[column.slot!]!({ model })"
        />
        <!-- 渲染函数 -->
        <component
            v-else-if="column.render"
            :is="() => column.render!({ model })"
        />
        <!-- 默认：表单控件 -->
        <FormField
            v-else
            :column="column"
            :field-props="mergedFieldProps"
        />
    </el-form-item>
</template>
