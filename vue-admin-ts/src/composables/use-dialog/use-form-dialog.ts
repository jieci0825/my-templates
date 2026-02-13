import { ref, computed, reactive, toRaw } from 'vue'
import { ElMessage } from 'element-plus'
import type { UseFormDialogOptions, FormDialogApi } from './types'

/** 管理表单弹窗的数据提交和验证 */
export function useFormDialog<T extends Record<string, any>>(
    options: UseFormDialogOptions<T>
): FormDialogApi<T> {
    const visible = ref(false)
    const title = ref(options.title ?? '')
    const loading = ref(false)
    const formData = reactive<T>({} as T)
    const modeKey = options.modeKey ?? 'id'

    const mode = computed<'create' | 'edit'>(() => {
        return formData[modeKey] ? 'edit' : 'create'
    })

    function resetFormData() {
        Object.keys(formData).forEach(key => {
            delete formData[key]
        })
        if (options.initialFormData) {
            Object.assign(formData, options.initialFormData)
        }
    }

    function open(data?: T, newTitle?: string) {
        const shouldOpen = options.onBeforeOpen?.(data)
        if (shouldOpen === false) return

        visible.value = true
        if (newTitle) title.value = newTitle
        if (data) {
            Object.assign(formData, data)
        }

        options.onOpened?.(data ?? null)
    }

    function openCreate(initialData?: Partial<T>, newTitle?: string) {
        resetFormData()
        if (initialData) {
            Object.assign(formData, initialData)
        }
        open(undefined, newTitle ?? title.value)
    }

    function openEdit(data: T, newTitle?: string) {
        resetFormData()
        Object.assign(formData, data)
        open(undefined, newTitle ?? title.value)
    }

    function close() {
        const shouldClose = options.onBeforeClose?.()
        if (shouldClose === false) return

        visible.value = false
        resetFormData()
        options.onClosed?.()
    }

    async function submit() {
        if (options.validate) {
            const valid = await options.validate()
            if (!valid) return
        }

        const submitData = { ...toRaw(formData) } as T

        if (options.onBeforeSubmit) {
            const transformed = options.onBeforeSubmit(submitData)
            if (transformed === false) return
            Object.assign(submitData, transformed)
        }

        loading.value = true

        try {
            const result = await options.onSubmit(submitData, mode.value)

            options.onSubmitSuccess?.(result, submitData)

            if (options.autoCloseOnSuccess !== false) {
                close()
            }
        } catch (error) {
            options.onSubmitError?.(error)
            ElMessage.error('提交失败')
        } finally {
            loading.value = false
        }
    }

    function setTitle(newTitle: string) {
        title.value = newTitle
    }

    function setData(data: T) {
        Object.assign(formData, data)
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
            return formData as T
        },
        set data(val: T | null) {
            if (val) {
                Object.assign(formData, val)
            }
        },
    })

    return {
        state: state as any,
        formData: formData as T,
        get loading() {
            return loading.value
        },
        get mode() {
            return mode.value
        },
        open,
        openCreate,
        openEdit,
        close,
        submit,
        resetData: resetFormData,
        resetFormData,
        setTitle,
        setData,
    }
}
