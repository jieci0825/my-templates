<script setup lang="ts">
defineProps<{
    title: string
}>()
</script>

<template>
    <section class="setting-section">
        <h4 class="setting-section__title">{{ title }}</h4>
        <div class="setting-section__body">
            <slot />
        </div>
    </section>
</template>

<style scoped lang="scss">
.setting-section {
    &__title {
        font-size: 13px;
        font-weight: 600;
        color: var(--el-text-color-secondary);
        margin: 0 0 14px;
        letter-spacing: 0.5px;
    }
}
</style>
