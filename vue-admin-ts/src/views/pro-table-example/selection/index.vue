<script setup lang="ts">
import { h, ref } from 'vue'
import { ElTag, ElButton, ElMessage } from 'element-plus'
import ProTable from '@/components/pro-table/index.vue'
import type { ProTableColumn, TableApiFn, ProTableSearchConfig, ProTableExpose } from '@/components/pro-table/types'
import type { ProFormColumn } from '@/components/pro-form/types'

const tableRef = ref<ProTableExpose>()

/** 是否开启持久化 */
const persistEnabled = ref(true)

/** 表格列配置 */
const columns: ProTableColumn[] = [
    { field: 'id', label: 'ID', width: 80, align: 'center' },
    { field: 'name', label: '姓名', minWidth: 120 },
    { field: 'email', label: '邮箱', minWidth: 200 },
    {
        field: 'role',
        label: '角色',
        width: 120,
        align: 'center',
        formatter: (row) => {
            const map: Record<string, string> = { admin: '管理员', editor: '编辑者', guest: '访客' }
            return map[row.role] ?? row.role
        },
    },
    {
        field: 'department',
        label: '部门',
        width: 120,
        align: 'center',
    },
    {
        field: 'status',
        label: '状态',
        width: 100,
        align: 'center',
        render: ({ cellValue }) =>
            h(ElTag, { type: cellValue === 1 ? 'success' : 'danger', size: 'small' }, () =>
                cellValue === 1 ? '启用' : '禁用',
            ),
    },
    { field: 'createTime', label: '创建时间', minWidth: 180 },
]

/** 搜索配置 */
const searchColumns: ProFormColumn[] = [
    {
        field: 'name',
        label: '姓名',
        el: 'input',
        defaultValue: '',
        fieldProps: { placeholder: '请输入姓名', clearable: true },
    },
    {
        field: 'role',
        label: '角色',
        el: 'select',
        defaultValue: null,
        fieldProps: { placeholder: '请选择角色', clearable: true },
        options: [
            { label: '管理员', value: 'admin' },
            { label: '编辑者', value: 'editor' },
            { label: '访客', value: 'guest' },
        ],
    },
    {
        field: 'status',
        label: '状态',
        el: 'select',
        defaultValue: null,
        fieldProps: { placeholder: '请选择状态', clearable: true },
        options: [
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 },
        ],
    },
]

const search: ProTableSearchConfig = {
    columns: searchColumns,
    labelWidth: '80px',
}

/** 模拟用户数据 */
const departments = ['技术部', '产品部', '运营部', '市场部']

const mockUsers = Array.from({ length: 86 }, (_, i) => ({
    id: i + 1,
    name: `用户${String(i + 1).padStart(2, '0')}`,
    email: `user${String(i + 1).padStart(2, '0')}@example.com`,
    role: ['admin', 'editor', 'guest'][i % 3],
    department: departments[i % 4],
    status: i % 3 === 0 ? 0 : 1,
    createTime: `2025-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')} 10:00:00`,
}))

/** 模拟后端分页 + 搜索接口 */
const fetchUserList: TableApiFn = async (params) => {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const { page, pageSize, name, role, status } = params

    let filtered = [...mockUsers]

    if (name) {
        filtered = filtered.filter((u) => u.name.includes(name))
    }
    if (role != null) {
        filtered = filtered.filter((u) => u.role === role)
    }
    if (status != null) {
        filtered = filtered.filter((u) => u.status === status)
    }

    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
        data: filtered.slice(start, end),
        total: filtered.length,
    }
}

/** 批量删除 */
function handleBatchDelete() {
    const rows = tableRef.value?.getSelectedRows() ?? []
    if (rows.length === 0) {
        ElMessage.warning('请先选择数据')
        return
    }
    ElMessage.success(`已选中 ${rows.length} 条数据，执行批量删除`)
}

/** 查看选中 */
function handleShowSelected() {
    const rows = tableRef.value?.getSelectedRows() ?? []
    ElMessage.info(`当前选中 ${rows.length} 条：${rows.map((r) => r.name).join('、') || '无'}`)
}
</script>

<template>
    <div class="container">
        <ProTable
            ref="tableRef"
            :columns="columns"
            :api="fetchUserList"
            :search="search"
            selectable
            :default-selected-keys="[1, 3, 5]"
            :selection-persist="persistEnabled"
            selection-storage-key="pro-table-selection-demo"
        >
            <template #toolbar>
                <el-button
                    type="danger"
                    @click="handleBatchDelete"
                >
                    批量删除
                </el-button>
                <el-button @click="handleShowSelected"> 查看选中 </el-button>
            </template>
        </ProTable>
    </div>
</template>

<style scoped lang="scss">
.container {
    padding: 20px;
}
</style>
