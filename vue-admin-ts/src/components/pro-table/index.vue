<script setup lang="ts">
import { ref, computed, toRef } from 'vue'
import type { TableInstance } from 'element-plus'
import type { ProTableProps, ProTableExpose } from './types'
import { useTableColumns } from './hooks/use-table-columns'
import { useTableData } from './hooks/use-table-data'
import { useTableSelection } from './hooks/use-table-selection'
import TableColumn from './components/table-column.vue'
import SearchForm from './components/search-form.vue'
import Toolbar from './components/toolbar.vue'

defineOptions({ name: 'ProTable' })

const props = withDefaults(defineProps<ProTableProps>(), {
    immediate: true,
    selectable: false,
    rowKey: 'id',
    selectionPersist: false,
})

const elTableRef = ref<TableInstance>()

// ---- 选择配置 ----

const storageKey = computed(() => {
    if (!props.selectionPersist) return undefined
    return props.selectionStorageKey ?? `pro-table-selection-${window.location.pathname}`
})

// ---- 搜索参数 ----

const searchModel = ref<Record<string, any>>({})

// ---- 列处理 ----

const { visibleColumns } = useTableColumns(toRef(props, 'columns'))

// ---- 数据请求与分页 ----

const { data, loading, pagination, refresh, reload, handlePageChange, handleSizeChange } = useTableData({
    api: props.api,
    paginationConfig: props.pagination,
    immediate: props.immediate,
    responseMapping: props.responseMapping,
    getSearchModel: () => searchModel.value,
})

// ---- 行选择 ----

const { selectedCount, handleSelect, handleSelectAll, getSelectedRows, clearSelection } = useTableSelection({
    tableRef: elTableRef,
    data,
    rowKey: props.rowKey,
    persist: props.selectionPersist,
    storageKey: storageKey.value,
    defaultSelectedKeys: props.defaultSelectedKeys,
})

// ---- 分页配置 ----

const paginationHidden = props.pagination?.hidden ?? false
const pageSizes = props.pagination?.pageSizes ?? [10, 20, 50, 100]

// ---- 搜索 / 重置 ----

function handleSearch(model: Record<string, any>) {
    searchModel.value = model
    reload()
}

function handleReset() {
    searchModel.value = {}
    reload()
}

// ---- 暴露 API ----

defineExpose<ProTableExpose>({
    refresh,
    reload,
    getSelectedRows,
    clearSelection,
    getSearchModel: () => searchModel.value,
    getElTableRef: () => elTableRef.value!,
})
</script>

<template>
    <div class="pro-table">
        <!-- 搜索区域 -->
        <SearchForm
            v-if="search"
            :config="search"
            @search="handleSearch"
            @reset="handleReset"
        />

        <!-- 工具栏 -->
        <Toolbar @refresh="refresh">
            <template #toolbar>
                <slot name="toolbar" />
            </template>
        </Toolbar>

        <!-- 表格 -->
        <el-table
            ref="elTableRef"
            v-loading="loading"
            :data="data"
            :row-key="selectable ? rowKey : undefined"
            v-bind="tableProps"
            @select="handleSelect"
            @select-all="handleSelectAll"
        >
            <!-- 多选列 -->
            <el-table-column
                v-if="selectable"
                type="selection"
                width="50"
                align="center"
                :reserve-selection="false"
            />

            <TableColumn
                v-for="column in visibleColumns"
                :key="column.field"
                :column="column"
            >
                <template
                    v-if="column.slot"
                    #default="scope"
                >
                    <slot
                        :name="column.slot"
                        v-bind="scope"
                    />
                </template>
            </TableColumn>
        </el-table>

        <!-- 分页 -->
        <div
            v-if="!paginationHidden"
            class="pro-table__pagination"
        >
            <div class="pro-table__pagination-info">
                <span v-if="selectable && selectedCount > 0">
                    已选 {{ selectedCount }} 项
                    <el-button
                        type="primary"
                        link
                        @click="clearSelection"
                    >
                        清空
                    </el-button>
                </span>
            </div>
            <el-pagination
                :current-page="pagination.page"
                :page-size="pagination.pageSize"
                :total="pagination.total"
                :page-sizes="pageSizes"
                background
                layout="total, sizes, prev, pager, next, jumper"
                @current-change="handlePageChange"
                @size-change="handleSizeChange"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
.pro-table {
    &__pagination {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 16px;
    }

    &__pagination-info {
        font-size: 14px;
        color: var(--el-text-color-regular);
    }
}
</style>
