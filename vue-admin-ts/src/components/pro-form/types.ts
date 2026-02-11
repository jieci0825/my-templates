import type { VNode } from 'vue'
import type { FormInstance, FormItemProps, FormItemRule, FormRules } from 'element-plus'

/** 表单元素类型 */
export type ProFormColumnEl =
  | 'input'
  | 'select'
  | 'date-picker'
  | 'input-number'
  | 'tree-select'
  | 'switch'
  | 'radio'
  | 'checkbox'
  | 'upload'

/** 选项数据项 */
export interface OptionItem {
  label: string
  value: string | number | boolean
  disabled?: boolean
  children?: OptionItem[]
}

/** 选项字段映射 */
export interface FieldNames {
  label?: string
  value?: string
}

/** 表单 API，暴露给外部及 dependencies 回调使用 */
export interface ProFormExpose {
  /** 获取当前表单数据 */
  getModel: () => Record<string, any>
  /** 设置表单数据（编辑场景回填） */
  setModel: (values: Record<string, any>) => void
  /** 重置为默认值 */
  resetModel: () => void
  /** 触发校验 */
  validate: () => Promise<boolean>
  /** 清除校验状态 */
  clearValidate: () => void
  /** 获取 el-form 实例 */
  getElFormRef: () => FormInstance
}

/** dependencies 回调中接收的表单 API */
export type FormApi = ProFormExpose

/** 联动配置 */
export interface ProFormColumnDependencies {
  /** 触发字段，只有这些字段值变动时联动才会触发 */
  triggerFields: string[]
  /** 动态判断是否渲染（不渲染则销毁，同时清除对应 model 值） */
  if?: (values: Record<string, any>, formApi: FormApi) => boolean
  /** 动态判断是否显示（不显示用 CSS 隐藏，保留 model 值） */
  show?: (values: Record<string, any>, formApi: FormApi) => boolean
  /** 动态判断是否禁用 */
  disabled?: (values: Record<string, any>, formApi: FormApi) => boolean
  /** 字段变更时的回调 */
  trigger?: (values: Record<string, any>, formApi: FormApi) => void
  /** 动态校验规则 */
  rules?: (values: Record<string, any>, formApi: FormApi) => FormItemRule[]
  /** 动态必填 */
  required?: (values: Record<string, any>, formApi: FormApi) => boolean
  /** 动态组件 props */
  componentProps?: (values: Record<string, any>, formApi: FormApi) => Record<string, any>
}

/** 表单项配置 */
export interface ProFormColumn {
  /** 字段名，对应 model 的 key */
  field: string
  /** 标签文本 */
  label: string

  /** 表单元素类型 */
  el?: ProFormColumnEl
  /** 传递给表单元素的 props */
  fieldProps?: Record<string, any>
  /** 传递给 el-form-item 的 props */
  formItemProps?: Partial<FormItemProps>

  /** 选项列表（用于 select / radio / checkbox） */
  options?: OptionItem[] | (() => Promise<OptionItem[]>)
  /** 选项字段映射 */
  fieldNames?: FieldNames

  /** 栅格列宽，覆盖全局 colSpan */
  span?: number

  /** 简单显隐控制 */
  hidden?: boolean | ((model: Record<string, any>) => boolean)

  /** 复杂联动配置（优先级高于 hidden） */
  dependencies?: ProFormColumnDependencies

  /** 默认值 */
  defaultValue?: any

  /** 渲染函数 */
  render?: (scope: { model: Record<string, any> }) => VNode
  /** 插槽名称 */
  slot?: string
}

/** ProForm 组件 Props */
export interface ProFormProps {
  /** 表单项配置 */
  columns: ProFormColumn[]
  /** 默认栅格列宽（1-24），默认 12 */
  colSpan?: number
  /** 是否 inline 布局，默认 false */
  inline?: boolean
  /** el-row 的 gutter，默认 16 */
  gutter?: number
  /** 透传 el-form 原生属性 */
  rules?: FormRules
  labelWidth?: string | number
  labelPosition?: 'left' | 'right' | 'top'
}
