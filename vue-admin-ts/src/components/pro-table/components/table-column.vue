<script lang="ts">
import { defineComponent } from 'vue'

/** 渲染函数单元格 */
const CellRenderer = defineComponent({
    props: {
        render: { type: Function, required: true },
        scope: { type: Object, required: true },
    },
    setup(props) {
        return () => (props.render as any)(props.scope)
    },
})

export default { components: { CellRenderer } }
</script>

<script setup lang="ts">
import { useSlots } from 'vue'
import type { ProTableColumn } from '../types'

defineProps<{
    column: ProTableColumn
}>()

const slots = useSlots()
</script>

<template>
    <el-table-column
        :prop="column.field"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :fixed="column.fixed"
        :align="column.align"
        v-bind="column.columnProps"
    >
        <template #default="{ row, $index }">
            <slot
                v-if="slots.default"
                :row="row"
                :cell-value="row[column.field]"
                :row-index="$index"
            />
            <CellRenderer
                v-else-if="column.render"
                :render="column.render"
                :scope="{ row, cellValue: row[column.field], rowIndex: $index }"
            />
            <span v-else-if="column.formatter">
                {{ column.formatter(row, row[column.field], $index) }}
            </span>
            <span v-else>{{ row[column.field] }}</span>
        </template>
    </el-table-column>
</template>
