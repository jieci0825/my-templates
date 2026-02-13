import { ref, onMounted } from 'vue'
import type { TableApiFn, PaginationConfig } from '../types'

interface UseTableDataOptions {
    api: TableApiFn
    paginationConfig?: PaginationConfig
    immediate?: boolean
    getSearchModel?: () => Record<string, any>
    responseMapping?: { data?: string; total?: string }
}

/**
 * 表格数据请求与分页状态管理
 */
export function useTableData(options: UseTableDataOptions) {
    const { api, paginationConfig, immediate = true, getSearchModel = () => ({}), responseMapping } = options

    const data = ref<Record<string, any>[]>([])
    const loading = ref(false)
    const pagination = ref({
        page: 1,
        pageSize: paginationConfig?.defaultPageSize ?? 10,
        total: 0,
    })

    const dataField = responseMapping?.data ?? 'data'
    const totalField = responseMapping?.total ?? 'total'

    /** 执行数据请求 */
    async function fetchData() {
        loading.value = true
        try {
            const params = {
                page: pagination.value.page,
                pageSize: pagination.value.pageSize,
                ...getSearchModel(),
            }
            const res: any = await api(params)
            data.value = res[dataField] ?? []
            pagination.value.total = res[totalField] ?? 0
        } finally {
            loading.value = false
        }
    }

    /** 使用当前参数重新请求（保持当前页码） */
    async function refresh() {
        await fetchData()
    }

    /** 重置到第一页并请求 */
    async function reload() {
        pagination.value.page = 1
        await fetchData()
    }

    /** 切换页码 */
    function handlePageChange(page: number) {
        pagination.value.page = page
        fetchData()
    }

    /** 切换每页数量 */
    function handleSizeChange(size: number) {
        pagination.value.pageSize = size
        pagination.value.page = 1
        fetchData()
    }

    // 如果immediate为true，则立即请求数据
    if (immediate) {
        onMounted(() => {
            fetchData()
        })
    }

    return {
        data,
        loading,
        pagination,
        fetchData,
        refresh,
        reload,
        handlePageChange,
        handleSizeChange,
    }
}
