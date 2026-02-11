export interface FileSelectOptions {
    /** 接受的文件类型（与 input[accept] 语法一致） */
    accept?: string
    /** 单文件大小上限（MB） */
    maxSize?: number
    /** 是否允许多选 */
    multiple?: boolean
    /** 本次最多可接受的文件数量（用于截断） */
    maxCount?: number
    /** 文件类型不匹配时的回调 */
    onInvalidType?: (file: File, accept: string) => void
    /** 文件超出大小限制时的回调 */
    onExceedSize?: (file: File, maxSize: number) => void
    /** 文件数量超出限制时的回调（截断前触发） */
    onExceedCount?: (files: File[], maxCount: number) => void
}

/** 校验单个文件是否符合 accept 规则 */
function isFileTypeValid(file: File, accept: string): boolean {
    const patterns = accept
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    if (!patterns.length) return true

    return patterns.some((pattern) => {
        // 扩展名匹配：.jpg .png
        if (pattern.startsWith('.')) {
            return file.name.toLowerCase().endsWith(pattern.toLowerCase())
        }
        // 通配 MIME：image/* video/*
        if (pattern.endsWith('/*')) {
            return file.type.startsWith(pattern.slice(0, -1))
        }
        // 精确 MIME：application/pdf
        return file.type === pattern
    })
}

/** 文件选择与校验（类型 → 大小 → 数量，依次过滤） */
export function useFileSelect(getOptions: () => FileSelectOptions) {
    function triggerSelect(): Promise<File[]> {
        return new Promise((resolve) => {
            const { accept, maxSize, multiple, maxCount, onInvalidType, onExceedSize, onExceedCount } =
                getOptions()

            const input = document.createElement('input')
            input.type = 'file'
            input.style.display = 'none'
            if (accept) input.accept = accept
            if (multiple) input.multiple = true

            input.addEventListener('change', () => {
                let valid = Array.from(input.files || [])

                // 1. 类型校验
                if (accept) {
                    const passed: File[] = []
                    for (const file of valid) {
                        if (isFileTypeValid(file, accept)) {
                            passed.push(file)
                        } else {
                            onInvalidType?.(file, accept)
                        }
                    }
                    valid = passed
                }

                // 2. 大小校验
                if (maxSize) {
                    const limit = maxSize * 1024 * 1024
                    const passed: File[] = []
                    for (const file of valid) {
                        if (file.size <= limit) {
                            passed.push(file)
                        } else {
                            onExceedSize?.(file, maxSize)
                        }
                    }
                    valid = passed
                }

                // 3. 数量校验（截断多余文件）
                if (maxCount !== undefined && valid.length > maxCount) {
                    onExceedCount?.(valid, maxCount)
                    valid = valid.slice(0, maxCount)
                }

                input.remove()
                resolve(valid)
            })

            input.addEventListener('cancel', () => {
                input.remove()
                resolve([])
            })

            document.body.appendChild(input)
            input.click()
        })
    }

    return { triggerSelect }
}
