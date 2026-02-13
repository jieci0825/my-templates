<script setup lang="ts">
import { h } from 'vue'
import { ElTag } from 'element-plus'
import { usePageTable } from '@/composables/use-page-table'
import type { ProTableColumn, TableApiFn } from '@/components/pro-table/types'

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

/** 模拟用户数据 */
const mockUsers = Array.from({ length: 86 }, (_, i) => ({
    id: i + 1,
    name: `用户${String(i + 1).padStart(2, '0')}`,
    email: `user${String(i + 1).padStart(2, '0')}@example.com`,
    role: ['admin', 'editor', 'guest'][i % 3],
    status: i % 3 === 0 ? 0 : 1,
    createTime: `2025-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')} 10:00:00`,
}))

/** 模拟后端分页接口 */
const fetchUserList: TableApiFn = async (params) => {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const { page, pageSize } = params
    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
        data: mockUsers.slice(start, end),
        total: mockUsers.length,
    }
}

const [UserTable] = usePageTable({
    columns,
    api: fetchUserList,
})
</script>

<template>
    <div class="container">
        <UserTable />
    </div>
</template>
