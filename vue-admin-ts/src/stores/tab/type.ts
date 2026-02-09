/**
 * 标签页项类型
 */
export interface TabItem {
    /** 标签唯一标识（路由路径） */
    path: string
    /** 标签名称 */
    title: string
    /** 图标 */
    icon?: string | null
    /** 是否固定 */
    isAffix?: boolean
    /** 路由 name */
    name?: string
    /** 路由 query 参数 */
    query?: Record<string, any>
}
