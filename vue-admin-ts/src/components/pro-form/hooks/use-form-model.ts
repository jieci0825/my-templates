import { reactive, toRaw, watch } from 'vue'
import type { Ref } from 'vue'
import type { ProFormColumn } from '../types'

/** 管理表单数据模型：根据 columns 生成响应式 model，提供存取和重置能力 */
export function useFormModel(columns: Ref<ProFormColumn[]>) {
  const model = reactive<Record<string, any>>({})

  /** 根据 columns 初始化 model，仅补充尚不存在的字段 */
  function initModel() {
    for (const column of columns.value) {
      if (!(column.field in model)) {
        model[column.field] = column.defaultValue ?? null
      }
    }
  }

  /** 获取当前表单数据的纯对象副本 */
  function getModel(): Record<string, any> {
    return { ...toRaw(model) }
  }

  /** 批量设置表单数据（编辑场景回填） */
  function setModel(values: Record<string, any>) {
    for (const key of Object.keys(values)) {
      if (key in model) {
        model[key] = values[key]
      }
    }
  }

  /** 重置所有字段为默认值 */
  function resetModel() {
    for (const column of columns.value) {
      model[column.field] = column.defaultValue ?? null
    }
  }

  initModel()

  watch(columns, () => initModel(), { deep: true })

  return { model, getModel, setModel, resetModel }
}
