<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { usePreferredDark } from '@vueuse/core'
import { useSettingsStore, useUserStore } from '@/stores'

const settingsStore = useSettingsStore()
const userStore = useUserStore()
const prefersDark = usePreferredDark()

const appTitle = import.meta.env.VITE_TITLE

/** 水印内容 - 优先使用用户名 */
const watermarkContent = computed(() => {
    return userStore.userInfo?.username || appTitle
})

/** 是否显示水印 */
const isVisible = computed(() => settingsStore.settingState.isNeedWatermark)

/** 当前是否处于深色模式 */
const isDark = computed(() => {
    const theme = settingsStore.settingState.theme
    if (theme === 'dark') return true
    if (theme === 'light') return false
    return prefersDark.value
})

/** 根据主题获取水印填充色 */
const watermarkColor = computed(() => {
    return isDark.value ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'
})

/** 在指定位置绘制旋转文字 */
const drawRotatedText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, angle: number) => {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.fillText(text, 0, 0)
    ctx.restore()
}

/** 生成水印图片（交错排列瓦片） */
const generateWatermark = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    const text = watermarkContent.value
    const fontSize = 16
    const angle = -22 * (Math.PI / 180)

    // 测量文本宽度
    ctx.font = `${fontSize}px sans-serif`
    const textWidth = ctx.measureText(text).width

    // 单元格尺寸 = 文本尺寸 + 间距
    const cellW = textWidth + 200
    const cellH = fontSize + 140

    // 瓦片：1 列宽 × 2 行高，第二行水平偏移半个单元格，形成砖墙式交错
    canvas.width = cellW
    canvas.height = cellH * 2

    // canvas 尺寸变更后需重新设置绑定状态
    ctx.font = `${fontSize}px sans-serif`
    ctx.fillStyle = watermarkColor.value
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // 第一行：居中绘制
    drawRotatedText(ctx, text, cellW / 2, cellH / 2, angle)

    // 第二行：偏移半个单元格宽度（绘制在左边缘，平铺时与相邻瓦片无缝衔接）
    drawRotatedText(ctx, text, 0, cellH * 1.5, angle)
    drawRotatedText(ctx, text, cellW, cellH * 1.5, angle)

    return canvas.toDataURL('image/png')
}

/** 水印背景图 */
const watermarkBg = ref('')

/** 更新水印 */
const updateWatermark = () => {
    if (isVisible.value) {
        watermarkBg.value = generateWatermark()
    }
}

// 监听水印内容、显示状态、主题变化
watch(
    [watermarkContent, isVisible, watermarkColor],
    () => {
        updateWatermark()
    },
    { immediate: true },
)
</script>

<template>
    <Teleport to="body">
        <div
            v-if="isVisible && watermarkBg"
            class="global-watermark"
            :style="{ backgroundImage: `url(${watermarkBg})` }"
        />
    </Teleport>
</template>

<style scoped lang="scss">
.global-watermark {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    background-repeat: repeat;
}
</style>
