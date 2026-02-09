<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '@/stores'
import ThemeSetting from './components/theme-setting.vue'
import PrimaryColorSetting from './components/primary-color-setting.vue'
import LayoutSetting from './components/layout-setting.vue'
import InterfaceSetting from './components/interface-setting.vue'
import SidebarSetting from './components/sidebar-setting.vue'
import TransitionSetting from './components/transition-setting.vue'

const { settingState, setSetting } = useSettingsStore()

const drawerVisible = computed({
    get: () => settingState.settingsDrawerVisible,
    set: (val: boolean) => setSetting('settingsDrawerVisible', val),
})
</script>

<template>
    <el-drawer v-model="drawerVisible" title="系统设置" size="320px" append-to-body>
        <div class="settings-content">
            <ThemeSetting />
            <PrimaryColorSetting />
            <LayoutSetting />
            <InterfaceSetting />
            <SidebarSetting />
            <TransitionSetting />
        </div>
    </el-drawer>
</template>

<style scoped lang="scss">
.settings-content {
    display: flex;
    flex-direction: column;
    gap: 28px;
    padding-bottom: var(--gap-md);
}
</style>
