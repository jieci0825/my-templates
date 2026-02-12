<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { usePageForm } from '@/composables/use-page-form'
import type { ProFormColumn } from '@/components/pro-form/types'

const columns: ProFormColumn[] = [
    {
        field: 'title',
        label: '标题',
        el: 'input',
        defaultValue: '',
        span: 24,
        fieldProps: { placeholder: '请输入标题' },
    },
    {
        field: 'avatar',
        label: '头像',
        el: 'image-upload',
        defaultValue: [],
        span: 24,
        fieldProps: {
            limit: 1,
            maxSize: 2,
        },
    },
    {
        field: 'gallery',
        label: '图片集',
        el: 'image-upload',
        defaultValue: [],
        span: 24,
        fieldProps: {
            limit: 5,
            maxSize: 5,
        },
    },
    {
        field: 'attachments',
        label: '附件',
        el: 'file-upload',
        defaultValue: [],
        span: 24,
        fieldProps: {
            limit: 3,
            maxSize: 10,
            accept: '.pdf,.doc,.docx,.xls,.xlsx',
        },
    },
    {
        field: 'description',
        label: '描述',
        el: 'input',
        defaultValue: '',
        span: 24,
        fieldProps: { type: 'textarea', rows: 3, placeholder: '请输入描述信息' },
    },
]

const [PageForm] = usePageForm({
    columns,
    colSpan: 24,
    labelWidth: '80px',
    onSubmit(model) {
        const info = {
            title: model.title,
            avatarCount: model.avatar?.length ?? 0,
            galleryCount: model.gallery?.length ?? 0,
            attachmentCount: model.attachments?.length ?? 0,
            description: model.description,
        }
        ElMessage.success(`提交数据：${JSON.stringify(info)}`)
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
