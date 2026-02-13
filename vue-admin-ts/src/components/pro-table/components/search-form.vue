<script setup lang="ts">
import { ref, computed, useSlots } from 'vue'
import type { FormInstance } from 'element-plus'
import type { FormApi } from '@/components/pro-form/types'
import type { ProTableSearchConfig } from '../types'
import type { BreakPoint } from '@/components/grid/types'
import { useFormModel } from '@/components/pro-form/hooks/use-form-model'
import { createProFormContext } from '@/components/pro-form/context'
import FormItem from '@/components/pro-form/components/form-item.vue'
import Grid from '@/components/grid/index.vue'
import GridItem from '@/components/grid/components/grid-item.vue'
import IconChevronDown from '~icons/mdi/chevron-down'

interface Props {
    config: ProTableSearchConfig
}

interface Emits {
    (e: 'search', model: Record<string, any>): void
    (e: 'reset'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// ---- 栅格配置 ----

const searchCol = computed(() => props.config.searchCol ?? { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 })
const gap = computed(() => props.config.gap ?? ([20, 0] as [number, number]))
const isCollapsible = computed(() => props.config.defaultCollapsedRows !== false)
const collapsedRows = computed(() => {
    const val = props.config.defaultCollapsedRows
    return typeof val === 'number' ? val : 1
})

// ---- 折叠状态 ----

const collapsed = ref(true)
const effectiveCollapsed = computed(() => {
    if (!isCollapsible.value) return false
    return collapsed.value
})

// ---- 展开/收起按钮显隐 ----

const gridRef = ref<InstanceType<typeof Grid>>()
const breakPoint = computed<BreakPoint>(() => gridRef.value?.breakPoint ?? 'xl')

const showToggle = computed(() => {
    if (!isCollapsible.value) return false
    const bp = breakPoint.value
    const col = searchCol.value
    const cols = typeof col === 'object' ? (col[bp] ?? 4) : col
    const totalSpan = props.config.columns.reduce((sum, c) => sum + (c.span ?? 1), 0)
    return totalSpan > collapsedRows.value * cols - 1
})

// ---- 表单逻辑（复用 ProForm 的 model 管理和上下文） ----

const elFormRef = ref<FormInstance>()
const columnsRef = computed(() => props.config.columns)
const { model, getModel, setModel, resetModel } = useFormModel(columnsRef)

function clearValidate() {
    elFormRef.value?.clearValidate()
}

const formApi: FormApi = {
    getModel,
    setModel,
    resetModel,
    validate: async () => {
        try {
            await elFormRef.value?.validate()
            return true
        } catch {
            return false
        }
    },
    clearValidate,
    getElFormRef: () => elFormRef.value!,
}

const slots = useSlots()
createProFormContext({ model, formApi, slots })

// ---- 搜索 / 重置 / 折叠 ----

function handleSearch() {
    emit('search', getModel())
}

function handleReset() {
    resetModel()
    clearValidate()
    emit('reset')
}

function toggleCollapse() {
    collapsed.value = !collapsed.value
}

defineExpose({ getModel })
</script>

<template>
    <div class="pro-table-search">
        <el-form
            ref="elFormRef"
            :model="model"
            :label-width="config.labelWidth"
        >
            <Grid
                ref="gridRef"
                :collapsed="effectiveCollapsed"
                :collapsed-rows="collapsedRows"
                :cols="searchCol"
                :gap="gap"
            >
                <GridItem
                    v-for="(column, index) in config.columns"
                    :key="column.field"
                    :span="column.span ?? 1"
                    :index="index"
                >
                    <FormItem :column="column" />
                </GridItem>

                <!-- 标记为后缀，表示不参与折叠计算 -->
                <GridItem suffix>
                    <div class="pro-table-search__actions">
                        <el-button @click="handleReset"> 重置 </el-button>
                        <el-button
                            type="primary"
                            @click="handleSearch"
                        >
                            查询
                        </el-button>
                        <el-button
                            v-if="showToggle"
                            link
                            type="primary"
                            @click="toggleCollapse"
                        >
                            {{ collapsed ? '展开' : '收起' }}
                            <el-icon
                                class="pro-table-search__toggle-icon"
                                :class="{ 'is-expanded': !collapsed }"
                            >
                                <IconChevronDown />
                            </el-icon>
                        </el-button>
                    </div>
                </GridItem>
            </Grid>
        </el-form>
    </div>
</template>

<style scoped lang="scss">
.pro-table-search {
    margin-bottom: 16px;
    padding: 18px 18px 0;
    background-color: var(--el-bg-color);
    border-radius: 4px;
    border: 1px solid var(--el-border-color-lighter);

    &__actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: var(--el-component-size, 32px);
        margin-bottom: 18px;
    }

    &__toggle-icon {
        margin-left: 2px;
        transition: transform 0.3s;

        &.is-expanded {
            transform: rotate(180deg);
        }
    }
}
</style>
