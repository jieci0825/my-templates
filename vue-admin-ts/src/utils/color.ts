type HSL = { h: number; s: number; l: number }

function hexToHsl(hex: string): HSL {
    hex = hex.replace(/^#/, '')
    const r = parseInt(hex.slice(0, 2), 16) / 255
    const g = parseInt(hex.slice(2, 4), 16) / 255
    const b = parseInt(hex.slice(4, 6), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6
                break
            case g:
                h = ((b - r) / d + 2) / 6
                break
            case b:
                h = ((r - g) / d + 4) / 6
                break
        }
    }

    return { h: h * 360, s: s * 100, l: l * 100 }
}

function hslToHex(h: number, s: number, l: number): string {
    s /= 100
    l /= 100
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => {
        const k = (n + h / 30) % 12
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        return Math.round(255 * Math.max(0, Math.min(1, color)))
            .toString(16)
            .padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`
}

/**
 * 基于基准色在 HSL 色彩空间生成指定色阶的颜色值
 */
function generateShade(hex: string, shade: number): string {
    const { h, s, l } = hexToHsl(hex)

    if (shade === 500) return hex

    if (shade < 500) {
        const t = (500 - shade) / 500
        const newL = l + (97 - l) * t
        const newS = s * (1 - 0.2 * t)
        return hslToHex(h, Math.max(0, newS), Math.max(0, Math.min(100, newL)))
    }

    const t = (shade - 500) / 500
    const newL = l - (l - 5) * t
    const newS = s * (1 - 0.1 * t * t)
    return hslToHex(h, Math.max(0, newS), Math.max(0, Math.min(100, newL)))
}

/** Element Plus 主色相关 CSS 变量名 */
const EL_PRIMARY_VARS = [
    '--el-color-primary',
    ...Array.from({ length: 9 }, (_, i) => `--el-color-primary-light-${i + 1}`),
    '--el-color-primary-dark-2',
] as const

/** 浅色模式下各 CSS 变量对应的色阶值 */
const LIGHT_MODE_SHADES: Record<string, number> = {
    '--el-color-primary': 500,
    '--el-color-primary-light-1': 450,
    '--el-color-primary-light-2': 400,
    '--el-color-primary-light-3': 350,
    '--el-color-primary-light-4': 275,
    '--el-color-primary-light-5': 200,
    '--el-color-primary-light-6': 150,
    '--el-color-primary-light-7': 100,
    '--el-color-primary-light-8': 75,
    '--el-color-primary-light-9': 50,
    '--el-color-primary-dark-2': 600,
}

/** 深色模式下各 CSS 变量对应的色阶值（light 变体反转为深色方向） */
const DARK_MODE_SHADES: Record<string, number> = {
    '--el-color-primary': 400,
    '--el-color-primary-light-1': 450,
    '--el-color-primary-light-2': 500,
    '--el-color-primary-light-3': 550,
    '--el-color-primary-light-4': 625,
    '--el-color-primary-light-5': 700,
    '--el-color-primary-light-6': 750,
    '--el-color-primary-light-7': 800,
    '--el-color-primary-light-8': 850,
    '--el-color-primary-light-9': 900,
    '--el-color-primary-dark-2': 300,
}

/**
 * 将预设主色生成色阶并写入 Element Plus CSS 变量
 */
export function applyPrimaryColor(hex: string, isDark: boolean) {
    const shadeMap = isDark ? DARK_MODE_SHADES : LIGHT_MODE_SHADES
    const el = document.documentElement

    for (const cssVar of EL_PRIMARY_VARS) {
        el.style.setProperty(cssVar, generateShade(hex, shadeMap[cssVar]))
    }
}

/**
 * 移除自定义主色的 CSS 变量，恢复 SCSS 编译时的默认值
 */
export function clearPrimaryColor() {
    const el = document.documentElement
    for (const cssVar of EL_PRIMARY_VARS) {
        el.style.removeProperty(cssVar)
    }
}
