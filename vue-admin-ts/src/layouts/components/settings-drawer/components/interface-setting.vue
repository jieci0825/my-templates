<script setup lang="ts">
import { useSettingsStore } from '@/stores'
import SettingSection from './setting-section.vue'

const { settingState, setSetting } = useSettingsStore()

type BooleanSettingKey = 'isShowTags' | 'isShowBreadcrumb' | 'isShowProgress' | 'isShowFullscreen' | 'isNeedWatermark'

const switchItems: { label: string; key: BooleanSettingKey }[] = [
    { label: '标签栏', key: 'isShowTags' },
    { label: '面包屑', key: 'isShowBreadcrumb' },
    { label: '进度条', key: 'isShowProgress' },
    { label: '全屏按钮', key: 'isShowFullscreen' },
    { label: '水印', key: 'isNeedWatermark' },
]

const handleChange = (key: BooleanSettingKey, val: boolean) => {
    setSetting(key, val)
}
</script>

<template>
    <SettingSection title="界面">
        <div class="switch-list">
            <div v-for="item in switchItems" :key="item.key" class="setting-row">
                <span class="setting-row__label">{{ item.label }}</span>
                <el-switch
                    :model-value="settingState[item.key]"
                    size="small"
                    @change="handleChange(item.key, $event as boolean)"
                />
            </div>
        </div>
    </SettingSection>
</template>

<style scoped lang="scss">
.switch-list {
    display: flex;
    flex-direction: column;
}

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
</style>
