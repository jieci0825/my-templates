<script setup lang="ts">
import { useSettingsStore } from '@/stores'
import type { PageTransitionType } from '@/stores/setting/type'
import SettingSection from './setting-section.vue'

const { settingState, setSetting } = useSettingsStore()

const transitionOptions: { label: string; value: PageTransitionType }[] = [
    { label: '无', value: 'none' },
    { label: '淡入淡出', value: 'fade' },
    { label: '左滑', value: 'slide-left' },
    { label: '上滑', value: 'slide-top' },
    { label: '下滑', value: 'slide-bottom' },
]

const handleChange = (val: string) => {
    setSetting('pageTransitionType', val as PageTransitionType)
}
</script>

<template>
    <SettingSection title="页面动画">
        <el-select
            :model-value="settingState.pageTransitionType"
            style="width: 100%"
            @change="handleChange"
        >
            <el-option
                v-for="item in transitionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
        </el-select>
    </SettingSection>
</template>
