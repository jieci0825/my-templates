import { computed, unref, type MaybeRef } from 'vue'
import type { ProTableColumn } from '../types'

/**
 * 表格列处理（显隐控制）
 */
export function useTableColumns(columns: MaybeRef<ProTableColumn[]>) {
    const visibleColumns = computed(() => {
        return unref(columns).filter(col => !col.hidden)
    })

    return {
        visibleColumns,
    }
}
