<script setup lang="ts">
import Header from '../header/index.vue'
import HeaderNav from '../header/header-nav.vue'
// #scaffold-start:tabs
import Tabs from '../tabs/index.vue'
// #scaffold-end:tabs
import Main from '../main/index.vue'
import { useSettingsStore, useUserStore } from '@/stores'

const { settingState } = useSettingsStore()
const userStore = useUserStore()

const handleLogout = () => {
    userStore.logout()
}
</script>

<template>
    <el-container class="layout-horizontal" direction="vertical">
        <Header @logout="handleLogout">
            <HeaderNav />
        </Header>

        <!-- #scaffold-start:tabs -->
        <Tabs v-if="settingState.isShowTags" />
        <!-- #scaffold-end:tabs -->
        <Main />
    </el-container>
</template>

<style scoped lang="scss">
.layout-horizontal {
    height: 100%;
}
</style>
