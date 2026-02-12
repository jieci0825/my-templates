<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { usePageForm } from '@/composables/use-page-form'
import type { ProFormColumn } from '@/components/pro-form/types'

const columns: ProFormColumn[] = [
    {
        field: 'username',
        label: '用户名',
        el: 'input',
        defaultValue: '',
        fieldProps: { placeholder: '请输入用户名' },
    },
    {
        field: 'nickname',
        label: '昵称',
        el: 'input',
        defaultValue: '',
        fieldProps: { placeholder: '请输入昵称' },
    },
    {
        field: 'age',
        label: '年龄',
        el: 'input-number',
        defaultValue: 18,
        fieldProps: { min: 0, max: 120 },
    },
    {
        field: 'gender',
        label: '性别',
        el: 'radio',
        defaultValue: 1,
        options: [
            { label: '男', value: 1 },
            { label: '女', value: 2 },
        ],
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
        field: 'department',
        label: '部门',
        el: 'tree-select',
        defaultValue: null,
        fieldProps: { placeholder: '请选择部门', clearable: true },
        options: [
            {
                label: '技术部',
                value: 'tech',
                children: [
                    { label: '前端组', value: 'frontend' },
                    { label: '后端组', value: 'backend' },
                ],
            },
            {
                label: '产品部',
                value: 'product',
                children: [
                    { label: '设计组', value: 'design' },
                    { label: '运营组', value: 'operation' },
                ],
            },
        ],
    },
    {
        field: 'birthday',
        label: '生日',
        el: 'date-picker',
        defaultValue: null,
        fieldProps: { placeholder: '请选择日期', valueFormat: 'YYYY-MM-DD' },
    },
    {
        field: 'enabled',
        label: '启用状态',
        el: 'switch',
        defaultValue: true,
    },
    {
        field: 'hobbies',
        label: '爱好',
        el: 'checkbox',
        defaultValue: [],
        options: [
            { label: '阅读', value: 'reading' },
            { label: '音乐', value: 'music' },
            { label: '运动', value: 'sports' },
            { label: '旅行', value: 'travel' },
        ],
    },
]

const [PageForm] = usePageForm({
    columns,
    colSpan: 12,
    labelWidth: '80px',
    onSubmit(model) {
        ElMessage.success(`提交数据：${JSON.stringify(model)}`)
    },
})
</script>

<template>
    <div class="container">
        <PageForm />
    </div>
</template>

<style scoped lang="scss">
.container {
    padding: 20px;
}
</style>
