import type { ProFormProps, ProFormExpose } from '@/components/pro-form/types'

/** usePageForm 配置项 */
export interface UsePageFormOptions extends ProFormProps {
    /** 重置按钮文本 */
    resetText?: string
    /** 提交按钮文本 */
    submitText?: string
    /** 提交回调（校验通过后触发） */
    onSubmit?: (model: Record<string, any>) => void
    /** 重置回调 */
    onReset?: () => void
}

/** usePageForm 返回的表单 API */
export interface PageFormApi extends ProFormExpose {
    /** 动态更新配置 */
    updateConfig: (patch: Partial<UsePageFormOptions>) => void
}
