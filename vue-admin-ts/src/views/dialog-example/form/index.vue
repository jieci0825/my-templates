<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElMessage, ElRadio, ElRadioGroup, ElSwitch } from 'element-plus'
import { useFormDialog } from '@/composables/use-dialog'
import type { FormInstance } from 'element-plus'

interface UserForm {
    id?: number
    username: string
    nickname: string
    email: string
    gender: number
    enabled: boolean
}

const formRef = ref<FormInstance>()

const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    ],
}

const formDialog = useFormDialog<UserForm>({
    title: '用户管理',
    initialFormData: {
        username: '',
        nickname: '',
        email: '',
        gender: 1,
        enabled: true,
    },
    validate: () => formRef.value!.validate(),
    onSubmit: async (data, mode) => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (mode === 'create') {
            ElMessage.success(`新增成功：${JSON.stringify(data)}`)
        } else {
            ElMessage.success(`编辑成功：${JSON.stringify(data)}`)
        }
    },
    autoCloseOnSuccess: true,
})

const existingUser: UserForm = {
    id: 1,
    username: 'zhangsan',
    nickname: '张三',
    email: 'zhangsan@example.com',
    gender: 1,
    enabled: true,
}

function handleCreate() {
    formDialog.openCreate({ gender: 1, enabled: true }, '新增用户')
}

function handleEdit() {
    formDialog.openEdit(existingUser, '编辑用户')
}
</script>

<template>
    <div class="container">
        <el-card>
            <template #header>
                <span>表单弹窗示例</span>
            </template>

            <div class="button-group">
                <el-button type="primary" @click="handleCreate">
                    新增用户
                </el-button>
                <el-button type="warning" @click="handleEdit">
                    编辑用户
                </el-button>
            </div>

            <div class="info-box">
                <p><strong>当前模式：</strong>{{ formDialog.mode === 'create' ? '新增' : '编辑' }}</p>
                <p><strong>提交状态：</strong>{{ formDialog.loading ? '提交中...' : '未提交' }}</p>
            </div>
        </el-card>

        <!-- 表单弹窗 -->
        <el-dialog
            v-model="formDialog.state.visible"
            :title="formDialog.state.title"
            width="600px"
            :close-on-click-modal="false"
        >
            <el-form
                ref="formRef"
                :model="formDialog.formData"
                :rules="rules"
                label-width="80px"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input
                        v-model="formDialog.formData.username"
                        placeholder="请输入用户名"
                        :disabled="formDialog.mode === 'edit'"
                    />
                </el-form-item>

                <el-form-item label="昵称" prop="nickname">
                    <el-input
                        v-model="formDialog.formData.nickname"
                        placeholder="请输入昵称"
                    />
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input
                        v-model="formDialog.formData.email"
                        placeholder="请输入邮箱"
                    />
                </el-form-item>

                <el-form-item label="性别">
                    <el-radio-group v-model="formDialog.formData.gender">
                        <el-radio :value="1">男</el-radio>
                        <el-radio :value="2">女</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="启用状态">
                    <el-switch v-model="formDialog.formData.enabled" />
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="formDialog.close()">
                    取消
                </el-button>
                <el-button
                    type="primary"
                    :loading="formDialog.loading"
                    @click="formDialog.submit()"
                >
                    提交
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped>
.button-group {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
}

.info-box {
    margin-top: 20px;
    padding: 16px;
    background-color: var(--el-fill-color-light);
    border-radius: 4px;
}

.info-box p {
    margin: 8px 0;
}
</style>
