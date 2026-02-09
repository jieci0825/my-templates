<script setup lang="ts">
/** 登录表单组件 */

import { computed, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'
import IconMdiLoading from '~icons/mdi/loading'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const loading = ref(false)
const appTitle = computed(() => {
    return import.meta.env.VITE_TITLE
})

const loginForm = reactive({
    username: '',
    password: '',
})

const handleLogin = async () => {
    loading.value = true
    try {
        await userStore.login(loginForm)
        ElMessage.success('登录成功')
        const redirect = (route.query.redirect as string) || '/dashboard'
        router.push(redirect)
    } catch {
        /* 错误已由请求拦截器统一处理 */
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="login-form">
        <div class="login-form__header">
            <h2 class="login-form__title">{{ appTitle }}</h2>
            <p class="login-form__subtitle">请输入您的账户信息以继续访问系统</p>
        </div>

        <el-alert
            title="本系统为通用管理模板，默认账户：admin / 123123"
            type="info"
            show-icon
            :closable="false"
            class="login-form__alert"
        />

        <el-form :model="loginForm" @submit.prevent="handleLogin">
            <el-form-item>
                <el-input v-model="loginForm.username" placeholder="用户名" size="large" />
            </el-form-item>
            <el-form-item>
                <el-input v-model="loginForm.password" type="password" placeholder="密码" size="large" show-password />
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    size="large"
                    :disabled="loading"
                    native-type="submit"
                    class="login-form__submit"
                >
                    <IconMdiLoading v-if="loading" class="login-form__spin" />
                    <span v-else>登 录</span>
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped lang="scss">
.login-form {
    width: 100%;
    max-width: 400px;

    &__header {
        margin-bottom: 24px;
    }

    &__title {
        font-size: 30px;
        font-weight: 700;
        color: var(--el-text-color-primary);
        margin: 0 0 12px;
    }

    &__subtitle {
        font-size: 14px;
        color: var(--el-text-color-regular);
        margin: 0;
        line-height: 1.6;
    }

    &__alert {
        margin-bottom: 24px;
    }

    &__submit {
        width: 100%;
        margin-top: 4px;
    }

    &__spin {
        font-size: 18px;
        animation: login-spin 0.8s linear infinite;
    }
}

@keyframes login-spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
