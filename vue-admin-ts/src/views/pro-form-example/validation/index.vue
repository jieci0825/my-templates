<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { usePageForm } from '@/composables/use-page-form'
import type { ProFormColumn } from '@/components/pro-form/types'
import type { FormRules } from 'element-plus'

const columns: ProFormColumn[] = [
    {
        field: 'username',
        label: '用户名',
        el: 'input',
        defaultValue: '',
        fieldProps: { placeholder: '请输入用户名（3-20个字符）' },
    },
    {
        field: 'email',
        label: '邮箱',
        el: 'input',
        defaultValue: '',
        fieldProps: { placeholder: '请输入邮箱地址' },
    },
    {
        field: 'phone',
        label: '手机号',
        el: 'input',
        defaultValue: '',
        fieldProps: { placeholder: '请输入手机号' },
    },
    {
        field: 'age',
        label: '年龄',
        el: 'input-number',
        defaultValue: null,
        fieldProps: { min: 0, max: 120, placeholder: '请输入年龄' },
    },
    {
        field: 'password',
        label: '密码',
        el: 'input',
        defaultValue: '',
        fieldProps: { type: 'password', placeholder: '请输入密码（至少6位）', showPassword: true },
    },
    {
        field: 'confirmPassword',
        label: '确认密码',
        el: 'input',
        defaultValue: '',
        fieldProps: { type: 'password', placeholder: '请再次输入密码', showPassword: true },
    },
    {
        field: 'website',
        label: '个人网站',
        el: 'input',
        defaultValue: '',
        fieldProps: { placeholder: '请输入网站地址（选填）' },
    },
    {
        field: 'agreement',
        label: '用户协议',
        el: 'switch',
        defaultValue: false,
    },
]

const rules: FormRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度应为 3-20 个字符', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    ],
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' },
    ],
    age: [
        { required: true, message: '请输入年龄', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' },
    ],
    confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        {
            validator: (_, value, callback) => {
                const model = formApi.getModel()
                if (value !== model.password) {
                    callback(new Error('两次输入的密码不一致'))
                } else {
                    callback()
                }
            },
            trigger: 'blur',
        },
    ],
    website: [
        { type: 'url', message: '请输入正确的网址格式', trigger: 'blur' },
    ],
    agreement: [
        {
            validator: (_, value, callback) => {
                if (!value) {
                    callback(new Error('请同意用户协议'))
                } else {
                    callback()
                }
            },
            trigger: 'change',
        },
    ],
}

const [PageForm, formApi] = usePageForm({
    columns,
    rules,
    colSpan: 24,
    labelWidth: '100px',
    onSubmit(model) {
        ElMessage.success(`校验通过，提交数据：${JSON.stringify(model)}`)
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
