<script setup lang="ts">
import { ref } from 'vue'
import type { FormRules } from 'element-plus'
import type { ProFormColumn, ProFormExpose } from '@/components/pro-form/types'

const formRef = ref<ProFormExpose | null>(null)
const lastValues = ref<Record<string, any> | null>(null)

const columns: ProFormColumn[] = [
    {
        field: 'name',
        label: '姓名',
        defaultValue: '',
        fieldProps: { placeholder: '请输入姓名', clearable: true },
    },
    {
        field: 'keyword',
        label: '关键字',
        defaultValue: '',
        fieldProps: { placeholder: '输入 show 以展示高级项', clearable: true },
    },
]

const rules: FormRules = {
    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
}

async function onValidateAndGet() {
    const ok = await formRef.value?.validate()
    if (!ok) return
    lastValues.value = formRef.value?.getModel() ?? null
}

function onReset() {
    formRef.value?.resetModel()
    formRef.value?.clearValidate()
    lastValues.value = null
}

function onFillDemo() {
    formRef.value?.setModel({
        name: '张三',
        keyword: 'show',
        advanced: '这是回填的高级项',
    })
    lastValues.value = formRef.value?.getModel() ?? null
}
</script>

<template>
    <div class="container">
        <h1>Dashboard</h1>

        <div class="panel">
            <ProForm
                ref="formRef"
                :columns="columns"
                :rules="rules"
                label-width="90px"
            />

            <div class="actions">
                <el-button
                    type="primary"
                    @click="onValidateAndGet"
                    >校验并获取数据</el-button
                >
                <el-button @click="onReset">重置</el-button>
                <el-button @click="onFillDemo">回填示例</el-button>
            </div>

            <div
                v-if="lastValues"
                class="result"
            >
                <div class="result-title">getModel() 结果</div>
                <pre class="result-pre">{{ JSON.stringify(lastValues, null, 2) }}</pre>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    padding: 16px;
}

.panel {
    max-width: 720px;
}

.actions {
    margin-top: 12px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.result {
    margin-top: 12px;
}

.result-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
}

.result-pre {
    margin: 0;
    padding: 12px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.04);
    overflow: auto;
}
</style>
