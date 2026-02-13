<script setup lang="ts">
import {
    ref,
    computed,
    provide,
    watch,
    useSlots,
    onBeforeMount,
    onMounted,
    onUnmounted,
    onActivated,
    onDeactivated,
} from 'vue'
import type { VNode, VNodeArrayChildren } from 'vue'
import type { BreakPoint } from './types'

interface Props {
    cols?: number | Record<BreakPoint, number>
    collapsed?: boolean
    collapsedRows?: number
    gap?: [number, number] | number
}

const props = withDefaults(defineProps<Props>(), {
    cols: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }),
    // 是否折叠，默认不折叠
    collapsed: false,
    // 折叠行数，默认1行
    collapsedRows: 1,
    // 间距，默认0
    gap: 0,
})

// ---- 断点检测 ----
//  - 即根据窗口宽度，自动检测当前的断点

const breakPoint = ref<BreakPoint>('xl')

function handleResize(e: UIEvent) {
    const width = (e.target as Window).innerWidth
    if (width < 768) breakPoint.value = 'xs'
    else if (width < 992) breakPoint.value = 'sm'
    else if (width < 1200) breakPoint.value = 'md'
    else if (width < 1920) breakPoint.value = 'lg'
    else breakPoint.value = 'xl'
}

function initBreakPoint() {
    handleResize({ target: { innerWidth: window.innerWidth } } as unknown as UIEvent)
}

onMounted(() => {
    initBreakPoint()
    window.addEventListener('resize', handleResize)
})
onActivated(() => {
    initBreakPoint()
    window.addEventListener('resize', handleResize)
})
onUnmounted(() => window.removeEventListener('resize', handleResize))
onDeactivated(() => window.removeEventListener('resize', handleResize))

// ---- Grid 列数 ----

const gridCols = computed(() => {
    if (typeof props.cols === 'object') return props.cols[breakPoint.value] ?? 4
    return props.cols
})

// ---- 折叠索引计算 ----

const hiddenIndex = ref(-1)
const slotFn = useSlots().default!

function findIndex() {
    const children = slotFn()

    let fields: VNodeArrayChildren = []
    let suffix: VNode | null = null

    for (const slot of children) {
        // 处理 v-for 产生的包裹节点这种特殊情况
        /**
        slots.default() = [
            Fragment (Symbol)         ← v-for 产生的包裹节点
                ├── GridItem VNode      ← column[0]
                ├── GridItem VNode      ← column[1]
                └── GridItem VNode      ← column[2]
            GridItem VNode (suffix)   ← 单独写的，直接就是组件 VNode
        ]
         */
        if (typeof slot.type === 'object' && slot.props?.suffix !== undefined) {
            suffix = slot
        }
        if (typeof slot.type === 'symbol' && Array.isArray(slot.children)) {
            fields.push(...slot.children)
        }
    }

    // 计算 suffix 需要占据的列数
    let suffixCols = 0
    if (suffix) {
        suffixCols =
            (suffix.props?.[breakPoint.value]?.span ?? suffix.props?.span ?? 1) +
            (suffix.props?.[breakPoint.value]?.offset ?? suffix.props?.offset ?? 0)
    }

    // 逐个累加字段列数，找到溢出的那个索引
    try {
        let find = false
        fields.reduce<number>((prev, current, index) => {
            const cur = current as VNode
            prev +=
                (cur.props?.[breakPoint.value]?.span ?? cur.props?.span ?? 1) +
                (cur.props?.[breakPoint.value]?.offset ?? cur.props?.offset ?? 0)
            if (prev > props.collapsedRows * gridCols.value - suffixCols) {
                hiddenIndex.value = index
                find = true
                // 利用 throw 跳出 reduce
                throw 'found'
            }
            return prev
        }, 0)
        if (!find) hiddenIndex.value = -1
    } catch {}
}

onBeforeMount(() => {
    if (props.collapsed) findIndex()
})

watch(
    () => breakPoint.value,
    () => {
        if (props.collapsed) findIndex()
    },
)

watch(
    () => props.collapsed,
    (val) => {
        if (val) return findIndex()
        hiddenIndex.value = -1
    },
)

// ---- Provide ----

provide('grid-breakPoint', breakPoint)
provide('grid-cols', gridCols)
provide('grid-shouldHiddenIndex', hiddenIndex)
provide('grid-gap', Array.isArray(props.gap) ? props.gap[0] : props.gap)

// ---- 样式 ----

const gridGap = computed(() => {
    if (typeof props.gap === 'number') return `${props.gap}px`
    if (Array.isArray(props.gap)) return `${props.gap[1]}px ${props.gap[0]}px`
    return 'unset'
})

const gridStyle = computed(() => ({
    display: 'grid',
    gridGap: gridGap.value,
    // 重复gridCols.value列，每列最小宽度为0，最大宽度为1fr
    gridTemplateColumns: `repeat(${gridCols.value}, minmax(0, 1fr))`,
}))

defineExpose({ breakPoint })
</script>

<template>
    <div :style="gridStyle">
        <slot />
    </div>
</template>
