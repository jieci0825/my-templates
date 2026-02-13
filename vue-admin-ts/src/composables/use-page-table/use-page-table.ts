import { defineComponent, h, ref } from 'vue'
import type { ProTableExpose } from '@/components/pro-table/types'
import type { UsePageTableOptions, PageTableApi } from './types'
import ProTable from '@/components/pro-table/index.vue'

/** 创建配置式页面表格 */
export function usePageTable(options: UsePageTableOptions) {
    const tableRef = ref<ProTableExpose>()
    const config = ref(options)

    /** 动态更新配置 */
    function updateConfig(patch: Partial<UsePageTableOptions>) {
        config.value = { ...config.value, ...patch }
    }

    const Wrapper = defineComponent({
        name: 'PageTable',
        setup(_, { attrs, slots }) {
            return () => {
                const { title: _, ...tableProps } = config.value

                return h(ProTable, { ref: tableRef, ...tableProps, ...attrs }, slots)
            }
        },
    })

    const tableApi: PageTableApi = {
        refresh: () => tableRef.value?.refresh() ?? Promise.resolve(),
        reload: () => tableRef.value?.reload() ?? Promise.resolve(),
        getSelectedRows: () => tableRef.value?.getSelectedRows() ?? [],
        clearSelection: () => tableRef.value?.clearSelection(),
        getSearchModel: () => tableRef.value?.getSearchModel() ?? {},
        getElTableRef: () => tableRef.value?.getElTableRef()!,
        updateConfig,
    }

    return [Wrapper, tableApi] as const
}
