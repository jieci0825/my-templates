import request from '@/api/request'
import type { UserInfoVO } from '@/api/types/user'

/**
 * 获取当前登录用户信息
 */
export const getUserInfo = () => {
    return request.get<UserInfoVO>({ url: '/user/info' })
}
