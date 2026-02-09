<script setup lang="ts">
import { useSettingsStore } from '@/stores'
import type { Theme } from '@/stores/setting/type'
import SettingSection from './setting-section.vue'

const { settingState, setSetting } = useSettingsStore()

const themeOptions: { label: string; value: Theme }[] = [
    { label: '浅色', value: 'light' },
    { label: '深色', value: 'dark' },
    { label: '跟随系统', value: 'system' },
]
</script>

<template>
    <SettingSection title="主题">
        <div class="theme-group">
            <div
                v-for="item in themeOptions"
                :key="item.value"
                class="theme-chip"
                :class="{ active: settingState.theme === item.value }"
                @click="setSetting('theme', item.value)"
            >
                <icon-carbon-sun v-if="item.value === 'light'" />
                <icon-carbon-asleep v-else-if="item.value === 'dark'" />
                <icon-carbon-laptop v-else />
                <span>{{ item.label }}</span>
            </div>
        </div>
    </SettingSection>
</template>

<style scoped lang="scss">
.theme-group {
    display: flex;
    gap: 8px;
}

.theme-chip {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 7px 0;
    font-size: 13px;
    border-radius: 6px;
    cursor: pointer;
    border: 1.5px solid var(--el-border-color-light);
    color: var(--el-text-color-regular);
    background-color: transparent;
    transition: all 0.25s ease;
    user-select: none;

    &:hover {
        border-color: var(--el-border-color);
    }

    &.active {
        border-color: var(--el-color-primary);
        color: var(--el-color-primary);
        background-color: var(--el-color-primary-light-9);
    }

    svg {
        font-size: 14px;
    }
}
</style>
