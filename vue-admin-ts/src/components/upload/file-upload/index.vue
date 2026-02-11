<script setup lang="ts">
import { computed } from 'vue'
import { useFileSelect } from '../hooks/use-file-select'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'FileUpload' })

const props = withDefaults(
    defineProps<{
        modelValue: File[]
        /** 最大数量 */
        limit?: number
        /** 接受的文件类型 */
        accept?: string
        /** 单文件大小上限（MB） */
        maxSize?: number
        disabled?: boolean
    }>(),
    {
        modelValue: () => [],
    },
)

const emit = defineEmits<{
    'update:modelValue': [File[]]
}>()

const { triggerSelect } = useFileSelect(() => ({
    accept: props.accept,
    maxSize: props.maxSize,
    multiple: !props.limit || props.limit > 1,
    maxCount: props.limit ? props.limit - props.modelValue.length : undefined,
    onInvalidType: (file) => {
        ElMessage.warning(`"${file.name}" 不是支持的文件格式`)
    },
    onExceedSize: (file, maxSize) => {
        ElMessage.warning(`"${file.name}" 超出 ${maxSize}MB 大小限制`)
    },
    onExceedCount: () => {
        ElMessage.warning(`最多只能上传 ${props.limit} 个文件`)
    },
}))

/** 是否可以继续添加 */
const canAdd = computed(() => {
    if (props.disabled) return false
    if (!props.limit) return true
    return props.modelValue.length < props.limit
})

function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    const units = ['B', 'KB', 'MB', 'GB']
    const k = 1024
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${units[i]}`
}

async function handleAdd() {
    const files = await triggerSelect()
    if (!files.length) return
    emit('update:modelValue', [...props.modelValue, ...files])
}

function handleRemove(index: number) {
    const newVal = [...props.modelValue]
    newVal.splice(index, 1)
    emit('update:modelValue', newVal)
}
</script>

<template>
    <div class="file-upload">
        <el-button
            :disabled="!canAdd"
            @click="handleAdd"
        >
            <icon-mdi-upload class="file-upload__btn-icon" />
            选择文件
        </el-button>

        <div
            v-if="modelValue.length"
            class="file-upload__list"
        >
            <div
                v-for="(file, index) in modelValue"
                :key="`${file.name}-${file.size}-${file.lastModified}`"
                class="file-upload__item"
            >
                <icon-mdi-file-document-outline class="file-upload__icon" />
                <span
                    class="file-upload__name"
                    :title="file.name"
                >
                    {{ file.name }}
                </span>
                <span class="file-upload__size">{{ formatFileSize(file.size) }}</span>
                <icon-mdi-close
                    v-if="!disabled"
                    class="file-upload__remove"
                    @click="handleRemove(index)"
                />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.file-upload {
    &__btn-icon {
        margin-right: 4px;
    }

    &__list {
        margin-top: 8px;
    }

    &__item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 8px;
        border-radius: 4px;
        transition: background-color 0.2s;

        &:hover {
            background-color: var(--el-fill-color-light);
        }
    }

    &__icon {
        flex-shrink: 0;
        font-size: 18px;
        color: var(--el-text-color-secondary);
    }

    &__name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
        color: var(--el-text-color-regular);
    }

    &__size {
        flex-shrink: 0;
        font-size: 12px;
        color: var(--el-text-color-placeholder);
    }

    &__remove {
        flex-shrink: 0;
        font-size: 16px;
        color: var(--el-text-color-placeholder);
        cursor: pointer;
        transition: color 0.2s;

        &:hover {
            color: var(--el-color-danger);
        }
    }
}
</style>
