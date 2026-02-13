import type { VNode } from 'vue'
import type { TableInstance } from 'element-plus'
import type { ProFormColumn } from '@/components/pro-form/types'
import type { BreakPoint } from '@/components/grid/types'

/** 表格列配置 */
export interface ProTableColumn {
    /** 字段名，对应数据源的 key */
    field: string
    /** 列标题 */
    label: string
    /** 列宽度 */
    width?: number | string
    /** 列最小宽度 */
    minWidth?: number | string
    /** 固定列 */
    fixed?: 'left' | 'right'
    /** 对齐方式，默认 'left' */
    align?: 'left' | 'center' | 'right'

    /** 简单值格式化（返回字符串） */
    formatter?: (row: Record<string, any>, cellValue: any, rowIndex: number) => string
    /** 渲染函数（返回 VNode，优先级高于 formatter） */
    render?: (scope: { row: Record<string, any>; cellValue: any; rowIndex: number }) => VNode
    /** 插槽名称（优先级高于 render） */
    slot?: string

    /** 列显隐控制 */
    hidden?: boolean

    /** 透传 el-table-column 原生属性 */
    columnProps?: Record<string, any>
}

/** 搜索区域配置 */
export interface ProTableSearchConfig {
    /** 搜索字段配置，复用 ProForm 的列配置格式 */
    columns: ProFormColumn[]
    /**
     * 搜索栅格列数配置
     * 固定数字或按断点配置，默认 { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
     * 每个搜索字段可通过 span 指定占几列（默认 1）
     */
    searchCol?: number | Record<BreakPoint, number>
    /** Grid 间距，默认 [20, 0] */
    gap?: [number, number] | number
    /** 标签宽度 */
    labelWidth?: string | number
    /**
     * 折叠行数，默认 1
     * 设置为 false 禁用折叠（不出现折叠按钮，全部展示）
     */
    defaultCollapsedRows?: number | false
}

/** 分页参数 */
export interface PaginationParams {
    page: number
    pageSize: number
}

/** API 返回的数据结构 */
export interface TableApiResult<T = Record<string, any>> {
    data: T[]
    total: number
}

/** 数据请求函数签名 */
export type TableApiFn<T = Record<string, any>> = (
    params: PaginationParams & Record<string, any>,
) => Promise<TableApiResult<T>>

/** 分页配置 */
export interface PaginationConfig {
    /** 默认页大小，默认 10 */
    defaultPageSize?: number
    /** 可选的页大小列表，默认 [10, 20, 50, 100] */
    pageSizes?: number[]
    /** 是否隐藏分页，默认 false */
    hidden?: boolean
}

/** ProTable 组件 Props */
export interface ProTableProps {
    /** 表格列配置 */
    columns: ProTableColumn[]
    /** 数据请求函数 */
    api: TableApiFn
    /** 搜索区域配置，不传则不显示搜索区 */
    search?: ProTableSearchConfig
    /** 分页配置 */
    pagination?: PaginationConfig
    /** 是否初始化时自动请求，默认 true */
    immediate?: boolean
    /** 是否显示多选列，默认 false */
    selectable?: boolean
    /** 行唯一标识字段，默认 'id' */
    rowKey?: string
    /** 是否持久化选中状态到 localStorage，默认 false（仅内存缓存） */
    selectionPersist?: boolean
    /** localStorage 存储 key，selectionPersist 为 true 时需要提供，不提供则按当前路径自动生成 */
    selectionStorageKey?: string
    /** 默认选中行的 key 值数组（仅初始化时生效） */
    defaultSelectedKeys?: (string | number)[]

    /** 透传 el-table 原生属性 */
    tableProps?: Record<string, any>

    /** API 响应数据字段映射 */
    responseMapping?: {
        data?: string // 默认 'data'
        total?: string // 默认 'total'
    }
}

/** ProTable 暴露给外部的 API */
export interface ProTableExpose {
    /** 使用当前参数重新请求（保持当前页码） */
    refresh: () => Promise<void>
    /** 重置到第一页并请求 */
    reload: () => Promise<void>
    /** 获取当前选中的行数据 */
    getSelectedRows: () => Record<string, any>[]
    /** 清除选中状态 */
    clearSelection: () => void
    /** 获取当前搜索参数 */
    getSearchModel: () => Record<string, any>
    /** 获取 el-table 实例 */
    getElTableRef: () => TableInstance
}
