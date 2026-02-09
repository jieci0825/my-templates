<script setup lang="ts">
import { useSettingsStore } from '@/stores'
import type { Layout } from '@/stores/setting/type'
import SettingSection from './setting-section.vue'
import LayoutSchema from './layout-schema.vue'

const { settingState, setSetting } = useSettingsStore()

const layoutOptions: { label: string; value: Layout }[] = [
    { label: '侧边导航', value: 'vertical' },
    { label: '顶部导航', value: 'horizontal' },
]
</script>

<template>
    <SettingSection title="布局">
        <div class="layout-group">
            <div v-for="item in layoutOptions" :key="item.value" class="layout-option">
                <LayoutSchema
                    :type="item.value"
                    :active="settingState.layout === item.value"
                    @click="setSetting('layout', item.value)"
                />
                <span class="layout-option__label">{{ item.label }}</span>
            </div>
        </div>
    </SettingSection>
</template>

<style scoped lang="scss">
.layout-group {
    display: flex;
    gap: 16px;
}

.layout-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    &__label {
        font-size: 12px;
        color: var(--el-text-color-secondary);
    }
}
</style>
