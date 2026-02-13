<script setup lang="ts">
interface Emits {
    (e: 'refresh'): void
}

defineEmits<Emits>()
</script>

<template>
    <div class="pro-table-toolbar">
        <div class="pro-table-toolbar__left">
            <slot name="toolbar" />
        </div>
        <div class="pro-table-toolbar__right">
            <!-- TODO: 添加刷新按钮 -->
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
    flex: 1;
}

.pro-table-toolbar__right {
    display: flex;
    gap: 8px;
}
</style>
