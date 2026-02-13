import type { Ref } from 'vue'
import type { TableInstance } from 'element-plus'

/**
 * 表格行选择状态管理
 */
export function useTableSelection(tableRef: Ref<TableInstance | undefined>) {
    // TODO: 实现行选择逻辑

    return {
        selectedRows: [] as Record<string, any>[],
        getSelectedRows: () => [] as Record<string, any>[],
        clearSelection: () => {},
    }
}
