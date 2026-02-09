import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getStorage, setStorage, removeStorage } from '@/utils'
import { STORAGE_KEY } from '@/constants'
import type { LockState } from './type'

export const useLockStore = defineStore('lock', () => {
    const savedState = getStorage<LockState>(STORAGE_KEY.LOCK_INFO)

    const isLocked = ref(savedState?.isLocked ?? false)
    const lockPassword = ref<string | null>(savedState?.lockPassword ?? null)

    const locked = computed(() => isLocked.value)

    /**
     * 持久化锁屏状态到本地存储
     */
    const persistState = () => {
        setStorage(STORAGE_KEY.LOCK_INFO, {
            isLocked: isLocked.value,
            lockPassword: lockPassword.value,
        })
    }

    /**
     * 锁定屏幕
     */
    const lock = (password: string) => {
        lockPassword.value = password
        isLocked.value = true
        persistState()
    }

    /**
     * 解锁屏幕，校验密码是否正确
     */
    const unlock = (password: string): boolean => {
        if (password !== lockPassword.value) {
            return false
        }
        isLocked.value = false
        lockPassword.value = null
        removeStorage(STORAGE_KEY.LOCK_INFO)
        return true
    }

    /**
     * 重置锁屏状态（用于退出登录等场景）
     */
    const reset = () => {
        isLocked.value = false
        lockPassword.value = null
        removeStorage(STORAGE_KEY.LOCK_INFO)
    }

    return {
        locked,
        lock,
        unlock,
        reset,
    }
})
