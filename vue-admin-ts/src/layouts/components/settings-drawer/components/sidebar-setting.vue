<script setup lang="ts">
import { useSettingsStore } from '@/stores'
import SettingSection from './setting-section.vue'

const { settingState, setSetting } = useSettingsStore()

const handleWidthChange = (val: number) => {
    setSetting('sidebarWidth', val)
}
</script>

<template>
    <SettingSection title="侧边栏">
        <div class="setting-row">
            <span class="setting-row__label">折叠</span>
            <el-switch
                :model-value="settingState.sidebarCollapsed"
                size="small"
                @change="setSetting('sidebarCollapsed', $event as boolean)"
            />
        </div>
        <div class="slider-row">
            <span class="slider-row__label">宽度</span>
            <el-slider
                :model-value="settingState.sidebarWidth"
                :min="180"
                :max="300"
                :step="10"
                @input="handleWidthChange($event as number)"
            />
        </div>
    </SettingSection>
</template>

<style scoped lang="scss">
.setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 36px;

    &__label {
        font-size: 13px;
        color: var(--el-text-color-regular);
    }
}

.slider-row {
    display: flex;
    align-items: center;
    gap: 16px;
    height: 36px;

    &__label {
        font-size: 13px;
        color: var(--el-text-color-regular);
        flex-shrink: 0;
    }

    :deep(.el-slider) {
        flex: 1;
    }
}
</style>
