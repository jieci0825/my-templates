/**
 * 项目名称
 */
function projectName(value, { json }) {
    json.push({ file: 'package.json', merge: { name: value } })
}

/**
 * 是否包含示例页面
 */
function includeExamples(value, { operations }) {
    if (value) return
    operations.push(
        { action: 'delete', pattern: 'src/views/pro-form-example/**' },
        { action: 'delete', pattern: 'src/views/pro-table-example/**' },
        { action: 'delete', pattern: 'src/views/dialog-example/**' },
        { action: 'region-remove', region: 'examples' },
    )
}

/**
 * 是否包含系统管理页面
 */
function includeSystemPages(value, { operations }) {
    if (value) return
    operations.push(
        { action: 'delete', pattern: 'src/views/system-user/**' },
        { action: 'delete', pattern: 'src/views/system-role/**' },
    )
}

/**
 * 是否包含 Mock 服务
 */
function includeMockServer(value, { operations, deps, json }) {
    if (value) return
    operations.push(
        { action: 'delete', pattern: 'mock-server/**' },
        { action: 'region-remove', region: 'mockServer' },
    )
    json.push({
        file: 'package.json',
        removeFields: ['scripts.dev:mock', 'scripts.dev:web'],
        merge: { scripts: { dev: 'vite dev --mode development' } },
    })
    deps.removeDev.push('concurrently', 'wait-on')
}

// ===================== features（多选）子处理器 =====================

/**
 * Tabs 标签页管理
 */
function tabs({ operations }) {
    operations.push(
        { action: 'delete', pattern: 'src/stores/tab/**' },
        { action: 'delete', pattern: 'src/router/guards/tabs.ts' },
        { action: 'delete', pattern: 'src/layouts/components/tabs/**' },
        { action: 'region-remove', region: 'tabs' },
    )
}

/**
 * LockScreen 锁屏
 */
function lockScreen({ operations }) {
    operations.push(
        { action: 'delete', pattern: 'src/stores/lock/**' },
        { action: 'delete', pattern: 'src/components/lock-screen/**' },
        { action: 'region-remove', region: 'lockScreen' },
    )
}

/**
 * NProgress 页面进度条
 */
function nprogress({ operations, deps }) {
    operations.push(
        { action: 'delete', pattern: 'src/router/guards/progress.ts' },
        { action: 'delete', pattern: 'src/styles/nprogress.scss' },
        { action: 'region-remove', region: 'nprogress' },
    )
    deps.remove.push('nprogress')
    deps.removeDev.push('@types/nprogress')
}

/**
 * Watermark 全局水印
 */
function watermark({ operations }) {
    operations.push(
        { action: 'delete', pattern: 'src/components/global-watermark/**' },
        { action: 'region-remove', region: 'watermark' },
    )
}

/**
 * SearchCommand 搜索命令面板
 */
function searchCommand({ operations }) {
    operations.push(
        { action: 'delete', pattern: 'src/components/search-command/**' },
        { action: 'delete', pattern: 'src/layouts/components/header/header-search.vue' },
        { action: 'region-remove', region: 'searchCommand' },
    )
}

/**
 * SettingsDrawer 设置抽屉
 */
function settingsDrawer({ operations }) {
    operations.push(
        { action: 'delete', pattern: 'src/layouts/components/settings-drawer/**' },
        { action: 'region-remove', region: 'settingsDrawer' },
    )
}

const featureHandlers = { tabs, lockScreen, nprogress, watermark, searchCommand, settingsDrawer }

/**
 * 功能多选
 */
function features(selected, result) {
    for (const [name, handler] of Object.entries(featureHandlers)) {
        if (!selected.includes(name)) {
            handler(result)
        }
    }
}

/**
 * 每个配置项对应一个处理函数，接收配置值和结果对象，直接对结果进行修改
 */
const handlers = { projectName, includeExamples, includeSystemPages, includeMockServer, features }

/**
 * 根据用户配置生成标准化的模板变换指令
 */
export default function (config) {
    const result = {
        operations: [],
        deps: { add: {}, addDev: {}, remove: [], removeDev: [] },
        json: [],
    }

    for (const [key, value] of Object.entries(config)) {
        handlers[key]?.(value, result)
    }

    return result
}
