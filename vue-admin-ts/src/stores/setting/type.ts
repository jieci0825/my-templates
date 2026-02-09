export type Theme = 'light' | 'dark' | 'system'
export type Layout = 'vertical' | 'horizontal'
export type PageTransitionType = 'none' | 'fade' | 'slide-left' | 'slide-bottom' | 'slide-top'

/** 设置项 */
export interface SettingState {
    /** 主题 */
    theme: Theme
    /** 布局 */
    layout: Layout
    /** 侧边栏宽度 */
    sidebarWidth: number
    /** 侧边栏是否折叠 */
    sidebarCollapsed: boolean
    /** 是否显示标签栏 */
    isShowTags: boolean
    /** 是否需要水印 */
    isNeedWatermark: boolean
    /** 显示面包屑 */
    isShowBreadcrumb: boolean
    /** 显示进度条 */
    isShowProgress: boolean
    /** 显示全屏 */
    isShowFullscreen: boolean
    /** 页面切换动画类型 */
    pageTransitionType: PageTransitionType
    /** 设置抽屉是否可见 */
    settingsDrawerVisible: boolean
    /** 预设主色（null 表示使用默认主题） */
    primaryColor: string | null
}
