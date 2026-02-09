<script setup lang="ts">
import { computed } from 'vue'
import MenuIcon from './menu-icon.vue'
import type { MenuItem } from '@/types/menu'

interface Props {
    item: MenuItem
}

const props = defineProps<Props>()

// 判断是否有子菜单
const hasChildren = computed(() => {
    return props.item.children && props.item.children.length > 0
})

// 过滤隐藏的子菜单
const visibleChildren = computed(() => {
    return props.item.children?.filter((child) => !child.hidden) || []
})

// 获取菜单项的 index
// 优先使用 path 作为 index，这样可以在父组件的 @select 事件中获取到路径
// 如果没有 path，则使用 id 作为 index
const menuIndex = computed(() => {
    return props.item.path || String(props.item.id)
})
</script>

<template>
    <!-- 有子菜单时渲染 el-sub-menu -->
    <el-sub-menu v-if="hasChildren" :index="menuIndex">
        <template #title>
            <MenuIcon :name="item.icon" />
            <span>{{ item.title }}</span>
        </template>

        <!-- 递归渲染子菜单 -->
        <MenuRecursive v-for="child in visibleChildren" :key="child.id" :item="child" />
    </el-sub-menu>

    <!-- 没有子菜单时渲染 el-menu-item -->
    <!-- 注意：菜单项的跳转由父组件的 @select 事件统一处理，不使用 el-menu 的 router 模式 -->
    <el-menu-item v-else :index="menuIndex">
        <MenuIcon :name="item.icon" />
        <template #title>
            <span>{{ item.title }}</span>
        </template>
    </el-menu-item>
</template>

<style scoped lang="scss"></style>
