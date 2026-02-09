<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLockStore, useUserStore, useSettingsStore } from '@/stores'
import { usePreferredDark } from '@vueuse/core'
import Avatar from '@/components/avatar/index.vue'
import IconCarbonLocked from '~icons/carbon/locked'
import IconCarbonUnlocked from '~icons/carbon/unlocked'

const lockStore = useLockStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()
const prefersDark = usePreferredDark()

const password = ref('')
const errorMsg = ref('')
const inputRef = ref<InstanceType<typeof import('element-plus')['ElInput']>>()

/** 响应式暗色模式检测 */
const isDark = computed(() => {
    const theme = settingsStore.settingState.theme
    if (theme === 'dark') return true
    if (theme === 'light') return false
    return prefersDark.value
})

const currentTime = ref(new Date())
let timer: ReturnType<typeof setInterval> | null = null

const timeStr = computed(() => {
    const h = String(currentTime.value.getHours()).padStart(2, '0')
    const m = String(currentTime.value.getMinutes()).padStart(2, '0')
    return `${h}:${m}`
})

const dateStr = computed(() => {
    const year = currentTime.value.getFullYear()
    const month = String(currentTime.value.getMonth() + 1).padStart(2, '0')
    const day = String(currentTime.value.getDate()).padStart(2, '0')
    const weekDays = ['日', '一', '二', '三', '四', '五', '六']
    const weekDay = weekDays[currentTime.value.getDay()]
    return `${year}年${month}月${day}日 星期${weekDay}`
})

/** 流动波浪路径 */
const wavePaths = [
    { d: 'M-100,320 C200,280 400,400 700,340 S1100,260 1400,330 1700,300 2000,360', delay: 0, opacity: 0.15 },
    { d: 'M-100,400 C150,440 450,360 750,420 S1050,460 1350,390 1650,430 2000,400', delay: 0.4, opacity: 0.12 },
    { d: 'M-100,480 C250,450 500,530 800,470 S1100,440 1400,500 1700,460 2000,490', delay: 0.8, opacity: 0.18 },
    { d: 'M-100,560 C200,590 450,520 750,570 S1050,600 1350,540 1650,580 2000,555', delay: 1.2, opacity: 0.1 },
    { d: 'M-100,240 C300,210 500,280 800,230 S1100,200 1400,260 1700,220 2000,250', delay: 0.6, opacity: 0.1 },
    { d: 'M-100,640 C200,670 500,610 800,660 S1100,690 1400,630 1700,670 2000,645', delay: 1.5, opacity: 0.12 },
]

/** 浮动粒子 */
const particles = [
    { pathIndex: 0, duration: 20, delay: 1.0 },
    { pathIndex: 1, duration: 24, delay: 2.5 },
    { pathIndex: 2, duration: 18, delay: 1.5 },
    { pathIndex: 3, duration: 22, delay: 3.0 },
    { pathIndex: 4, duration: 26, delay: 2.0 },
    { pathIndex: 5, duration: 21, delay: 3.5 },
    { pathIndex: 0, duration: 25, delay: 5.0 },
    { pathIndex: 2, duration: 19, delay: 4.0 },
]

const startTimer = () => {
    timer = setInterval(() => {
        currentTime.value = new Date()
    }, 1000)
}

const stopTimer = () => {
    if (timer) {
        clearInterval(timer)
        timer = null
    }
}

const handleUnlock = () => {
    if (!password.value) {
        errorMsg.value = '请输入锁屏密码'
        return
    }

    const success = lockStore.unlock(password.value)
    if (success) {
        password.value = ''
        errorMsg.value = ''
        stopTimer()
    } else {
        errorMsg.value = '密码错误，请重新输入'
        password.value = ''
        inputRef.value?.focus()
    }
}

/**
 * 退出登录并解除锁屏
 */
const handleLogout = () => {
    lockStore.reset()
    stopTimer()
    userStore.logout()
}

startTimer()
</script>

<template>
    <Transition name="lock-screen">
        <div v-if="lockStore.locked" class="lock-screen" :class="{ 'is-dark': isDark }">
            <!-- SVG 流动动画背景 -->
            <svg
                class="lock-screen__bg"
                viewBox="0 0 1920 1080"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <!-- 水平渐变 -->
                    <linearGradient id="ls-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="var(--ls-accent-1)" />
                        <stop offset="50%" stop-color="var(--ls-accent-2)" />
                        <stop offset="100%" stop-color="var(--ls-accent-3)" />
                    </linearGradient>
                    <linearGradient id="ls-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="var(--ls-accent-3)" />
                        <stop offset="100%" stop-color="var(--ls-accent-1)" />
                    </linearGradient>
                    <!-- 网格 -->
                    <pattern id="ls-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path
                            d="M 60 0 L 0 0 0 60"
                            fill="none"
                            stroke="var(--ls-grid-color)"
                            stroke-width="0.5"
                        />
                    </pattern>
                </defs>

                <!-- 背景网格 -->
                <rect width="1920" height="1080" fill="url(#ls-grid)" />

                <!-- 氛围光 -->
                <circle cx="480" cy="400" r="300" fill="var(--ls-accent-1)" opacity="0.03">
                    <animate attributeName="cx" values="480;560;480" dur="20s" repeatCount="indefinite" />
                    <animate attributeName="cy" values="400;350;400" dur="25s" repeatCount="indefinite" />
                </circle>
                <circle cx="1400" cy="650" r="260" fill="var(--ls-accent-3)" opacity="0.03">
                    <animate attributeName="cx" values="1400;1320;1400" dur="22s" repeatCount="indefinite" />
                    <animate attributeName="cy" values="650;700;650" dur="18s" repeatCount="indefinite" />
                </circle>
                <circle cx="960" cy="200" r="200" fill="var(--ls-accent-2)" opacity="0.02">
                    <animate attributeName="cy" values="200;260;200" dur="16s" repeatCount="indefinite" />
                </circle>

                <!-- 流动波浪路径 -->
                <path
                    v-for="(wave, i) in wavePaths"
                    :key="`wave-${i}`"
                    :id="`ls-wave-${i}`"
                    :d="wave.d"
                    :opacity="wave.opacity"
                    fill="none"
                    :stroke="i % 2 === 0 ? 'url(#ls-grad-1)' : 'url(#ls-grad-2)'"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    pathLength="1"
                    class="ls-wave-path"
                    :style="{ '--delay': `${wave.delay}s` }"
                >
                    <!-- 路径本身的缓慢摆动 -->
                    <animate
                        attributeName="d"
                        :values="`${wave.d};${wave.d.replace(/\d{3,4}(?=,)/g, (m: string) => String(Number(m) + (i % 2 === 0 ? 15 : -15)))};${wave.d}`"
                        :dur="`${12 + i * 2}s`"
                        repeatCount="indefinite"
                    />
                </path>

                <!-- 流动粒子 -->
                <circle
                    v-for="(p, i) in particles"
                    :key="`particle-${i}`"
                    r="2.5"
                    fill="var(--ls-particle-color)"
                    opacity="0"
                >
                    <set attributeName="opacity" to="0.7" :begin="`${p.delay}s`" />
                    <animate
                        attributeName="opacity"
                        values="0.7;1;0.7"
                        dur="3s"
                        :begin="`${p.delay}s`"
                        repeatCount="indefinite"
                    />
                    <animateMotion
                        :dur="`${p.duration}s`"
                        repeatCount="indefinite"
                        :begin="`${p.delay}s`"
                    >
                        <mpath :href="`#ls-wave-${p.pathIndex}`" />
                    </animateMotion>
                </circle>

                <!-- 装饰环 -->
                <circle cx="960" cy="540" r="120" fill="none" stroke="var(--ls-accent-1)" stroke-width="0.6" opacity="0">
                    <animate attributeName="opacity" values="0;0.08;0.15;0.08" dur="6s" begin="1s" repeatCount="indefinite" />
                    <animate attributeName="r" values="115;130;115" dur="6s" begin="1s" repeatCount="indefinite" />
                </circle>
                <circle cx="960" cy="540" r="180" fill="none" stroke="var(--ls-accent-2)" stroke-width="0.4" opacity="0">
                    <animate attributeName="opacity" values="0;0.05;0.1;0.05" dur="8s" begin="2s" repeatCount="indefinite" />
                    <animate attributeName="r" values="175;195;175" dur="8s" begin="2s" repeatCount="indefinite" />
                </circle>
            </svg>

            <!-- 内容层 -->
            <div class="lock-screen__content">
                <!-- 时间显示区域 -->
                <div class="lock-screen__time">
                    <div class="lock-screen__clock">{{ timeStr }}</div>
                    <div class="lock-screen__date">{{ dateStr }}</div>
                </div>

                <!-- 解锁卡片 -->
                <div class="lock-screen__card">
                    <div class="lock-screen__avatar">
                        <Avatar
                            :username="userStore.userInfo?.nickname"
                            :url="userStore.userInfo?.avatar || ''"
                            :size="64"
                        />
                    </div>
                    <div class="lock-screen__username">{{ userStore.userInfo?.nickname }}</div>

                    <div class="lock-screen__icon">
                        <IconCarbonLocked />
                    </div>

                    <el-form class="lock-screen__form" @submit.prevent="handleUnlock">
                        <el-input
                            ref="inputRef"
                            v-model="password"
                            type="password"
                            placeholder="请输入锁屏密码"
                            size="large"
                            show-password
                            @input="errorMsg = ''"
                        >
                            <template #append>
                                <el-button @click="handleUnlock">
                                    <IconCarbonUnlocked />
                                </el-button>
                            </template>
                        </el-input>
                        <Transition name="ls-fade">
                            <div v-if="errorMsg" class="lock-screen__error">{{ errorMsg }}</div>
                        </Transition>
                    </el-form>

                    <div class="lock-screen__actions">
                        <el-button type="info" text size="small" @click="handleLogout">
                            返回登录
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped lang="scss">
// 锁屏颜色变量 - 亮色主题
.lock-screen {
    --ls-bg: #f7f7f7;
    --ls-accent-1: #6366f1;
    --ls-accent-2: #06b6d4;
    --ls-accent-3: #8b5cf6;
    --ls-grid-color: rgba(99, 102, 241, 0.04);
    --ls-particle-color: #818cf8;
    --ls-card-bg: rgba(255, 255, 255, 0.65);
    --ls-card-border: rgba(99, 102, 241, 0.1);
    --ls-text-primary: #171717;
    --ls-text-secondary: rgba(23, 23, 23, 0.55);
    --ls-clock-color: #171717;
    --ls-error-color: #e7000b;
}

// 暗色主题
.lock-screen.is-dark {
    --ls-bg: #0f172a;
    --ls-grid-color: rgba(99, 102, 241, 0.03);
    --ls-particle-color: #c7d2fe;
    --ls-card-bg: rgba(30, 41, 59, 0.6);
    --ls-card-border: rgba(99, 102, 241, 0.15);
    --ls-text-primary: #e0e7ff;
    --ls-text-secondary: rgba(224, 231, 255, 0.55);
    --ls-clock-color: #e0e7ff;
    --ls-error-color: #fca5a5;
}

.lock-screen {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background-color: var(--ls-bg);
    overflow: hidden;

    &__bg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
    }

    &__content {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        gap: 36px;
    }

    &__time {
        text-align: center;
    }

    &__clock {
        font-size: 72px;
        font-weight: 200;
        letter-spacing: 4px;
        line-height: 1;
        color: var(--ls-clock-color);
    }

    &__date {
        font-size: 15px;
        margin-top: 8px;
        color: var(--ls-text-secondary);
        letter-spacing: 2px;
    }

    &__card {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: var(--ls-card-bg);
        backdrop-filter: blur(24px);
        border-radius: 14px;
        padding: 28px 36px;
        min-width: 340px;
        border: 1px solid var(--ls-card-border);
    }

    &__avatar {
        margin-bottom: 10px;

        :deep(.user-avatar) {
            border: 2px solid var(--ls-card-border);
        }
    }

    &__username {
        font-size: 16px;
        font-weight: 500;
        color: var(--ls-text-primary);
        margin-bottom: 6px;
    }

    &__icon {
        font-size: 18px;
        color: var(--ls-text-secondary);
        margin-bottom: 18px;
    }

    &__form {
        width: 100%;

        :deep(.el-input-group__append) {
            padding: 0;

            .el-button {
                margin: 0;
                padding: 8px 14px;
            }
        }
    }

    &__error {
        color: var(--ls-error-color);
        font-size: 12px;
        margin-top: 8px;
        text-align: center;
    }

    &__actions {
        margin-top: 14px;
    }
}

// SVG 波浪路径绘制动画
.ls-wave-path {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: ls-draw 3s ease var(--delay, 0s) forwards;
    will-change: stroke-dashoffset;
}

@keyframes ls-draw {
    to {
        stroke-dashoffset: 0;
    }
}

// 进出场过渡
.lock-screen-enter-active,
.lock-screen-leave-active {
    transition: opacity 0.35s ease;
}

.lock-screen-enter-from,
.lock-screen-leave-to {
    opacity: 0;
}

// 错误信息过渡
.ls-fade-enter-active,
.ls-fade-leave-active {
    transition: opacity 0.2s ease;
}

.ls-fade-enter-from,
.ls-fade-leave-to {
    opacity: 0;
}
</style>
