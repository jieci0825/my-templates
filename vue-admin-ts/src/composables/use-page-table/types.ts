import type { ProTableProps, ProTableExpose } from '@/components/pro-table/types'

/** usePageTable 配置项 */
export interface UsePageTableOptions extends ProTableProps {
    /** 页面标题（可选，显示在工具栏左侧） */
    title?: string
}

/** usePageTable 返回的表格 API */
export interface PageTableApi extends ProTableExpose {
    /** 动态更新配置 */
    updateConfig: (patch: Partial<UsePageTableOptions>) => void
}
