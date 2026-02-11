import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { OptionItem, FieldNames } from '../types'
import { isFunction } from '@/utils'

/** 处理选项数据：支持静态数组和异步函数，自动根据 fieldNames 标准化 */
export function useFormOptions(
    options: Ref<OptionItem[] | (() => Promise<OptionItem[]>) | undefined>,
    fieldNames: Ref<FieldNames | undefined>,
) {
    // 标准化后的选项数据
    const resolvedOptions = ref<OptionItem[]>([])
    // 是否正在加载选项数据
    const loading = ref(false)

    /** 根据 fieldNames 将原始数据映射为标准 OptionItem 结构 */
    function normalizeOptions(items: any[]): OptionItem[] {
        // 确定标签和值的键名
        const labelKey = fieldNames.value?.label ?? 'label'
        const valueKey = fieldNames.value?.value ?? 'value'

        return items.map((item) => ({
            label: item[labelKey],
            value: item[valueKey],
            disabled: item.disabled,
            ...(item.children ? { children: normalizeOptions(item.children) } : {}),
        }))
    }

    /** 加载并标准化选项数据 */
    async function loadOptions() {
        const raw = options.value

        // 如果选项数据为空，则清空标准化后的选项数据
        if (!raw) {
            resolvedOptions.value = []
            return
        }

        // 如果选项数据为数组，则标准化选项数据
        if (Array.isArray(raw)) {
            resolvedOptions.value = normalizeOptions(raw)
            return
        }

        // 如果选项数据为函数，则加载选项数据
        if (isFunction(raw)) {
            loading.value = true
            try {
                const result = await raw()
                resolvedOptions.value = normalizeOptions(result)
            } finally {
                loading.value = false
            }
        }
    }

    loadOptions()
    watch(options, () => loadOptions())

    return { resolvedOptions, loading }
}
