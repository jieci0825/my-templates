<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { usePageForm } from '@/composables/use-page-form'
import type { ProFormColumn } from '@/components/pro-form/types'

const columns: ProFormColumn[] = [
    {
        field: 'userType',
        label: '用户类型',
        el: 'radio',
        defaultValue: 'personal',
        span: 24,
        options: [
            { label: '个人', value: 'personal' },
            { label: '企业', value: 'enterprise' },
        ],
    },
    {
        field: 'name',
        label: '姓名',
        el: 'input',
        defaultValue: '',
        fieldProps: { placeholder: '请输入姓名' },
        dependencies: {
            triggerFields: ['userType'],
            if: (values) => values.userType === 'personal',
        },
    },
    {
        field: 'idCard',
        label: '身份证号',
        el: 'input',
        defaultValue: '',
        fieldProps: { placeholder: '请输入身份证号' },
        dependencies: {
            triggerFields: ['userType'],
            if: (values) => values.userType === 'personal',
            required: (values) => values.userType === 'personal',
        },
    },
    {
        field: 'companyName',
        label: '企业名称',
        el: 'input',
        defaultValue: '',
        fieldProps: { placeholder: '请输入企业名称' },
        dependencies: {
            triggerFields: ['userType'],
            if: (values) => values.userType === 'enterprise',
            required: (values) => values.userType === 'enterprise',
        },
    },
    {
        field: 'taxNumber',
        label: '税号',
        el: 'input',
        defaultValue: '',
        fieldProps: { placeholder: '请输入纳税人识别号' },
        dependencies: {
            triggerFields: ['userType'],
            if: (values) => values.userType === 'enterprise',
        },
    },
    {
        field: 'contactPhone',
        label: '联系电话',
        el: 'input',
        defaultValue: '',
        fieldProps: { placeholder: '请输入联系电话' },
        dependencies: {
            triggerFields: ['userType'],
            componentProps: (values) => ({
                placeholder: values.userType === 'enterprise' ? '请输入企业联系电话' : '请输入个人手机号',
            }),
            rules: (values) => {
                if (values.userType === 'enterprise') {
                    return [{ pattern: /^\d{7,12}$/, message: '请输入正确的电话号码', trigger: 'blur' }]
                }
                return [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }]
            },
        },
    },
    {
        field: 'needInvoice',
        label: '需要发票',
        el: 'switch',
        defaultValue: false,
    },
    {
        field: 'invoiceTitle',
        label: '发票抬头',
        el: 'input',
        defaultValue: '',
        fieldProps: { placeholder: '请输入发票抬头' },
        dependencies: {
            triggerFields: ['needInvoice'],
            if: (values) => values.needInvoice === true,
            required: (values) => values.needInvoice === true,
        },
    },
    {
        field: 'invoiceType',
        label: '发票类型',
        el: 'select',
        defaultValue: null,
        fieldProps: { placeholder: '请选择发票类型' },
        options: [
            { label: '普通发票', value: 'normal' },
            { label: '增值税专用发票', value: 'vat' },
        ],
        dependencies: {
            triggerFields: ['needInvoice'],
            if: (values) => values.needInvoice === true,
        },
    },
    {
        field: 'invoiceEmail',
        label: '接收邮箱',
        el: 'input',
        defaultValue: '',
        fieldProps: { placeholder: '请输入接收发票的邮箱地址' },
        dependencies: {
            triggerFields: ['needInvoice', 'invoiceType'],
            show: (values) => values.needInvoice === true,
            disabled: (values) => !values.invoiceType,
            componentProps: (values) => ({
                placeholder: values.invoiceType ? '请输入接收发票的邮箱地址' : '请先选择发票类型',
            }),
        },
    },
    {
        field: 'remark',
        label: '备注',
        el: 'input',
        defaultValue: '',
        span: 24,
        fieldProps: { type: 'textarea', rows: 3, placeholder: '请输入备注信息（选填）' },
    },
]

const [PageForm] = usePageForm({
    columns,
    colSpan: 24,
    labelWidth: '100px',
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
