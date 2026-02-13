<script setup lang="ts">
import { ref, toRef } from 'vue'
import type { TableInstance } from 'element-plus'
import type { ProTableProps, ProTableExpose } from './types'
import { useTableColumns } from './hooks/use-table-columns'
import { useTableData } from './hooks/use-table-data'
import TableColumn from './components/table-column.vue'
import SearchForm from './components/search-form.vue'

defineOptions({ name: 'ProTable' })

const props = withDefaults(defineProps<ProTableProps>(), {
    immediate: true,
    selectable: false,
})

const elTableRef = ref<TableInstance>()

// 搜索参数
const searchModel = ref<Record<string, any>>({})

// 列处理
const { visibleColumns } = useTableColumns(toRef(props, 'columns'))

// 数据请求与分页
const { data, loading, pagination, refresh, reload, handlePageChange, handleSizeChange } = useTableData({
    api: props.api,
    paginationConfig: props.pagination,
    immediate: props.immediate,
    responseMapping: props.responseMapping,
    getSearchModel: () => searchModel.value,
})

// 分页配置
const paginationHidden = props.pagination?.hidden ?? false
const pageSizes = props.pagination?.pageSizes ?? [10, 20, 50, 100]

/** 搜索：存储搜索参数，重置到第一页并请求 */
function handleSearch(model: Record<string, any>) {
    searchModel.value = model
    reload()
}

/** 重置：清空搜索参数，重置到第一页并请求 */
function handleReset() {
    searchModel.value = {}
    reload()
}

defineExpose<ProTableExpose>({
    refresh,
    reload,
    getSelectedRows: () => [],
    clearSelection: () => {},
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

        <!-- 表格 -->
        <el-table
            ref="elTableRef"
            v-loading="loading"
            :data="data"
            v-bind="tableProps"
        >
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
        justify-content: flex-end;
        padding-top: 16px;
    }
}
</style>
