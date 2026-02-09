import type { UserInfoVO, MenuVO } from '@/api/types/user'

export interface UserState {
    userInfo: UserInfoVO | null
    menus: MenuVO[]
    permissions: string[]
}
