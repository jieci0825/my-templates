<script setup lang="ts">
import { h } from 'vue'
import { ElTag } from 'element-plus'
import ProTable from '@/components/pro-table/index.vue'
import type { ProTableColumn, TableApiFn, ProTableSearchConfig } from '@/components/pro-table/types'
import type { ProFormColumn } from '@/components/pro-form/types'

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

/** 搜索区域配置（6 个字段，默认折叠为 1 行） */
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
    {
        field: 'department',
        label: '部门',
        el: 'select',
        defaultValue: null,
        fieldProps: { placeholder: '请选择部门', clearable: true },
        options: [
            { label: '技术部', value: '技术部' },
            { label: '产品部', value: '产品部' },
            { label: '运营部', value: '运营部' },
            { label: '市场部', value: '市场部' },
        ],
    },
    {
        field: 'email',
        label: '邮箱',
        el: 'input',
        defaultValue: '',
        fieldProps: { placeholder: '请输入邮箱', clearable: true },
    },
    {
        field: 'createTime',
        label: '创建时间',
        el: 'date-picker',
        span: 2,
        defaultValue: null,
        fieldProps: {
            type: 'daterange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'YYYY-MM-DD',
        },
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

    const { page, pageSize, name, role, status, department, email, createTime } = params

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
    if (department) {
        filtered = filtered.filter((u) => u.department === department)
    }
    if (email) {
        filtered = filtered.filter((u) => u.email.includes(email))
    }
    if (Array.isArray(createTime) && createTime.length === 2) {
        const [start, end] = createTime
        filtered = filtered.filter((u) => u.createTime >= start && u.createTime <= `${end} 23:59:59`)
    }

    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
        data: filtered.slice(start, end),
        total: filtered.length,
    }
}
</script>

<template>
    <div class="container">
        <ProTable
            :columns="columns"
            :api="fetchUserList"
            :search="search"
        />
    </div>
</template>

<style scoped lang="scss">
.container {
    padding: 20px;
}
</style>
