<script setup lang="ts">
import { type Component, computed } from 'vue'
import { useSettingsStore } from '@/stores'
import { usePreferredDark } from '@vueuse/core'
import type { Theme } from '@/stores/setting/type'
import IconAsleep from '~icons/carbon/asleep'
import IconSun from '~icons/carbon/sun'

const settingsStore = useSettingsStore()
const prefersDark = usePreferredDark()

const currentTheme = computed(() => settingsStore.settingState.theme)

const themeOptions: { label: string; value: Theme }[] = [
    { label: '深色模式', value: 'dark' },
    { label: '浅色模式', value: 'light' },
    { label: '跟随系统', value: 'system' },
]

const handleThemeChange = (value: Theme) => {
    settingsStore.setSetting('theme', value)
}

const handleOpenSettings = () => {
    settingsStore.setSetting('settingsDrawerVisible', true)
}

const handleToggleFullscreen = () => {
    settingsStore.setSetting('isShowFullscreen', !settingsStore.settingState.isShowFullscreen)
}

const themeIcon = computed<Component>(() => {
    if (currentTheme.value === 'system') {
        return prefersDark.value ? IconAsleep : IconSun
    }
    return currentTheme.value === 'dark' ? IconAsleep : IconSun
})
</script>

<template>
    <!-- 切换主题 -->
    <el-dropdown placement="bottom-end" @command="handleThemeChange">
        <div class="icon-btn">
            <component :is="themeIcon" />
        </div>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item
                    v-for="(item, index) in themeOptions"
                    :key="item.value"
                    :command="item.value"
                    :divided="index !== 0"
                >
                    <span class="theme-option">
                        <span>{{ item.label }}</span>
                        <icon-carbon-checkmark v-if="currentTheme === item.value" />
                    </span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>

    <div class="icon-btn" @click="handleToggleFullscreen">
        <icon-carbon-fit-to-screen />
    </div>

    <div class="icon-btn" @click="handleOpenSettings">
        <icon-carbon-settings />
    </div>
</template>

<style scoped lang="scss">
$h: 32px;

.icon-btn {
    width: $h;
    height: $h;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background-color: var(--el-color-primary-light-9);
    }
}

.theme-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 16px;
}
</style>
