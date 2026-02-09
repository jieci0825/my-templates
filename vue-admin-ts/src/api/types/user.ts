/**
 * 用户相关接口类型定义
 */

export interface UserInfoVO {
    id: number
    username: string
    nickname: string
    avatar: string
    roleId: number
    menus: MenuVO[]
    permissions: string[]
}

/** menuItem 视图对象 */
export interface MenuVO {
    id: number
    name: string
    type: number
    path: string | undefined
    sort: number
    parentId: number
    status: number
    title: string
    icon: string | undefined
    isExternal: number
    isCache: number
    isAffix: number
    children?: MenuVO[]
}
