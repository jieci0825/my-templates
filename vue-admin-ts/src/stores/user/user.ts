import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi } from '@/api/modules/auth'
import { getUserInfo as getUserInfoApi } from '@/api/modules/user'
import type { LoginParams } from '@/api/types'
import type { UserState } from './type'
import { setStorage, getStorage, removeStorage } from '@/utils'
import { STORAGE_KEY } from '@/constants'
import router, {
    resetRoutesRegistered,
    markRoutesRegistered,
    // #scaffold-start:tabs
    resetAffixTabsInitialized,
    // #scaffold-end:tabs
    removeDynamicRoutes,
    registerDynamicRoutes,
} from '@/router'
// #scaffold-start:tabs
import { useTabStore } from '@/stores/tab'
// #scaffold-end:tabs
// #scaffold-start:lockScreen
import { useLockStore } from '@/stores/lock'
// #scaffold-end:lockScreen

export const useUserStore = defineStore('user', () => {
    const userInfo = ref<UserState['userInfo']>(getStorage(STORAGE_KEY.USER_INFO))
    const menus = ref<UserState['menus']>(userInfo.value?.menus || [])
    const permissions = ref<UserState['permissions']>(userInfo.value?.permissions || [])

    const isLoggedIn = computed(() => userInfo.value !== null)

    /**
     * 设置 token
     */
    const setToken = (accessToken: string, refreshToken: string) => {
        setStorage(STORAGE_KEY.ACCESS_TOKEN, accessToken)
        setStorage(STORAGE_KEY.REFRESH_TOKEN, refreshToken)
    }

    /**
     * 登录
     */
    const login = async (params: LoginParams) => {
        const resp = await loginApi(params)
        setToken(resp.accessToken, resp.refreshToken)
        await getUserInfo()

        // 登录后立即注册动态路由，避免后续 router.push 时路由不存在被兜底路由拦截到 404
        registerDynamicRoutes(menus.value)
        markRoutesRegistered()
    }

    /**
     * 获取用户信息
     */
    const getUserInfo = async () => {
        const res = await getUserInfoApi()
        userInfo.value = res
        menus.value = res.menus
        permissions.value = res.permissions
        setStorage(STORAGE_KEY.USER_INFO, res)
    }

    /**
     * 退出登录，清除所有用户相关状态并跳转到登录页
     */
    const logout = (redirectPath?: string) => {
        // 清除用户状态
        userInfo.value = null
        menus.value = []
        permissions.value = []

        // 清除存储
        removeStorage(STORAGE_KEY.ACCESS_TOKEN)
        removeStorage(STORAGE_KEY.REFRESH_TOKEN)
        removeStorage(STORAGE_KEY.USER_INFO)

        // #scaffold-start:tabs
        // 清除标签页
        const tabStore = useTabStore()
        tabStore.clearTabs()
        // #scaffold-end:tabs

        // #scaffold-start:lockScreen
        // 重置锁屏状态
        const lockStore = useLockStore()
        lockStore.reset()
        // #scaffold-end:lockScreen

        // 重置路由相关状态
        removeDynamicRoutes()
        resetRoutesRegistered()
        // #scaffold-start:tabs
        resetAffixTabsInitialized()
        // #scaffold-end:tabs

        // 跳转到登录页，携带 redirect 参数便于重新登录后回到退出前的页面
        const currentPath = redirectPath ?? router.currentRoute.value.fullPath
        const query = currentPath && currentPath !== '/login' ? { redirect: currentPath } : undefined
        router.replace({ path: '/login', query })
    }

    return {
        userInfo,
        menus,
        permissions,
        isLoggedIn,
        setToken,
        login,
        getUserInfo,
        logout,
    }
})
