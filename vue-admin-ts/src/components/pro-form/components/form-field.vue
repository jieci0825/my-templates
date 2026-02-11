<script setup lang="ts">
import { computed } from 'vue'
import type { ProFormColumn } from '../types'
import { useProFormContext } from '../context'
import { useFormOptions } from '../hooks/use-form-options'

defineOptions({ name: 'ProFormField' })

const props = defineProps<{
    column: ProFormColumn
    /** 由 form-item 合并联动状态后传入，优先于 column.fieldProps */
    fieldProps?: Record<string, any>
}>()

const { model } = useProFormContext()

const optionsConfig = computed(() => props.column.options)
const fieldNamesConfig = computed(() => props.column.fieldNames)
const { resolvedOptions, loading } = useFormOptions(optionsConfig, fieldNamesConfig)

/** 最终生效的 fieldProps：优先使用 form-item 传入的合并版本 */
const actualFieldProps = computed(() => props.fieldProps ?? props.column.fieldProps ?? {})
</script>

<template>
    <!-- Input -->
    <el-input
        v-if="!column.el || column.el === 'input'"
        v-model="model[column.field]"
        v-bind="actualFieldProps"
    />

    <!-- InputNumber -->
    <el-input-number
        v-else-if="column.el === 'input-number'"
        v-model="model[column.field]"
        v-bind="actualFieldProps"
    />

    <!-- Select -->
    <el-select
        v-else-if="column.el === 'select'"
        v-model="model[column.field]"
        :loading="loading"
        v-bind="actualFieldProps"
    >
        <el-option
            v-for="opt in resolvedOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
            :disabled="opt.disabled"
        />
    </el-select>

    <!-- TreeSelect -->
    <el-tree-select
        v-else-if="column.el === 'tree-select'"
        v-model="model[column.field]"
        :data="resolvedOptions"
        :loading="loading"
        v-bind="actualFieldProps"
    />

    <!-- DatePicker -->
    <el-date-picker
        v-else-if="column.el === 'date-picker'"
        v-model="model[column.field]"
        v-bind="actualFieldProps"
    />

    <!-- Switch -->
    <el-switch
        v-else-if="column.el === 'switch'"
        v-model="model[column.field]"
        v-bind="actualFieldProps"
    />

    <!-- RadioGroup -->
    <el-radio-group
        v-else-if="column.el === 'radio'"
        v-model="model[column.field]"
        v-bind="actualFieldProps"
    >
        <el-radio
            v-for="opt in resolvedOptions"
            :key="opt.value"
            :value="opt.value"
            :disabled="opt.disabled"
        >
            {{ opt.label }}
        </el-radio>
    </el-radio-group>

    <!-- CheckboxGroup -->
    <el-checkbox-group
        v-else-if="column.el === 'checkbox'"
        v-model="model[column.field]"
        v-bind="actualFieldProps"
    >
        <el-checkbox
            v-for="opt in resolvedOptions"
            :key="opt.value"
            :value="opt.value"
            :disabled="opt.disabled"
        >
            {{ opt.label }}
        </el-checkbox>
    </el-checkbox-group>
</template>
