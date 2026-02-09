<script setup lang="ts">
import { isArray } from '@/utils'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

onMounted(() => {
    const { params, query } = route
    const { path } = params
    const targetPath = '/' + (isArray(path) ? path.join('/') : path)
    router.replace({ path: targetPath, query })
})
</script>

<template>
    <div></div>
</template>
