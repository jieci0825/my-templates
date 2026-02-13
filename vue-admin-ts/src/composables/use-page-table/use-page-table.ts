import type { Component } from 'vue'
import type { UsePageTableOptions, PageTableApi } from './types'

/**
 * 页面级表格组合式函数
 *
 * @example
 * ```ts
 * const [Table, tableApi] = usePageTable({
 *   columns: [...],
 *   api: fetchUserList,
 *   search: { columns: [...] },
 *   selectable: true
 * })
 * ```
 */
export function usePageTable(options: UsePageTableOptions): [Component, PageTableApi] {
    // TODO: 实现页面级表格逻辑

    const Table = {} as Component

    const api: PageTableApi = {
        refresh: async () => {},
        reload: async () => {},
        getSelectedRows: () => [],
        clearSelection: () => {},
        getSearchModel: () => ({}),
        getElTableRef: () => ({}) as any,
        updateConfig: (patch: Partial<UsePageTableOptions>) => {},
    }

    return [Table, api]
}
