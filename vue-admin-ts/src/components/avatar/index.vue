<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
    /** 头像图片 URL */
    url?: string
    /** 用户名 */
    username?: string
    /** 头像尺寸，默认 35px */
    size?: number | string
}

const props = withDefaults(defineProps<Props>(), {
    url: '',
    username: '',
    size: 35,
})

/** 图片是否加载失败 */
const imgError = ref(false)

/** 是否显示图片头像 */
const showImage = computed(() => {
    return props.url && !imgError.value
})

/** 显示的文字（用户名最后一个字） */
const avatarText = computed(() => {
    if (!props.username) return ''
    return props.username.slice(-1)
})

/** 计算后的尺寸 */
const computedSize = computed(() => {
    if (typeof props.size === 'number') {
        return `${props.size}px`
    }
    return props.size
})

/** 文字字体大小（头像尺寸的一半） */
const fontSize = computed(() => {
    const sizeNum = typeof props.size === 'number' ? props.size : parseInt(props.size)
    return `${sizeNum * 0.5}px`
})

/** 图片加载失败处理 */
const handleImgError = () => {
    imgError.value = true
}

/** 当 url 变化时重置错误状态 */
watch(
    () => props.url,
    () => {
        imgError.value = false
    },
)
</script>

<template>
    <div
        class="user-avatar"
        :style="{
            width: computedSize,
            height: computedSize,
            fontSize: fontSize,
        }"
    >
        <img v-if="showImage" :src="url" :alt="username" class="avatar-image" @error="handleImgError" />
        <span v-else class="avatar-text">{{ avatarText }}</span>
    </div>
</template>

<style scoped lang="scss">
.user-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
    font-weight: 500;
    overflow: hidden;
    flex-shrink: 0;
    user-select: none;

    .avatar-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .avatar-text {
        text-transform: uppercase;
        line-height: 1;
    }
}
</style>
