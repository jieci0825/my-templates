<script setup lang="ts">
/** 登录页左侧路径网络动画 */

const flowPaths = [
    { d: 'M-30,100 C100,60 200,140 320,100 S520,40 630,100', delay: 0, opacity: 0.4 },
    { d: 'M-30,230 C80,270 200,190 320,240 S520,280 630,210', delay: 0.3, opacity: 0.3 },
    { d: 'M-30,350 C100,310 220,390 340,350 S520,290 630,360', delay: 0.6, opacity: 0.45 },
    { d: 'M-30,470 C80,510 200,430 320,480 S520,520 630,460', delay: 0.9, opacity: 0.3 },
    { d: 'M-30,590 C100,550 220,630 340,590 S520,540 630,600', delay: 1.2, opacity: 0.4 },
    { d: 'M-30,710 C80,750 200,670 320,720 S520,760 630,700', delay: 1.5, opacity: 0.3 },
    { d: 'M160,-30 C140,130 180,270 155,400 S135,550 165,830', delay: 0.4, opacity: 0.3 },
    { d: 'M440,-30 C460,100 420,270 445,400 S465,550 435,830', delay: 0.8, opacity: 0.3 },
    { d: 'M-30,250 C100,230 250,320 400,270 S550,220 630,260', delay: 1.0, opacity: 0.2 },
    { d: 'M-30,540 C100,570 250,480 400,540 S550,570 630,530', delay: 1.3, opacity: 0.2 },
]

const nodes = [
    { cx: 160, cy: 100, r: 3 },
    { cx: 320, cy: 100, r: 2.5 },
    { cx: 440, cy: 100, r: 2 },
    { cx: 160, cy: 230, r: 2.5 },
    { cx: 320, cy: 240, r: 3 },
    { cx: 440, cy: 225, r: 2 },
    { cx: 155, cy: 350, r: 3.5 },
    { cx: 340, cy: 350, r: 3 },
    { cx: 445, cy: 350, r: 2.5 },
    { cx: 300, cy: 400, r: 6 },
    { cx: 160, cy: 590, r: 3 },
    { cx: 340, cy: 590, r: 2.5 },
    { cx: 440, cy: 590, r: 2 },
    { cx: 320, cy: 710, r: 3 },
]

const particles = [
    { pathIndex: 0, duration: 7, delay: 2.5 },
    { pathIndex: 2, duration: 8, delay: 3.0 },
    { pathIndex: 4, duration: 7.5, delay: 3.5 },
    { pathIndex: 6, duration: 9, delay: 2.8 },
    { pathIndex: 7, duration: 8.5, delay: 3.2 },
    { pathIndex: 8, duration: 6.5, delay: 3.8 },
    { pathIndex: 5, duration: 8, delay: 4.0 },
    { pathIndex: 9, duration: 7, delay: 4.5 },
]
</script>

<template>
    <div class="path-animation">
        <svg
            class="path-animation__canvas"
            viewBox="0 0 600 800"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="la-grad-h" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#6366f1" />
                    <stop offset="100%" stop-color="#06b6d4" />
                </linearGradient>
                <linearGradient id="la-grad-v" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#8b5cf6" />
                    <stop offset="100%" stop-color="#6366f1" />
                </linearGradient>
                <radialGradient id="la-node-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#c7d2fe" />
                    <stop offset="100%" stop-color="#818cf8" stop-opacity="0" />
                </radialGradient>
                <filter id="la-glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <pattern id="la-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(99,102,241,0.04)" stroke-width="0.5" />
                </pattern>
            </defs>

            <!-- 背景网格 -->
            <rect width="600" height="800" fill="url(#la-grid)" />

            <!-- 背景氛围光 -->
            <circle cx="200" cy="300" r="180" fill="#6366f1" opacity="0.03">
                <animate attributeName="cx" values="200;240;200" dur="15s" repeatCount="indefinite" />
            </circle>
            <circle cx="420" cy="550" r="150" fill="#06b6d4" opacity="0.03">
                <animate attributeName="cy" values="550;510;550" dur="18s" repeatCount="indefinite" />
            </circle>

            <!-- 流动路径 -->
            <path
                v-for="(path, i) in flowPaths"
                :key="`path-${i}`"
                :id="`la-path-${i}`"
                :d="path.d"
                :opacity="path.opacity"
                fill="none"
                :stroke="i < 6 ? 'url(#la-grad-h)' : 'url(#la-grad-v)'"
                stroke-width="1.5"
                stroke-linecap="round"
                pathLength="1"
                class="flow-path"
                :style="{ '--delay': `${path.delay}s` }"
            />

            <!-- 网络节点 -->
            <g v-for="(node, i) in nodes" :key="`node-${i}`">
                <circle
                    :cx="node.cx"
                    :cy="node.cy"
                    :r="node.r * 3"
                    fill="url(#la-node-glow)"
                    opacity="0"
                >
                    <animate
                        attributeName="opacity"
                        values="0;0.4;0.7;0.4"
                        dur="3s"
                        :begin="`${1.8 + i * 0.15}s`"
                        repeatCount="indefinite"
                    />
                </circle>
                <circle
                    :cx="node.cx"
                    :cy="node.cy"
                    r="0"
                    fill="#c7d2fe"
                    filter="url(#la-glow)"
                    opacity="0"
                >
                    <animate
                        attributeName="r"
                        :values="`${node.r};${node.r * 1.3};${node.r}`"
                        dur="3s"
                        :begin="`${1.8 + i * 0.15}s`"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="opacity"
                        values="0;0.8;1;0.8"
                        dur="3s"
                        :begin="`${1.8 + i * 0.15}s`"
                        repeatCount="indefinite"
                    />
                </circle>
            </g>

            <!-- 中心装饰环 -->
            <circle cx="300" cy="400" r="25" fill="none" stroke="#6366f1" stroke-width="0.8" opacity="0">
                <animate attributeName="opacity" values="0;0.2;0.4;0.2" dur="4s" begin="2.5s" repeatCount="indefinite" />
                <animate attributeName="r" values="22;28;22" dur="4s" begin="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="300" cy="400" r="40" fill="none" stroke="#6366f1" stroke-width="0.5" opacity="0">
                <animate attributeName="opacity" values="0;0.1;0.25;0.1" dur="5s" begin="3s" repeatCount="indefinite" />
                <animate attributeName="r" values="38;46;38" dur="5s" begin="3s" repeatCount="indefinite" />
            </circle>

            <!-- 流动粒子 -->
            <circle
                v-for="(p, i) in particles"
                :key="`particle-${i}`"
                r="2"
                fill="#e0e7ff"
                filter="url(#la-glow)"
                opacity="0"
            >
                <set attributeName="opacity" to="0.9" :begin="`${p.delay}s`" />
                <animateMotion :dur="`${p.duration}s`" repeatCount="indefinite" :begin="`${p.delay}s`">
                    <mpath :href="`#la-path-${p.pathIndex}`" />
                </animateMotion>
            </circle>
        </svg>

        <!-- 标题 -->
        <div class="path-animation__title">
            <h1>Vue Admin</h1>
            <p>通用管理系统模板</p>
        </div>
    </div>
</template>

<style scoped lang="scss">
.path-animation {
    position: relative;
    width: 100%;
    height: 100%;
    background: linear-gradient(160deg, #0f172a 0%, #020617 50%, #0c1222 100%);
    overflow: hidden;

    &__canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
    }

    &__title {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        z-index: 1;
        opacity: 0;
        animation: la-fade-in-title 1.5s ease 2.5s forwards;
        pointer-events: none;
        user-select: none;

        h1 {
            font-size: 42px;
            font-weight: 700;
            color: #e0e7ff;
            letter-spacing: 4px;
            margin: 0 0 12px;
            text-shadow: 0 0 40px rgba(99, 102, 241, 0.5);
        }

        p {
            font-size: 15px;
            color: #64748b;
            letter-spacing: 6px;
            margin: 0;
        }
    }
}

.flow-path {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: la-draw-path 2.5s ease var(--delay, 0s) forwards;
    will-change: stroke-dashoffset;
}

@keyframes la-draw-path {
    to {
        stroke-dashoffset: 0;
    }
}

@keyframes la-fade-in-title {
    from {
        opacity: 0;
        transform: translate(-50%, -50%) translateY(15px);
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%) translateY(0);
    }
}
</style>
