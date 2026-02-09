export interface LockState {
    /** 是否处于锁定状态 */
    isLocked: boolean
    /** 锁定密码（加密后） */
    lockPassword: string | null
}
