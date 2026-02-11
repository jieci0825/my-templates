import { computed, onBeforeUnmount } from 'vue'
import type { UploadFileItem } from '../../types'

/** File → uid 缓存，保证同一 File 对象获得稳定 uid */
const uidMap = new WeakMap<File, string>()
let uidCounter = 0

function getStableUid(item: string | File): string {
    if (typeof item === 'string') return item
    let uid = uidMap.get(item)
    if (!uid) {
        uid = `upload-${++uidCounter}`
        uidMap.set(item, uid)
    }
    return uid
}

function extractFileName(url: string): string {
    return url.split('/').pop()?.split('?')[0] || 'image'
}

/** 将外部 (string | File)[] 转换为内部 UploadFileItem[]，并管理 objectURL 生命周期 */
export function useImageList(getModelValue: () => (string | File)[]) {
    /** File → objectURL 缓存，避免重复创建 */
    const urlCache = new Map<File, string>()

    function getObjectUrl(file: File): string {
        let url = urlCache.get(file)
        if (!url) {
            url = URL.createObjectURL(file)
            urlCache.set(file, url)
        }
        return url
    }

    const fileList = computed<UploadFileItem[]>(() => {
        return (getModelValue() || []).map((item) => {
            if (typeof item === 'string') {
                return {
                    uid: getStableUid(item),
                    name: extractFileName(item),
                    size: 0,
                    url: item,
                }
            }
            return {
                uid: getStableUid(item),
                name: item.name,
                size: item.size,
                raw: item,
                url: getObjectUrl(item),
            }
        })
    })

    /** 所有预览 URL（供图片查看器使用） */
    const previewUrls = computed(() => fileList.value.map((f) => f.url))

    onBeforeUnmount(() => {
        urlCache.forEach((url) => URL.revokeObjectURL(url))
        urlCache.clear()
    })

    return { fileList, previewUrls }
}
