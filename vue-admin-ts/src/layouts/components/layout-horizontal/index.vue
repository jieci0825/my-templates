<script setup lang="ts">
import Header from '../header/index.vue'
import HeaderNav from '../header/header-nav.vue'
import Tabs from '../tabs/index.vue'
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

        <Tabs v-if="settingState.isShowTags" />
        <Main />
    </el-container>
</template>

<style scoped lang="scss">
.layout-horizontal {
    height: 100%;
}
</style>
