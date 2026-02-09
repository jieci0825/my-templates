/**
 * 获取当前环境的基础 URL
 */
export const getBaseUrl = (): string => {
    return import.meta.env.VITE_BASE_URL
}

/**
 * 获取应用标题
 */
export const getAppTitle = (): string => {
    return import.meta.env.VITE_TITLE
}

/**
 * 判断是否为开发环境
 */
export const isDev = (): boolean => {
    return import.meta.env.DEV
}

/**
 * 判断是否为生产环境
 */
export const isProd = (): boolean => {
    return import.meta.env.PROD
}

/**
 * 获取当前运行模式
 */
export const getMode = (): string => {
    return import.meta.env.MODE
}
