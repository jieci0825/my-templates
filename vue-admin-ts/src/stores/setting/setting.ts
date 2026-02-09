import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'
import { getStorage, setStorage } from '@/utils'
import { applyPrimaryColor, clearPrimaryColor } from '@/utils/color'
import { STORAGE_KEY } from '@/constants'
import type { SettingState, Theme } from './type'

// 设置项的默认值
const defaultSettings: SettingState = {
    theme: 'system',
    layout: 'vertical',
    sidebarWidth: 220,
    sidebarCollapsed: false,
    isShowTags: true,
    isShowBreadcrumb: true,
    isShowProgress: true,
    isShowFullscreen: false,
    isNeedWatermark: false,
    pageTransitionType: 'fade',
    settingsDrawerVisible: false,
    primaryColor: null,
}

/**
 * 系统偏好媒体查询
 */
const prefersDarkQuery = window.matchMedia('(prefers-color-scheme: dark)')

/**
 * 将主题应用到 HTML 元素上
 */
const applyThemeToDOM = (isDark: boolean) => {
    document.documentElement.classList.toggle('dark', isDark)
}

/**
 * 根据主题值解析出是否为暗色模式
 */
const resolveIsDark = (theme: Theme): boolean => {
    if (theme === 'dark') return true
    if (theme === 'light') return false
    return prefersDarkQuery.matches
}

export const useSettingsStore = defineStore('settings', () => {
    // 从本地读取设置项
    const savedSettings = getStorage<SettingState>(STORAGE_KEY.SETTINGS)

    // 设置项的初始值
    const settingState = ref<SettingState>(Object.assign({}, defaultSettings, savedSettings))

    // 系统主题变化监听器
    let systemThemeListener: ((e: MediaQueryListEvent) => void) | null = null

    /**
     * 清除系统主题监听
     */
    const removeSystemThemeListener = () => {
        if (systemThemeListener) {
            prefersDarkQuery.removeEventListener('change', systemThemeListener)
            systemThemeListener = null
        }
    }

    /**
     * 根据当前主题模式应用主色到 CSS 变量
     */
    const applyPrimaryColorForCurrentTheme = () => {
        const color = settingState.value.primaryColor
        if (color) {
            const isDark = document.documentElement.classList.contains('dark')
            applyPrimaryColor(color, isDark)
        } else {
            clearPrimaryColor()
        }
    }

    /**
     * 应用主题并管理系统主题监听
     */
    const applyTheme = (theme: Theme) => {
        removeSystemThemeListener()
        applyThemeToDOM(resolveIsDark(theme))
        applyPrimaryColorForCurrentTheme()

        if (theme === 'system') {
            systemThemeListener = (e: MediaQueryListEvent) => {
                applyThemeToDOM(e.matches)
                applyPrimaryColorForCurrentTheme()
            }
            prefersDarkQuery.addEventListener('change', systemThemeListener)
        }
    }

    /**
     * 持久化配置到本地存储
     */
    const persistSettings = () => {
        setStorage(STORAGE_KEY.SETTINGS, settingState.value)
    }

    /**
     * 副作用处理函数映射表
     */
    const sideEffectHandlers: Partial<{
        [K in keyof SettingState]: (value: SettingState[K]) => void
    }> = {
        theme: (value) => {
            applyTheme(value as Theme)
        },
        primaryColor: () => {
            applyPrimaryColorForCurrentTheme()
        },
        isShowFullscreen: (value) => {
            if (value && !document.fullscreenElement) {
                document.documentElement.requestFullscreen()
            } else if (!value && document.fullscreenElement) {
                document.exitFullscreen()
            }
        },
        sidebarWidth: (_value) => {
            // 处理侧边栏宽度变更的副作用
            // 例如：触发布局重绘
        },
        // 其他配置项的副作用处理函数...
    }

    /**
     * 触发配置项变更的副作用
     */
    const triggerSideEffect = <K extends keyof SettingState>(key: K, value: SettingState[K]) => {
        const handler = sideEffectHandlers[key]
        if (handler) {
            handler(value as never)
        }
    }

    /**
     * 设置指定配置项的值
     */
    const setSetting = <K extends keyof SettingState>(key: K, value: SettingState[K]) => {
        // 更新状态
        settingState.value[key] = value

        // 持久化到本地存储
        persistSettings()

        // 触发副作用
        triggerSideEffect(key, value)
    }

    // 初始化时应用当前主题
    applyTheme(settingState.value.theme)

    // 监听浏览器全屏状态变化，保持状态同步
    document.addEventListener('fullscreenchange', () => {
        const isFullscreen = !!document.fullscreenElement
        if (settingState.value.isShowFullscreen !== isFullscreen) {
            setSetting('isShowFullscreen', isFullscreen)
        }
    })

    return {
        settingState: readonly(settingState),
        setSetting,
    }
})
