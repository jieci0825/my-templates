<script lang="ts">
export default { name: 'GridItem' }
</script>

<script setup lang="ts">
import { computed, inject, ref, useAttrs, watch } from 'vue'
import type { Ref } from 'vue'
import type { BreakPoint, Responsive } from '../types'

interface Props {
    // 列宽
    span?: number
    // 偏移量
    offset?: number
    // 是否为后缀
    suffix?: boolean
    xs?: Responsive
    sm?: Responsive
    md?: Responsive
    lg?: Responsive
    xl?: Responsive
}

const props = withDefaults(defineProps<Props>(), {
    span: 1,
    offset: 0,
    suffix: false,
})

const attrs = useAttrs() as { index?: string }
const isShow = ref(true)

const breakPoint = inject<Ref<BreakPoint>>('grid-breakPoint', ref('xl'))
const hiddenIndex = inject<Ref<number>>('grid-shouldHiddenIndex', ref(-1))
const cols = inject<Ref<number>>('grid-cols', ref(4))
const gap = inject<number>('grid-gap', 0)

// ---- 显隐控制 ----

watch(
    () => [hiddenIndex.value, breakPoint.value],
    ([idx]) => {
        if (attrs.index != null) {
            isShow.value = !(idx !== -1 && parseInt(attrs.index!) >= Number(idx))
        }
    },
    { immediate: true },
)

// ---- 样式计算 ----

const itemStyle = computed(() => {
    const bp = breakPoint.value
    const span = props[bp]?.span ?? props.span
    const offset = props[bp]?.offset ?? props.offset

    if (props.suffix) {
        return {
            gridColumnStart: cols.value - span - offset + 1,
            gridColumnEnd: `span ${span + offset}`,
            /**
             * 让元素的 gridColumn 同时占据 span + offset 列的空间，然后用 marginLeft 把内容向右推，腾出左边 offset 列的空白区域
             */
            marginLeft: offset ? `calc(((100% + ${gap}px) / ${span + offset}) * ${offset})` : 'unset',
        }
    }

    const total = span + offset > cols.value ? cols.value : span + offset
    return {
        gridColumn: `span ${total} / span ${total}`,
        marginLeft: offset ? `calc(((100% + ${gap}px) / ${total}) * ${offset})` : 'unset',
    }
})
</script>

<template>
    <div
        v-show="isShow"
        :style="itemStyle"
    >
        <slot />
    </div>
</template>
