<script setup lang="ts">
import { useSettingsStore } from '@/stores'
import AppLogo from '@/components/app-logo/index.vue'
import SettingSection from './setting-section.vue'

const { settingState, setSetting } = useSettingsStore()

const presetColors = [
    { name: '水龙吟', hex: '#84a729' },
    { name: '苍苍', hex: '#526efa' },
    { name: '天水碧', hex: '#16baaa' },
    { name: '琥珀', hex: '#ff7400' },
    { name: '鹤顶', hex: '#d50021' },
]

const handleSelect = (hex: string | null) => {
    setSetting('primaryColor', hex)
}
</script>

<template>
    <SettingSection title="主色">
        <div class="color-grid">
            <div class="color-item" :class="{ active: settingState.primaryColor === null }" @click="handleSelect(null)">
                <div class="color-icon color-icon--default">
                    <icon-carbon-reset />
                </div>
                <span class="color-name">默认</span>
            </div>
            <div
                v-for="item in presetColors"
                :key="item.hex"
                class="color-item"
                :class="{ active: settingState.primaryColor === item.hex }"
                :style="{ '--preset-color': item.hex }"
                @click="handleSelect(item.hex)"
            >
                <div class="color-icon">
                    <AppLogo />
                </div>
                <span class="color-name">{{ item.name }}</span>
            </div>
        </div>
    </SettingSection>
</template>

<style scoped lang="scss">
.color-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
}

.color-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 10px 8px;
    border-radius: 10px;
    cursor: pointer;
    border: 1.5px solid transparent;
    transition: all 0.25s ease;
    user-select: none;

    &:hover {
        background-color: var(--el-fill-color-light);
    }

    &.active {
        background-color: color-mix(in srgb, var(--preset-color, var(--el-text-color-primary)) 10%, var(--el-bg-color));
        border-color: color-mix(
            in srgb,
            var(--preset-color, var(--el-text-color-primary)) 35%,
            var(--el-border-color-light)
        );
    }
}

.color-icon {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--preset-color);
    background: color-mix(in srgb, var(--preset-color) 12%, var(--el-fill-color-dark));

    :deep(svg) {
        width: 22px;
        height: 22px;
    }

    &--default {
        color: var(--el-text-color-secondary);
        background: var(--el-fill-color-dark);

        :deep(svg) {
            width: 20px;
            height: 20px;
        }
    }
}

.color-name {
    font-size: 11px;
    color: var(--el-text-color-secondary);
    white-space: nowrap;
}
</style>
