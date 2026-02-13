<script setup lang="ts">
import { h } from 'vue'
import { ElMessage, ElTag, ElRate, ElSlider } from 'element-plus'
import { usePageForm } from '@/composables/use-page-form'
import type { ProFormColumn } from '@/components/pro-form/types'

const columns: ProFormColumn[] = [
    {
        field: 'name',
        label: '名称',
        el: 'input',
        defaultValue: '',
        fieldProps: { placeholder: '请输入名称' },
    },
    {
        field: 'category',
        label: '分类',
        el: 'select',
        defaultValue: null,
        fieldProps: { placeholder: '请选择分类' },
        options: [
            { label: '前端', value: 'frontend' },
            { label: '后端', value: 'backend' },
            { label: '设计', value: 'design' },
        ],
    },
    {
        field: 'rating',
        label: '评分',
        render: ({ model }) => {
            return h(ElRate, {
                modelValue: model.rating,
                'onUpdate:modelValue': (val: number) => {
                    model.rating = val
                },
                allowHalf: true,
                showText: true,
                texts: ['极差', '失望', '一般', '满意', '惊喜'],
            })
        },
        defaultValue: 0,
    },
    {
        field: 'progress',
        label: '进度',
        render: ({ model }) => {
            return h(ElSlider, {
                modelValue: model.progress,
                'onUpdate:modelValue': (val: number | number[]) => {
                    model.progress = val
                },
                showInput: true,
            })
        },
        defaultValue: 0,
    },
    {
        field: 'tags',
        label: '标签',
        slot: 'tags',
        defaultValue: [] as string[],
        span: 24,
    },
    {
        field: 'description',
        label: '详细描述',
        slot: 'description',
        defaultValue: '',
        span: 24,
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

const tagOptions = ['Vue', 'React', 'Angular', 'TypeScript', 'Node.js', 'Go', 'Rust']

function toggleTag(model: Record<string, any>, tag: string) {
    const tags: string[] = model.tags ?? []
    const idx = tags.indexOf(tag)
    if (idx === -1) {
        model.tags = [...tags, tag]
    } else {
        model.tags = tags.filter((t: string) => t !== tag)
    }
}
</script>

<template>
    <div class="container">
        <PageForm>
            <template #tags="{ model }">
                <div class="tag-selector">
                    <ElTag
                        v-for="tag in tagOptions"
                        :key="tag"
                        :type="model.tags?.includes(tag) ? 'primary' : undefined"
                        :effect="model.tags?.includes(tag) ? 'dark' : 'plain'"
                        class="tag-item"
                        @click="toggleTag(model, tag)"
                    >
                        {{ tag }}
                    </ElTag>
                </div>
            </template>

            <template #description="{ model }">
                <el-input
                    v-model="model.description"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入详细描述..."
                    show-word-limit
                    :maxlength="500"
                />
            </template>
        </PageForm>
    </div>
</template>

<style scoped lang="scss">
.tag-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tag-item {
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        transform: scale(1.05);
    }
}
</style>
