<script setup lang="ts">
import IconRefresh from '~icons/mdi/refresh'

interface Emits {
    (e: 'refresh'): void
}

const emit = defineEmits<Emits>()
</script>

<template>
    <div class="pro-table-toolbar">
        <div class="pro-table-toolbar__left">
            <slot name="toolbar" />
        </div>
        <div class="pro-table-toolbar__right">
            <el-tooltip
                content="刷新"
                placement="top"
            >
                <el-button
                    circle
                    @click="emit('refresh')"
                >
                    <el-icon :size="16">
                        <IconRefresh />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>
    </div>
</template>

<style scoped>
.pro-table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
}

.pro-table-toolbar__left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
}

.pro-table-toolbar__right {
    display: flex;
    align-items: center;
    gap: 8px;
}
</style>
