<script setup lang="ts">
import { ElButton, ElDialog, ElMessage } from 'element-plus'
import { useDialog } from '@/composables/use-dialog'

interface UserInfo {
    id: number
    name: string
    email: string
}

const dialog1 = useDialog({
    title: '提示',
    onOpened: () => {
        ElMessage.info('弹窗已打开')
    },
    onClosed: () => {
        ElMessage.info('弹窗已关闭')
    },
})

const dialog2 = useDialog<UserInfo>({
    title: '用户详情',
    onBeforeOpen: (data) => {
        if (!data) {
            ElMessage.warning('数据不能为空')
            return false
        }
    },
})

const userInfo: UserInfo = {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
}

function handleOpenSimple() {
    dialog1.open()
}

function handleOpenWithData() {
    dialog2.open(userInfo, '用户信息')
}

function handleOpenWithCustomTitle() {
    dialog1.open(undefined, '自定义标题')
}
</script>

<template>
    <div class="container">
        <el-card>
            <template #header>
                <span>基础弹窗示例</span>
            </template>

            <div class="button-group">
                <el-button type="primary" @click="handleOpenSimple">
                    打开简单弹窗
                </el-button>
                <el-button type="success" @click="handleOpenWithData">
                    打开带数据弹窗
                </el-button>
                <el-button type="info" @click="handleOpenWithCustomTitle">
                    自定义标题
                </el-button>
            </div>
        </el-card>

        <!-- 简单弹窗 -->
        <el-dialog
            v-model="dialog1.state.visible"
            :title="dialog1.state.title"
            width="500px"
        >
            <p>这是一个简单的弹窗内容</p>
            <template #footer>
                <el-button @click="dialog1.close()">关闭</el-button>
            </template>
        </el-dialog>

        <!-- 带数据的弹窗 -->
        <el-dialog
            v-model="dialog2.state.visible"
            :title="dialog2.state.title"
            width="500px"
        >
            <div v-if="dialog2.state.data">
                <p><strong>ID:</strong> {{ dialog2.state.data.id }}</p>
                <p><strong>姓名:</strong> {{ dialog2.state.data.name }}</p>
                <p><strong>邮箱:</strong> {{ dialog2.state.data.email }}</p>
            </div>
            <template #footer>
                <el-button @click="dialog2.close()">关闭</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped>
.button-group {
    display: flex;
    gap: 12px;
}
</style>
