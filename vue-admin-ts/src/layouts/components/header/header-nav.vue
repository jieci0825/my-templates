<script setup lang="ts">
import AppLogo from '@/components/app-logo/index.vue'
import Menu from '../menu/index.vue'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const title = import.meta.env.VITE_TITLE
</script>

<template>
    <div class="header-nav">
        <div class="header-nav__logo">
            <AppLogo class="logo-img" />
            <h2>{{ title }}</h2>
        </div>
        <div class="header-nav__menu">
            <Menu :menu-data="userStore.menus" mode="horizontal" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.header-nav {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    overflow: hidden;

    &__logo {
        display: flex;
        align-items: center;
        gap: 8px;
        padding-right: 24px;
        flex-shrink: 0;
        color: var(--el-color-primary);

        .logo-img {
            width: var(--logo-size);
            height: var(--logo-size);
        }

        h2 {
            margin: 0;
            font-size: var(--logo-font-size);
            font-weight: bold;
            white-space: nowrap;
        }
    }

    &__menu {
        flex: 1;
        min-width: 0;
        overflow: hidden;

        :deep(.el-menu--horizontal) {
            border-bottom: none;

            > .el-sub-menu .el-sub-menu__title,
            > .el-menu-item {
                border-bottom: none;
            }
        }
    }
}
</style>
