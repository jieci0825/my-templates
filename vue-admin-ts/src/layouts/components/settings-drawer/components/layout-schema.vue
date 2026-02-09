<script setup lang="ts">
import type { Layout } from '@/stores/setting/type'

defineProps<{
    type: Layout
    active?: boolean
}>()

defineEmits<{
    click: []
}>()
</script>

<template>
    <div
        class="layout-schema"
        :class="[`layout-schema--${type}`, { active }]"
        @click="$emit('click')"
    >
        <!-- 侧边导航布局 -->
        <template v-if="type === 'vertical'">
            <div class="schema-aside">
                <div class="schema-dot" />
                <div class="schema-bar" />
                <div class="schema-bar short" />
                <div class="schema-bar" />
            </div>
            <div class="schema-body">
                <div class="schema-nav" />
                <div class="schema-content" />
            </div>
        </template>

        <!-- 顶部导航布局 -->
        <template v-else>
            <div class="schema-header">
                <div class="schema-dot" />
                <div class="schema-bar" />
                <div class="schema-bar" />
            </div>
            <div class="schema-content" />
        </template>
    </div>
</template>

<style scoped lang="scss">
$w: 108px;
$h: 72px;
$r: 8px;
$ir: 5px;
$gap: 4px;

.layout-schema {
    width: $w;
    height: $h;
    border-radius: $r;
    padding: 6px;
    cursor: pointer;
    border: 1.5px solid transparent;
    background-color: var(--el-fill-color-lighter);
    transition: all 0.25s ease;

    &:hover {
        border-color: var(--el-border-color);
    }

    &.active {
        border-color: var(--el-color-primary);

        .schema-dot {
            background-color: var(--el-color-primary);
        }
    }
}

// 共享元素
.schema-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--el-text-color-placeholder);
    flex-shrink: 0;
    transition: background-color 0.25s ease;
}

.schema-bar {
    height: 3px;
    border-radius: 2px;
    background-color: var(--el-border-color);

    &.short {
        width: 60%;
    }
}

.schema-content {
    flex: 1;
    border-radius: $ir;
    background-color: var(--el-fill-color);
}

.schema-nav {
    height: 7px;
    border-radius: $ir;
    background-color: var(--el-fill-color);
}

// 侧边导航
.layout-schema--vertical {
    display: flex;
    gap: $gap;

    .schema-aside {
        width: 28%;
        border-radius: $ir;
        padding: 5px 4px;
        display: flex;
        flex-direction: column;
        gap: 3px;
        background-color: var(--el-fill-color-light);
        transition: background-color 0.25s ease;

        .schema-bar {
            width: 100%;
        }
    }

    .schema-body {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: $gap;
    }

    &.active .schema-aside {
        background-color: var(--el-color-primary-light-9);
    }
}

// 顶部导航
.layout-schema--horizontal {
    display: flex;
    flex-direction: column;
    gap: $gap;

    .schema-header {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 5px;
        border-radius: $ir;
        background-color: var(--el-fill-color-light);
        transition: background-color 0.25s ease;

        .schema-bar {
            width: 14px;
        }
    }

    &.active .schema-header {
        background-color: var(--el-color-primary-light-9);
    }
}
</style>
