<script setup lang="ts">
import { computed, type Component } from 'vue'
import IconDashboard from '~icons/mdi/view-dashboard'
import IconSettings from '~icons/mdi/cog'
import IconUser from '~icons/mdi/account'
import IconUserAvatar from '~icons/mdi/account-circle'

interface Props {
    /** 后端返回的 icon 名称 */
    name: string | undefined
}

const props = defineProps<Props>()

/** 后端 icon 名称到实际图标组件的映射 */
const iconMap: Record<string, Component> = {
    Dashboard: IconDashboard,
    Setting: IconSettings,
    User: IconUser,
    Avatar: IconUserAvatar,
}

const iconComponent = computed(() => {
    if (!props.name) return null
    return iconMap[props.name] || null
})
</script>

<template>
    <el-icon v-if="iconComponent" class="menu-icon">
        <component :is="iconComponent" />
    </el-icon>
</template>

<style scoped lang="scss">
.menu-icon {
    margin-right: 6px;
    font-size: 18px;
}
</style>
