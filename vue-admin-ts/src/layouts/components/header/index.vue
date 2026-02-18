<script setup lang="ts">
// #scaffold-start:searchCommand
import HeaderSearch from './header-search.vue'
// #scaffold-end:searchCommand
import HeaderActions from './header-actions.vue'
import HeaderAvatar from './header-avatar.vue'

interface Emits {
    (e: 'logout'): void
}

const emit = defineEmits<Emits>()

const handleLogout = () => {
    emit('logout')
}
</script>

<template>
    <el-header class="header">
        <!-- 左侧区域：由布局组件通过插槽注入 -->
        <slot />

        <div class="header-right">
            <!-- #scaffold-start:searchCommand -->
            <HeaderSearch />
            <!-- #scaffold-end:searchCommand -->
            <HeaderActions />
            <HeaderAvatar @logout="handleLogout" />
        </div>
    </el-header>
</template>

<style scoped lang="scss">
.header {
    height: 65px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    border-bottom: 1px solid var(--el-border-color);

    .header-right {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
    }
}
</style>
