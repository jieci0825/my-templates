import { ref, reactive } from 'vue'
import type { UseDialogOptions, DialogApi, DialogState } from './types'

/** 管理弹窗显示/隐藏和基础数据 */
export function useDialog<T = any>(options: UseDialogOptions<T> = {}): DialogApi<T> {
    const visible = ref(false)
    const title = ref(options.title ?? '')
    const data = ref<T | null>(options.initialData ?? null)

    function open(newData?: T, newTitle?: string) {
        const shouldOpen = options.onBeforeOpen?.(newData)
        if (shouldOpen === false) return

        visible.value = true
        data.value = newData ?? null
        if (newTitle) title.value = newTitle

        options.onOpened?.(data.value)
    }

    function close() {
        const shouldClose = options.onBeforeClose?.()
        if (shouldClose === false) return

        visible.value = false
        options.onClosed?.()
    }

    function resetData() {
        data.value = options.initialData ?? null
    }

    function setTitle(newTitle: string) {
        title.value = newTitle
    }

    function setData(newData: T) {
        data.value = newData
    }

    const state = reactive({
        get visible() {
            return visible.value
        },
        set visible(val: boolean) {
            visible.value = val
        },
        get title() {
            return title.value
        },
        set title(val: string) {
            title.value = val
        },
        get data() {
            return data.value
        },
        set data(val: T | null) {
            data.value = val
        },
    }) as DialogState<T>

    return {
        state,
        open,
        close,
        resetData,
        setTitle,
        setData,
    }
}
