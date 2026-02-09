<script setup lang="ts">
import { ref, computed } from 'vue'
import Avatar from '@/components/avatar/index.vue'
import { useUserStore, useLockStore } from '@/stores'

interface Emits {
    (e: 'logout'): void
}

const emit = defineEmits<Emits>()
const userStore = useUserStore()
const lockStore = useLockStore()

const lockDialogVisible = ref(false)
const lockPassword = ref('')

const alphanumericRegex = /^[a-zA-Z0-9]*$/
const lockPasswordError = computed(() => {
    if (!lockPassword.value) return ''
    if (!alphanumericRegex.test(lockPassword.value)) return '密码只能包含字母和数字'
    return ''
})
const lockPasswordValid = computed(() => !!lockPassword.value && !lockPasswordError.value)

const handleShowLockDialog = () => {
    lockPassword.value = ''
    lockDialogVisible.value = true
}

const handleLock = () => {
    if (!lockPasswordValid.value) return
    lockStore.lock(lockPassword.value)
    lockDialogVisible.value = false
    lockPassword.value = ''
}

const handleLogout = () => {
    emit('logout')
}
</script>

<template>
    <el-dropdown placement="bottom-end" :hide-on-click="false" popper-class="user-dropdown-popper">
        <Avatar :username="userStore.userInfo?.nickname" :url="userStore.userInfo?.avatar || ''" />
        <template #dropdown>
            <div class="user-dropdown">
                <!-- 用户信息区域 -->
                <div class="user-dropdown__header">
                    <Avatar
                        :username="userStore.userInfo?.nickname"
                        :url="userStore.userInfo?.avatar || ''"
                        :size="42"
                    />
                    <div class="user-dropdown__info">
                        <div class="user-dropdown__name">{{ userStore.userInfo?.nickname }}</div>
                        <div class="user-dropdown__email">{{ userStore.userInfo?.username }}</div>
                    </div>
                </div>

                <!-- 菜单选项区域 -->
                <div class="user-dropdown__menu">
                    <div class="user-dropdown__item">
                        <icon-carbon-user />
                        <span>个人中心</span>
                    </div>
                    <div class="user-dropdown__item">
                        <icon-carbon-document />
                        <span>使用文档</span>
                    </div>
                    <div class="user-dropdown__item" @click="handleShowLockDialog">
                        <icon-carbon-locked />
                        <span>锁定屏幕</span>
                    </div>
                </div>

                <!-- 退出登录按钮 -->
                <div class="user-dropdown__footer">
                    <el-button type="danger" class="logout-btn" @click="handleLogout">退出登录</el-button>
                </div>
            </div>
        </template>
    </el-dropdown>

    <!-- 锁屏密码设置弹窗 -->
    <el-dialog
        v-model="lockDialogVisible"
        title="锁定屏幕"
        width="400px"
        :close-on-click-modal="false"
        destroy-on-close
        align-center
    >
        <el-form @submit.prevent="handleLock">
            <el-form-item label="锁屏密码" :error="lockPasswordError">
                <el-input
                    v-model="lockPassword"
                    type="password"
                    placeholder="请设置锁屏密码（仅字母和数字）"
                    show-password
                    autofocus
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="lockDialogVisible = false">取消</el-button>
            <el-button type="primary" :disabled="!lockPasswordValid" @click="handleLock">锁定</el-button>
        </template>
    </el-dialog>
</template>

<style lang="scss">
// 用户下拉菜单 popper 样式（全局，因为 popper 渲染在 body 上）
.user-dropdown-popper {
    padding: 0 !important;
    border-radius: 10px !important;
    box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.08),
        0 2px 6px rgba(0, 0, 0, 0.04) !important;
}

.user-dropdown {
    width: 220px;
    padding: 12px;
    box-sizing: border-box;

    &__header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding-bottom: 12px;
    }

    &__info {
        flex: 1;
        min-width: 0;
    }

    &__name {
        font-size: 14px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 2px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__email {
        font-size: 12px;
        color: var(--el-text-color-primary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__menu {
        padding: 4px 0;
    }

    &__item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 9px 8px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        color: var(--el-text-color-regular);
        font-size: 13px;

        &:hover {
            background-color: var(--el-fill-color-light);
        }
    }

    &__footer {
        padding-top: 10px;

        .logout-btn {
            width: 100%;
            transition: all 0.2s ease;
        }
    }
}
</style>
