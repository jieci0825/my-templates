<script setup lang="ts">
import SearchCommand from '@/components/search-command/index.vue'
import { ref } from 'vue'

const searchCommandRef = ref<InstanceType<typeof SearchCommand> | null>(null)

const handleOpenSearch = () => {
    searchCommandRef.value?.open()
}
</script>

<template>
    <div class="search-bar" @click="handleOpenSearch">
        <icon-carbon-search />
        <span class="text-tip">Search...</span>
        <div class="key-tip">
            <div>Ctrl + K</div>
        </div>
    </div>

    <!-- 搜索命令弹窗 -->
    <SearchCommand ref="searchCommandRef" />
</template>

<style scoped lang="scss">
$h: 32px;

.search-bar {
    height: $h;
    display: flex;
    align-items: center;
    padding: 0 6px;
    border-radius: 6px;
    border: 1px solid var(--el-border-color);
    font-size: 14px;
    color: var(--el-text-color-secondary);
    cursor: pointer;
    transition: all 0.3s ease;
    margin-right: 10px;
    min-width: 220px;

    &:hover {
        background-color: var(--el-color-primary-light-9);
    }

    .text-tip {
        margin-left: 5px;
        margin-right: 10px;
        font-size: 14px;
    }

    .key-tip {
        margin-left: auto;
        background-color: var(--el-color-primary-light-9);
        padding: 2px 4px;
        border-radius: 4px;
        border: 1px solid var(--el-color-primary-light-8);

        div {
            font-size: 12px;
            transform: scale(0.9);
        }
    }
}
</style>
