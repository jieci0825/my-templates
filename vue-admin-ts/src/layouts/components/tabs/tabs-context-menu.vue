<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useEventListener } from '@vueuse/core'
import { useTabStore } from '@/stores/tab'
import IconRefresh from '~icons/carbon/renew'
import IconPin from '~icons/carbon/pin'
import IconPinFilled from '~icons/carbon/pin-filled'
import IconArrowLeft from '~icons/carbon/arrow-left'
import IconArrowRight from '~icons/carbon/arrow-right'
import IconClose from '~icons/carbon/close'
import IconCloseFilled from '~icons/carbon/close-filled'

interface ContextMenuItem {
    key: string
    label: string
    icon: Component
    disabled: boolean
    action: () => void
}

interface ContextMenuDivider {
    key: string
    type: 'divider'
}

interface Props {
    /** 目标标签页路径 */
    targetPath: string
    /** 菜单位置 */
    position: { x: number; y: number }
}

const props = defineProps<Props>()
const visible = defineModel<boolean>('visible', { required: true })

const tabStore = useTabStore()

/** 关闭菜单 */
const close = () => {
    visible.value = false
}

/** 刷新标签页 */
const handleRefresh = (path: string) => {
    close()
    tabStore.refreshTab(path)
}

/** 切换固定状态 */
const handleToggleAffix = (path: string) => {
    close()
    tabStore.toggleTabAffix(path)
}

/** 关闭左侧标签页 */
const handleCloseLeft = (path: string) => {
    close()
    tabStore.closeLeftTabs(path)
}

/** 关闭右侧标签页 */
const handleCloseRight = (path: string) => {
    close()
    tabStore.closeRightTabs(path)
}

/** 关闭其他标签页 */
const handleCloseOther = (path: string) => {
    close()
    tabStore.closeOtherTabs(path)
}

/** 关闭全部标签页 */
const handleCloseAll = () => {
    close()
    tabStore.closeAllTabs()
}

/** 右键菜单配置 */
const menuItems = computed<(ContextMenuItem | ContextMenuDivider)[]>(() => {
    const targetPath = props.targetPath
    const targetIndex = tabStore.tabList.findIndex((item) => item.path === targetPath)
    const targetTab = tabStore.tabList[targetIndex]
    const isAffix = targetTab?.isAffix || false

    return [
        {
            key: 'refresh',
            label: '刷新',
            icon: IconRefresh,
            disabled: false,
            action: () => handleRefresh(targetPath),
        },
        {
            key: 'affix',
            label: isAffix ? '取消固定' : '固定',
            icon: isAffix ? IconPinFilled : IconPin,
            disabled: false,
            action: () => handleToggleAffix(targetPath),
        },
        { key: 'divider', type: 'divider' },
        {
            key: 'closeLeft',
            label: '关闭左侧',
            icon: IconArrowLeft,
            disabled: targetIndex <= 0 || tabStore.tabList.slice(0, targetIndex).every((item) => item.isAffix),
            action: () => handleCloseLeft(targetPath),
        },
        {
            key: 'closeRight',
            label: '关闭右侧',
            icon: IconArrowRight,
            disabled:
                targetIndex === tabStore.tabList.length - 1 ||
                tabStore.tabList.slice(targetIndex + 1).every((item) => item.isAffix),
            action: () => handleCloseRight(targetPath),
        },
        {
            key: 'closeOther',
            label: '关闭其他',
            icon: IconClose,
            disabled: tabStore.tabList.filter((item) => !item.isAffix && item.path !== targetPath).length === 0,
            action: () => handleCloseOther(targetPath),
        },
        {
            key: 'closeAll',
            label: '关闭全部',
            icon: IconCloseFilled,
            disabled: tabStore.tabList.every((item) => item.isAffix),
            action: () => handleCloseAll(),
        },
    ]
})

/** 处理菜单项点击 */
const handleMenuItemClick = (item: ContextMenuItem | ContextMenuDivider) => {
    if ('type' in item) return
    if (item.disabled) return
    item.action()
}

/** 监听点击事件关闭菜单 */
useEventListener(document, 'click', close)
</script>

<template>
    <Teleport to="body">
        <Transition name="context-menu">
            <div
                v-if="visible"
                class="context-menu"
                :style="{ left: position.x + 'px', top: position.y + 'px' }"
                @click.stop
            >
                <template v-for="item in menuItems" :key="item.key">
                    <div v-if="'type' in item && item.type === 'divider'" class="context-menu-divider"></div>
                    <div
                        v-else
                        class="context-menu-item"
                        :class="{ disabled: (item as ContextMenuItem).disabled }"
                        @click="handleMenuItemClick(item)"
                    >
                        <component :is="(item as ContextMenuItem).icon" class="item-icon" />
                        <span class="item-label">{{ (item as ContextMenuItem).label }}</span>
                    </div>
                </template>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped lang="scss">
.context-menu {
    position: fixed;
    z-index: 9999;
    min-width: 140px;
    padding: 6px 0;
    background-color: var(--el-bg-color);
    border-radius: 8px;
    box-shadow:
        0 6px 16px 0 rgba(0, 0, 0, 0.08),
        0 3px 6px -4px rgba(0, 0, 0, 0.12),
        0 9px 28px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid var(--el-border-color-lighter);

    .context-menu-divider {
        height: 1px;
        margin: 6px 12px;
        background-color: var(--el-border-color-lighter);
    }

    .context-menu-item {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 36px;
        padding: 0 16px;
        cursor: pointer;
        transition: all 0.2s ease;
        color: var(--el-text-color-regular);

        &:hover:not(.disabled) {
            background-color: var(--el-color-primary-light-9);
            color: var(--el-color-primary);

            .item-icon {
                color: var(--el-color-primary);
            }
        }

        &.disabled {
            color: var(--el-text-color-disabled);
            cursor: not-allowed;

            .item-icon {
                color: var(--el-text-color-disabled);
            }
        }

        .item-icon {
            font-size: 16px;
            color: var(--el-text-color-secondary);
            transition: color 0.2s ease;
        }

        .item-label {
            font-size: 13px;
        }
    }
}

.context-menu-enter-active,
.context-menu-leave-active {
    transition: all 0.15s ease;
}

.context-menu-enter-from,
.context-menu-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
</style>
