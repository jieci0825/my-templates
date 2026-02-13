import type { InjectionKey } from 'vue'

/** ProTable 上下文类型 */
export interface ProTableContext {
    // TODO: 定义需要通过 provide/inject 共享的状态
}

/** ProTable 上下文注入 key */
export const ProTableContextKey: InjectionKey<ProTableContext> = Symbol('ProTableContext')
