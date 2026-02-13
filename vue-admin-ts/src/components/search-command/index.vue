<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useMagicKeys, useActiveElement } from '@vueuse/core'
import { useUserStore } from '@/stores'
import type { MenuItem } from '@/types/menu'

interface SearchItem {
    id: string | number
    title: string
    path?: string | null
    icon?: string | null
    breadcrumb: string[]
}

const visible = ref(false)
const searchKeyword = ref('')
const selectedIndex = ref(0)
const searchInputRef = ref<HTMLInputElement | null>(null)

const router = useRouter()
const userStore = useUserStore()

// 扁平化菜单数据，并生成面包屑路径（只保留叶子节点）
const flattenMenus = (menus: MenuItem[], breadcrumb: string[] = []): SearchItem[] => {
    const result: SearchItem[] = []
    for (const menu of menus) {
        const currentBreadcrumb = [...breadcrumb, menu.title]
        // 有子菜单的是目录，递归处理子菜单
        if (menu.children?.length) {
            result.push(...flattenMenus(menu.children, currentBreadcrumb))
        } else if (menu.path) {
            // 没有子菜单且有路径的才是实际可导航的页面
            result.push({
                id: menu.id,
                title: menu.title,
                path: menu.path,
                icon: menu.icon,
                breadcrumb: currentBreadcrumb,
            })
        }
    }
    return result
}

// 所有可搜索的菜单项
const allMenuItems = computed(() => flattenMenus(userStore.menus))

// 搜索结果
const searchResults = computed(() => {
    if (!searchKeyword.value.trim()) {
        return allMenuItems.value
    }
    const keyword = searchKeyword.value.toLowerCase()
    return allMenuItems.value.filter((item) => item.title.toLowerCase().includes(keyword))
})

// 监听搜索结果变化，重置选中索引
watch(searchResults, () => {
    selectedIndex.value = 0
})

// 打开搜索弹窗
const open = () => {
    visible.value = true
    searchKeyword.value = ''
    selectedIndex.value = 0
    nextTick(() => {
        searchInputRef.value?.focus()
    })
}

// 关闭搜索弹窗
const close = () => {
    visible.value = false
}

// 选择菜单项
const selectItem = (item: SearchItem) => {
    if (item.path) {
        router.push(item.path)
        close()
    }
}

// 处理键盘导航
const handleKeydown = (e: KeyboardEvent) => {
    // 输入法候选词状态下不处理，避免中文输入时回车被拦截
    if (e.isComposing) return

    if (e.key === 'ArrowDown') {
        e.preventDefault()
        selectedIndex.value = Math.min(selectedIndex.value + 1, searchResults.value.length - 1)
    } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
    } else if (e.key === 'Enter') {
        e.preventDefault()
        const selectedItem = searchResults.value[selectedIndex.value]
        if (selectedItem) {
            selectItem(selectedItem)
        }
    } else if (e.key === 'Escape') {
        e.preventDefault()
        close()
    }
}

// 使用 useMagicKeys 监听 Ctrl+K
const activeElement = useActiveElement()
const notUsingInput = computed(() => {
    const tagName = activeElement.value?.tagName
    return tagName !== 'INPUT' && tagName !== 'TEXTAREA'
})

const keys = useMagicKeys({
    passive: false,
    onEventFired(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k' && e.type === 'keydown') {
            e.preventDefault()
        }
    },
})

// 监听 Ctrl+K / Cmd+K 打开搜索
watch(
    () => keys['ctrl+k']?.value || keys['meta+k']?.value,
    (pressed) => {
        if (pressed && (notUsingInput.value || visible.value)) {
            open()
        }
    },
)

// 高亮匹配的关键词
const highlightText = (text: string, keyword: string | undefined): string => {
    if (!keyword || !keyword.trim()) {
        return text
    }
    // 转义 HTML 特殊字符
    const escapeHtml = (str: string) => {
        const map: Record<string, string> = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
        }
        return str.replace(/[&<>"']/g, (m) => map[m] || m)
    }

    const escapedText = escapeHtml(text)
    const escapedKeyword = escapeHtml(keyword)
    const regex = new RegExp(`(${escapedKeyword})`, 'gi')
    return escapedText.replace(regex, '<mark class="highlight">$1</mark>')
}

// 暴露方法给父组件
defineExpose({
    open,
    close,
})
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div
                v-if="visible"
                class="search-command-overlay"
                @click.self="close"
            >
                <Transition name="scale">
                    <div
                        v-if="visible"
                        class="search-command-modal"
                    >
                        <!-- 搜索输入框 -->
                        <div class="search-command-header">
                            <icon-carbon-search class="search-icon" />
                            <input
                                ref="searchInputRef"
                                v-model="searchKeyword"
                                type="text"
                                class="search-input"
                                placeholder="输入命令或搜索..."
                                @keydown="handleKeydown"
                            />
                            <button
                                class="close-btn"
                                @click="close"
                            >
                                <icon-carbon-close />
                            </button>
                        </div>

                        <!-- 搜索结果列表 -->
                        <div class="search-command-body">
                            <div
                                v-if="searchResults.length === 0"
                                class="empty-result"
                            >
                                <icon-carbon-search class="empty-icon" />
                                <span>没有找到相关菜单</span>
                            </div>
                            <div
                                v-else
                                class="search-result-list"
                            >
                                <div
                                    v-for="(item, index) in searchResults"
                                    :key="item.id"
                                    class="search-result-item"
                                    :class="{ active: index === selectedIndex }"
                                    @click="selectItem(item)"
                                    @mouseenter="selectedIndex = index"
                                >
                                    <icon-carbon-arrow-right class="item-arrow" />
                                    <div class="item-content">
                                        <template v-if="item.breadcrumb.length > 1">
                                            <span
                                                v-for="(crumb, crumbIndex) in item.breadcrumb"
                                                :key="crumbIndex"
                                                class="breadcrumb-item"
                                            >
                                                <span v-html="highlightText(crumb, searchKeyword)"></span>
                                                <icon-carbon-chevron-right
                                                    v-if="crumbIndex < item.breadcrumb.length - 1"
                                                    class="breadcrumb-separator"
                                                />
                                            </span>
                                        </template>
                                        <span
                                            v-else
                                            class="item-title"
                                            v-html="highlightText(item.title, searchKeyword)"
                                        ></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 键盘快捷键提示 -->
                        <div class="search-command-footer">
                            <div class="key-hint">
                                <span class="key">↵</span>
                                <span class="hint-text">选择</span>
                            </div>
                            <div class="key-hint">
                                <span class="key">↑</span>
                                <span class="key">↓</span>
                                <span class="hint-text">切换</span>
                            </div>
                            <div class="key-hint">
                                <span class="key">ESC</span>
                                <span class="hint-text">关闭</span>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped lang="scss">
.search-command-overlay {
    position: fixed;
    inset: 0;
    background-color: var(--el-overlay-color-lighter);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 15vh;
    z-index: 9999;
}

.search-command-modal {
    width: 560px;
    max-width: calc(100vw - 32px);
    background-color: var(--el-bg-color-overlay);
    border-radius: 12px;
    box-shadow: var(--el-box-shadow);
    overflow: hidden;
}

.search-command-header {
    display: flex;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid var(--el-border-color-lighter);

    .search-icon {
        font-size: 20px;
        color: var(--el-text-color-secondary);
        margin-right: 12px;
        flex-shrink: 0;
    }

    .search-input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 16px;
        color: var(--el-text-color-primary);
        background: transparent;

        &::placeholder {
            color: var(--el-text-color-placeholder);
        }
    }

    .close-btn {
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background-color: transparent;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
            background-color: var(--el-fill-color-light);
        }

        svg {
            font-size: 16px;
            color: var(--el-text-color-secondary);
        }
    }
}

.search-command-body {
    max-height: 400px;
    overflow-y: auto;
    padding: 8px;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: var(--el-border-color);
        border-radius: 3px;
    }

    &::-webkit-scrollbar-track {
        background-color: transparent;
    }
}

.empty-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 16px;
    color: var(--el-text-color-secondary);

    .empty-icon {
        font-size: 48px;
        margin-bottom: 12px;
        opacity: 0.5;
    }
}

.search-result-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.search-result-item {
    display: flex;
    align-items: center;
    padding: 12px 14px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.15s;

    &:hover,
    &.active {
        background-color: var(--el-fill-color-light);
    }

    .item-arrow {
        font-size: 20px;
        color: var(--el-text-color-secondary);
        margin-right: 12px;
        flex-shrink: 0;
        opacity: 1;
        transition: opacity 0.15s;
    }

    .item-content {
        flex: 1;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px;
        font-size: 14px;
        color: var(--el-text-color-primary);
    }

    .breadcrumb-item {
        display: inline-flex;
        align-items: center;
    }

    .breadcrumb-separator {
        margin: 0 4px;
        color: var(--el-text-color-secondary);
        font-size: 12px;
        flex-shrink: 0;
    }

    :deep(.highlight) {
        background-color: var(--el-color-warning-light-8);
        color: var(--el-color-warning-dark-2);
        padding: 0 2px;
        border-radius: 2px;
        font-weight: 500;
    }
}

.search-command-footer {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    border-top: 1px solid var(--el-border-color-lighter);
    background-color: var(--el-fill-color-lighter);
}

.key-hint {
    display: flex;
    align-items: center;
    gap: 6px;

    .key {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 24px;
        height: 22px;
        padding: 0 6px;
        background-color: var(--el-bg-color);
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        color: var(--el-text-color-secondary);
    }

    .hint-text {
        font-size: 13px;
        color: var(--el-text-color-secondary);
    }
}

// 动画
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
    transition:
        transform 0.2s ease,
        opacity 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
    transform: scale(0.95);
    opacity: 0;
}
</style>
