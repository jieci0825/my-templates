import type { Router } from 'vue-router'
import { useNProgress } from '@vueuse/integrations/useNProgress'
import { useSettingsStore } from '@/stores'

const { isLoading } = useNProgress(null, {
    showSpinner: false,
})

/** 设置进度条守卫 */
export function setupProgressGuard(router: Router) {
    router.beforeEach(() => {
        const { settingState } = useSettingsStore()
        if (settingState.isShowProgress) {
            isLoading.value = true
        }
    })

    router.afterEach(() => {
        isLoading.value = false
    })
}
