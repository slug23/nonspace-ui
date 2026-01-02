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

import ImageViewer from './ImageViewer.vue'
import { useImageViewer } from '../composables/useImageViewer'

const { isOpen, images, initialIndex, _setOpen } = useImageViewer()

function handleClose() {
  _setOpen(false)
}
</script>

<template>
  <ImageViewer
    :images="images"
    :initial-index="initialIndex"
    :open="isOpen"
    @close="handleClose"
  />
</template>

