import { defineComponent, h, ref } from 'vue'
import { ElButton } from 'element-plus'
import type { ProFormExpose } from '@/components/pro-form/types'
import type { UsePageFormOptions, PageFormApi } from './types'
import ProForm from '@/components/pro-form/index.vue'

/** 创建带提交/重置按钮的配置式表单 */
export function usePageForm(options: UsePageFormOptions) {
    const formRef = ref<ProFormExpose>()
    const config = ref(options)

    /** 动态更新配置 */
    function updateConfig(patch: Partial<UsePageFormOptions>) {
        config.value = { ...config.value, ...patch }
    }

    /** 校验通过后触发提交回调 */
    async function handleSubmit() {
        const valid = await formRef.value!.validate()
        if (!valid) return
        config.value.onSubmit?.(formRef.value!.getModel())
    }

    /** 重置表单并清除校验 */
    function handleReset() {
        formRef.value!.resetModel()
        formRef.value!.clearValidate()
        config.value.onReset?.()
    }

    const Wrapper = defineComponent({
        name: 'PageForm',
        setup(_, { attrs, slots }) {
            return () => {
                const { onSubmit: _, onReset: __, submitText, resetText, ...formProps } = config.value

                return h('div', { class: 'page-form' }, [
                    h(ProForm, { ref: formRef, ...formProps, ...attrs }, slots),
                    h('div', {
                        style: {
                            display: 'flex',
                            justifyContent: 'flex-end',
                            paddingTop: '16px',
                        },
                    }, [
                        h(ElButton, { onClick: handleReset }, () => resetText ?? '重置'),
                        h(ElButton, { type: 'primary', onClick: handleSubmit }, () => submitText ?? '提交'),
                    ]),
                ])
            }
        },
    })

    const formApi: PageFormApi = {
        getModel: () => formRef.value?.getModel() ?? {},
        setModel: (values) => formRef.value?.setModel(values),
        resetModel: () => formRef.value?.resetModel(),
        validate: () => formRef.value?.validate() ?? Promise.resolve(false),
        clearValidate: () => formRef.value?.clearValidate(),
        getElFormRef: () => formRef.value?.getElFormRef()!,
        updateConfig,
    }

    return [Wrapper, formApi] as const
}
