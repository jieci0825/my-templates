<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTabStore, type TabItem } from '@/stores/tab'
import TabsContextMenu from './tabs-context-menu.vue'

const router = useRouter()
const tabStore = useTabStore()

/** 右键菜单状态 */
const contextMenuVisible = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
const contextMenuTargetPath = ref('')

/** 点击标签页 */
const handleTabClick = (tab: TabItem) => {
    if (tab.path !== tabStore.activeTabPath) {
        router.push({ path: tab.path, query: tab.query })
    }
}

/** 关闭标签页 */
const handleTabClose = (e: Event, path: string) => {
    e.stopPropagation()
    tabStore.closeTab(path)
}

/** 右键菜单 */
const handleContextMenu = (e: MouseEvent, tab: TabItem) => {
    e.preventDefault()
    contextMenuTargetPath.value = tab.path
    contextMenuPosition.value = { x: e.clientX, y: e.clientY }
    contextMenuVisible.value = true
}
</script>

<template>
    <div class="tabs-container">
        <div class="tabs-wrapper">
            <div
                v-for="tab in tabStore.tabList"
                :key="tab.path"
                class="tab-item"
                :class="{ active: tab.path === tabStore.activeTabPath }"
                @click="handleTabClick(tab)"
                @contextmenu="handleContextMenu($event, tab)"
            >
                <icon-carbon-pin-filled v-if="tab.isAffix" class="tab-affix-icon" />
                <span class="tab-title">{{ tab.title }}</span>
                <span v-if="!tab.isAffix" class="tab-close" @click="handleTabClose($event, tab.path)">
                    <icon-carbon-close />
                </span>
            </div>
        </div>

        <!-- 右键菜单 -->
        <TabsContextMenu
            v-model:visible="contextMenuVisible"
            :target-path="contextMenuTargetPath"
            :position="contextMenuPosition"
        />
    </div>
</template>

<style scoped lang="scss">
.tabs-container {
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    background-color: var(--el-bg-color);
    border-bottom: 1px solid var(--el-border-color-light);

    .tabs-wrapper {
        display: flex;
        align-items: center;
        gap: 6px;
        height: 100%;
        overflow-x: auto;
        overflow-y: hidden;

        // 隐藏滚动条
        &::-webkit-scrollbar {
            display: none;
        }
        -ms-overflow-style: none;
        scrollbar-width: none;

        .tab-item {
            display: flex;
            align-items: center;
            gap: 6px;
            height: 32px;
            padding: 0 12px;
            border-radius: 6px;
            background-color: var(--el-fill-color-light);
            border: 1px solid transparent;
            cursor: pointer;
            transition: all 0.25s ease;
            white-space: nowrap;
            flex-shrink: 0;
            user-select: none;

            &:hover {
                background-color: var(--el-color-primary-light-9);
                border-color: var(--el-color-primary-light-7);
            }

            &.active {
                background-color: var(--el-color-primary);
                border-color: var(--el-color-primary);
                color: #fff;

                .tab-affix-icon {
                    color: #fff;
                }

                .tab-close {
                    &:hover {
                        background-color: rgba(255, 255, 255, 0.2);

                        .svg-icon {
                            color: #fff;
                        }
                    }

                    .svg-icon {
                        color: rgba(255, 255, 255, 0.8);
                        font-size: 16px;
                    }
                }
            }

            .tab-affix-icon {
                font-size: 14px;
                color: var(--el-text-color-secondary);
                transition: color 0.25s ease;
            }

            .tab-title {
                font-size: 13px;
                color: inherit;
            }

            .tab-close {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                transition: all 0.2s ease;
                margin-left: 2px;

                &:hover {
                    background-color: var(--el-color-danger-light-7);

                    .svg-icon {
                        color: var(--el-color-danger);
                    }
                }

                .svg-icon {
                    font-size: 16px;
                    color: var(--el-text-color-secondary);
                }
            }
        }
    }
}
</style>
