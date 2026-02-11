import type { InjectionKey, Slots } from 'vue'
import { inject, provide } from 'vue'
import type { FormApi } from './types'

/** ProForm 上下文，跨层级共享表单核心数据 */
export interface ProFormContext {
  /** 响应式表单数据模型 */
  model: Record<string, any>
  /** 表单 API，供子组件和联动回调使用 */
  formApi: FormApi
  /** ProForm 的插槽集合，供 form-item 转发具名插槽 */
  slots: Slots
}

const proFormContextKey: InjectionKey<ProFormContext> = Symbol('proFormContext')

/** 创建并注入上下文（由 index.vue 调用） */
export function createProFormContext(context: ProFormContext) {
  provide(proFormContextKey, context)
}

/** 注入上下文（由子组件调用） */
export function useProFormContext(): ProFormContext {
  const context = inject(proFormContextKey)
  if (!context) {
    throw new Error('useProFormContext() 必须在 ProForm 组件内部使用')
  }
  return context
}
