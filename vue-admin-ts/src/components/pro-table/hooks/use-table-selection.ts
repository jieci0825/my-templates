import { ref, computed, watch, nextTick, type Ref } from 'vue'
import type { TableInstance } from 'element-plus'

interface UseTableSelectionOptions {
    tableRef: Ref<TableInstance | undefined>
    data: Ref<Record<string, any>[]>
    rowKey: string
    persist: boolean
    storageKey?: string
    defaultSelectedKeys?: (string | number)[]
}

/**
 * 表格行选择状态管理（支持跨页多选 + 默认选中 + 可选 localStorage 持久化）
 */
export function useTableSelection(options: UseTableSelectionOptions) {
    const { tableRef, data, rowKey, persist, storageKey, defaultSelectedKeys } = options

    /** 选中 key 集合 —— 选中状态的唯一真相源 */
    const selectedKeySet = new Set<string | number>()

    /** 选中行数据 Map —— 惰性填充，仅包含已加载过的行 */
    const selectedRowMap = new Map<string | number, Record<string, any>>()

    /** 触发响应式更新的版本号 */
    const version = ref(0)

    // ---- 初始化（合并策略：defaultSelectedKeys + localStorage 取并集） ----

    // 1. defaultSelectedKeys → 写入 Set
    if (defaultSelectedKeys?.length) {
        for (const key of defaultSelectedKeys) {
            selectedKeySet.add(key)
        }
    }

    // 2. localStorage → 写入 Set + Map（与步骤 1 取并集）
    if (persist && storageKey) {
        try {
            const stored = localStorage.getItem(storageKey)
            if (stored) {
                const arr = JSON.parse(stored) as Record<string, any>[]
                for (const row of arr) {
                    const key = row[rowKey]
                    if (key != null) {
                        selectedKeySet.add(key)
                        selectedRowMap.set(key, row)
                    }
                }
            }
        } catch {
            // 存储数据异常，忽略
        }
    }

    if (selectedKeySet.size > 0) {
        version.value++
    }

    /** 持久化到 localStorage（仅保存 Map 中有完整数据的行） */
    function saveToStorage() {
        if (!persist || !storageKey) return
        try {
            const arr = Array.from(selectedRowMap.values())
            localStorage.setItem(storageKey, JSON.stringify(arr))
        } catch {
            // 写入失败，忽略
        }
    }

    /**
     * 用户点击单行复选框时触发
     * 对应 el-table 的 select 事件（仅用户手动操作触发，不受 toggleRowSelection 影响）
     */
    function handleSelect(_newSelection: Record<string, any>[], clickedRow: Record<string, any>) {
        const key = clickedRow[rowKey]
        if (key == null) return

        if (selectedKeySet.has(key)) {
            selectedKeySet.delete(key)
            selectedRowMap.delete(key)
        } else {
            selectedKeySet.add(key)
            selectedRowMap.set(key, clickedRow)
        }

        version.value++
        saveToStorage()
    }

    /**
     * 用户点击全选复选框时触发
     * 对应 el-table 的 select-all 事件
     */
    function handleSelectAll(newSelection: Record<string, any>[]) {
        const isSelectAll = newSelection.length > 0

        for (const row of data.value) {
            const key = row[rowKey]
            if (key == null) continue
            if (isSelectAll) {
                selectedKeySet.add(key)
                selectedRowMap.set(key, row)
            } else {
                selectedKeySet.delete(key)
                selectedRowMap.delete(key)
            }
        }

        version.value++
        saveToStorage()
    }

    /** 恢复当前页的选中状态，同时将匹配行的完整数据同步到 Map */
    function restoreSelection() {
        const table = tableRef.value
        if (!table || selectedKeySet.size === 0) return

        for (const row of data.value) {
            const key = row[rowKey]
            if (key != null && selectedKeySet.has(key)) {
                selectedRowMap.set(key, row)
                table.toggleRowSelection(row, true)
            }
        }
    }

    // 监听数据变化，恢复选中状态
    watch(data, () => {
        nextTick(restoreSelection)
    })

    /** 获取所有选中行数据（仅返回已加载过的行） */
    function getSelectedRows(): Record<string, any>[] {
        void version.value
        return Array.from(selectedRowMap.values())
    }

    /** 清除所有选中 */
    function clearSelection() {
        selectedKeySet.clear()
        selectedRowMap.clear()
        tableRef.value?.clearSelection()
        version.value++
        saveToStorage()
    }

    /** 选中行数量（响应式，基于 Set 始终准确） */
    const selectedCount = computed(() => {
        void version.value
        return selectedKeySet.size
    })

    return {
        selectedCount,
        handleSelect,
        handleSelectAll,
        getSelectedRows,
        clearSelection,
    }
}
