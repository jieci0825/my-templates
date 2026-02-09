import type { MenuVO } from '@/api/types/user'

/**
 * 菜单项类型
 * 继承自后端返回的 MenuVO，并扩展前端使用的字段
 */
export interface MenuItem extends MenuVO {
    /** 是否隐藏菜单项 */
    hidden?: boolean
    /** 路由元信息 */
    meta?: {
        /** 是否在新窗口打开 */
        openInNewWindow?: boolean
        [key: string]: any
    }
    /** 子菜单 */
    children?: MenuItem[]
}
