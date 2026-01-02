<script setup lang="ts">
/**
 * ImageViewerProvider - Mount this once at app root to enable global image viewing
 * 
 * Usage in App.vue:
 *   import { ImageViewerProvider } from 'nonspace-ui'
 * 
 *   <template>
 *     <RouterView />
 *     <ImageViewerProvider />
 *   </template>
 */

import { computed } from 'vue'
import ImageViewer from './ImageViewer.vue'
import { useImageViewer, type ViewerImage } from '../composables/useImageViewer'

const { isOpen, images, initialIndex, _setOpen } = useImageViewer()

// Unwrap readonly for internal component usage
const imagesList = computed(() => [...images.value] as ViewerImage[])

function handleClose() {
  _setOpen(false)
}
</script>

<template>
  <ImageViewer
    :images="imagesList"
    :initial-index="initialIndex"
    :open="isOpen"
    @close="handleClose"
  />
</template>

