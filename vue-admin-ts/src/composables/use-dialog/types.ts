/** 弹窗状态 */
export interface DialogState<T = any> {
    /** 是否显示 */
    visible: boolean
    /** 弹窗标题 */
    title: string
    /** 弹窗数据 */
    data: T | null
}

/** useDialog 配置项 */
export interface UseDialogOptions<T = any> {
    /** 初始标题 */
    title?: string
    /** 初始数据 */
    initialData?: T
    /** 打开前钩子 */
    onBeforeOpen?: (data?: T) => boolean | void
    /** 打开后钩子 */
    onOpened?: (data: T | null) => void
    /** 关闭前钩子 */
    onBeforeClose?: () => boolean | void
    /** 关闭后钩子 */
    onClosed?: () => void
}

/** useDialog 返回的 API */
export interface DialogApi<T = any> {
    /** 弹窗状态 */
    state: DialogState<T>
    /** 打开弹窗 */
    open: (data?: T, title?: string) => void
    /** 关闭弹窗 */
    close: () => void
    /** 重置数据 */
    resetData: () => void
    /** 更新标题 */
    setTitle: (title: string) => void
    /** 更新数据 */
    setData: (data: T) => void
}

/** useFormDialog 配置项 */
export interface UseFormDialogOptions<T = any> extends UseDialogOptions<T> {
    /** 初始表单数据 */
    initialFormData?: T
    /** 提交回调 */
    onSubmit: (formData: T, mode: 'create' | 'edit') => Promise<any> | any
    /** 提交前钩子（可用于数据转换） */
    onBeforeSubmit?: (formData: T) => T | false
    /** 提交成功后钩子 */
    onSubmitSuccess?: (result: any, formData: T) => void
    /** 提交失败后钩子 */
    onSubmitError?: (error: any) => void
    /** 提交成功后是否自动关闭 */
    autoCloseOnSuccess?: boolean
    /** 表单验证方法 */
    validate?: () => Promise<boolean>
    /** 判断模式的字段名 */
    modeKey?: string
}

/** useFormDialog 返回的 API */
export interface FormDialogApi<T = any> extends DialogApi<T> {
    /** 表单数据 */
    formData: T
    /** 提交加载状态 */
    loading: boolean
    /** 当前模式 */
    mode: 'create' | 'edit'
    /** 打开新增弹窗 */
    openCreate: (initialData?: Partial<T>, title?: string) => void
    /** 打开编辑弹窗 */
    openEdit: (data: T, title?: string) => void
    /** 提交表单 */
    submit: () => Promise<void>
    /** 重置表单数据 */
    resetFormData: () => void
}
