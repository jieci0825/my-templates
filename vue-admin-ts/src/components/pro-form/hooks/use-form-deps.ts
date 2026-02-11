import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { FormItemRule } from 'element-plus'
import type { ProFormColumn, FormApi } from '../types'

/** 处理 dependencies 联动逻辑：监听 triggerFields 变化，执行各项回调并返回响应式状态 */
export function useFormDeps(column: Ref<ProFormColumn>, model: Record<string, any>, formApi: FormApi) {
    /** 是否渲染 */
    const shouldRender = ref(true)
    /** 是否显示 */
    const shouldShow = ref(true)
    /** 是否禁用 */
    const isDisabled = ref(false)
    /** 动态校验规则 */
    const dynamicRules = ref<FormItemRule[]>([])
    /** 是否必填 */
    const isRequired = ref(false)
    /** 动态组件 props */
    const dynamicComponentProps = ref<Record<string, any>>({})

    /** 根据当前 model 值执行所有联动回调 */
    function evaluate() {
        const deps = column.value.dependencies
        if (!deps) return

        const values = { ...model }

        if (deps.if) {
            const prev = shouldRender.value
            shouldRender.value = deps.if(values, formApi)
            // 从渲染变为不渲染时，清除该字段的 model 值
            if (prev && !shouldRender.value) {
                model[column.value.field] = column.value.defaultValue ?? null
            }
        }

        if (deps.show) {
            shouldShow.value = deps.show(values, formApi)
        }

        if (deps.disabled) {
            isDisabled.value = deps.disabled(values, formApi)
        }

        if (deps.trigger) {
            deps.trigger(values, formApi)
        }

        if (deps.rules) {
            dynamicRules.value = deps.rules(values, formApi)
        }

        if (deps.required) {
            isRequired.value = deps.required(values, formApi)
        }

        if (deps.componentProps) {
            dynamicComponentProps.value = deps.componentProps(values, formApi)
        }
    }

    /** 监听 triggerFields 变化，执行各项回调并返回响应式状态 */
    watch(
        () => {
            const deps = column.value.dependencies
            if (!deps) return undefined
            return deps.triggerFields.map((field) => model[field])
        },
        () => evaluate(),
        { immediate: true, deep: true },
    )

    return {
        shouldRender,
        shouldShow,
        isDisabled,
        dynamicRules,
        isRequired,
        dynamicComponentProps,
    }
}
