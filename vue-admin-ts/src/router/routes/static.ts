import type { RouteRecordRaw } from 'vue-router'

/**
 * 静态路由配置
 */
export const staticRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Layout',
        redirect: '/dashboard',
        component: () => import('@/layouts/index.vue'),
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/index.vue'),
                meta: {
                    title: '仪表盘',
                    icon: 'icon-dashboard',
                },
            },
            {
                path: 'pro-form-example/basic',
                name: 'ProFormExampleBasic',
                component: () => import('@/views/pro-form-example/basic/index.vue'),
            },
            {
                path: 'pro-form-example/custom',
                name: 'ProFormExampleCustom',
                component: () => import('@/views/pro-form-example/custom/index.vue'),
            },
            {
                path: 'pro-form-example/upload',
                name: 'ProFormExampleUpload',
                component: () => import('@/views/pro-form-example/upload/index.vue'),
            },
            {
                path: 'pro-form-example/dependency',
                name: 'ProFormExampleDependency',
                component: () => import('@/views/pro-form-example/dependency/index.vue'),
            },
            {
                path: 'pro-form-example/validation',
                name: 'ProFormExampleValidation',
                component: () => import('@/views/pro-form-example/validation/index.vue'),
            },
            // 重定向路由（用于刷新页面）
            {
                path: 'redirect/:path(.*)',
                name: 'Redirect',
                component: () => import('@/views/redirect/index.vue'),
            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        meta: {
            title: '登录',
            isWhiteList: true,
        },
    },
    {
        path: '/404',
        name: 'NotFound',
        component: () => import('@/views/not-found/index.vue'),
        meta: {
            title: '页面不存在',
            isWhiteList: true,
        },
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404',
    },
]
