<script setup lang="ts">
import { ref, computed } from 'vue'
import { useImageList } from './hooks/use-image-list'
import { useFileSelect } from '../hooks/use-file-select'
import type { UploadFileItem } from '../types'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'ImageUpload' })

const props = withDefaults(
    defineProps<{
        modelValue: (string | File)[]
        /** 最大数量，1 = 单图模式 */
        limit?: number
        /** 接受的文件类型 */
        accept?: string
        /** 单文件大小上限（MB） */
        maxSize?: number
        disabled?: boolean
    }>(),
    {
        accept: 'image/*',
    },
)

const emit = defineEmits<{
    'update:modelValue': [(string | File)[]]
}>()

const { fileList, previewUrls } = useImageList(() => props.modelValue)

const { triggerSelect } = useFileSelect(() => ({
    accept: props.accept,
    maxSize: props.maxSize,
    multiple: !props.limit || props.limit > 1,
    maxCount: props.limit ? props.limit - props.modelValue.length : undefined,
    onInvalidType: (file) => {
        ElMessage.warning(`"${file.name}" 不是支持的图片格式`)
    },
    onExceedSize: (file, maxSize) => {
        ElMessage.warning(`"${file.name}" 超出 ${maxSize}MB 大小限制`)
    },
    onExceedCount: () => {
        ElMessage.warning(`最多只能上传 ${props.limit} 张图片`)
    },
}))

/** 是否可以继续添加 */
const canAdd = computed(() => {
    if (props.disabled) return false
    if (!props.limit) return true
    return fileList.value.length < props.limit
})

/** 预览状态 */
const previewVisible = ref(false)
const previewIndex = ref(0)

async function handleAdd() {
    const files = await triggerSelect()
    if (!files.length) return
    emit('update:modelValue', [...props.modelValue, ...files])
}

function handleRemove(item: UploadFileItem) {
    const idx = fileList.value.findIndex((f) => f.uid === item.uid)
    if (idx === -1) return
    const newVal = [...props.modelValue]
    newVal.splice(idx, 1)
    emit('update:modelValue', newVal)
}

function handlePreview(item: UploadFileItem) {
    previewIndex.value = fileList.value.findIndex((f) => f.uid === item.uid)
    previewVisible.value = true
}
</script>

<template>
    <div class="image-upload">
        <div
            v-for="item in fileList"
            :key="item.uid"
            class="image-upload__item"
        >
            <img
                :src="item.url"
                :alt="item.name"
                class="image-upload__img"
            />
            <div class="image-upload__overlay">
                <icon-mdi-magnify-plus-outline
                    class="image-upload__action"
                    @click="handlePreview(item)"
                />
                <icon-mdi-delete-outline
                    v-if="!disabled"
                    class="image-upload__action"
                    @click="handleRemove(item)"
                />
            </div>
        </div>

        <div
            v-if="canAdd"
            class="image-upload__add"
            @click="handleAdd"
        >
            <icon-mdi-plus />
        </div>

        <el-image-viewer
            v-if="previewVisible"
            :url-list="previewUrls"
            :initial-index="previewIndex"
            @close="previewVisible = false"
        />
    </div>
</template>

<style scoped lang="scss">
.image-upload {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    &__item {
        position: relative;
        width: 104px;
        height: 104px;
        border-radius: 6px;
        overflow: hidden;
        border: 1px solid var(--el-border-color);
    }

    &__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    &__overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        background: rgb(0 0 0 / 50%);
        opacity: 0;
        transition: opacity 0.3s;

        .image-upload__item:hover & {
            opacity: 1;
        }
    }

    &__action {
        color: #fff;
        font-size: 20px;
        cursor: pointer;

        &:hover {
            color: var(--el-color-primary);
        }
    }

    &__add {
        width: 104px;
        height: 104px;
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--el-text-color-placeholder);
        font-size: 24px;
        transition:
            border-color 0.3s,
            color 0.3s;

        &:hover {
            border-color: var(--el-color-primary);
            color: var(--el-color-primary);
        }
    }
}
</style>
