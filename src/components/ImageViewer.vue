<script setup lang="ts">
/**
 * ImageViewer - A standalone, reusable image lightbox component
 * 
 * Features:
 * - Fullscreen lightbox overlay
 * - Zoom in/out with mouse wheel or buttons
 * - Pan when zoomed (drag to move)
 * - Keyboard navigation (Escape, arrow keys, +/-)
 * - Touch/pinch zoom support
 * - Gallery mode with multiple images
 * - Smooth animations
 * - Download button
 * - Optional variant fetching for higher quality images
 * 
 * Usage:
 *   <ImageViewer 
 *     :images="[{ url: '...', thumbnail: '...', alt: '...' }]"
 *     :initial-index="0"
 *     :open="isOpen"
 *     @close="isOpen = false"
 *   />
 * 
 * Or use the composable:
 *   const { openViewer } = useImageViewer()
 *   openViewer([{ url: '...' }], 0)
 */

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { ViewerImage, ImageVariants } from '../composables/useImageViewer'
import { useImageViewer } from '../composables/useImageViewer'

const props = withDefaults(defineProps<{
  images: ViewerImage[]
  initialIndex?: number
  open: boolean
}>(), {
  initialIndex: 0,
})

const emit = defineEmits<{
  close: []
  indexChange: [index: number]
}>()

const { getVariantFetcher } = useImageViewer()

// State
const currentIndex = ref(props.initialIndex)
const zoom = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const isLoading = ref(true)
const hasError = ref(false)
const isLoadingVariants = ref(false)
const loadedVariants = ref<Map<string, ImageVariants>>(new Map())

// Current image from props
const currentImageRaw = computed(() => props.images[currentIndex.value])

// Current image with potentially enhanced variants
const currentImage = computed(() => {
  const raw = currentImageRaw.value
  if (!raw) return null
  
  // Check if we have loaded variants for this image
  if (raw.fileId && loadedVariants.value.has(raw.fileId)) {
    const variants = loadedVariants.value.get(raw.fileId)!
    return { ...raw, variants }
  }
  
  return raw
})

// Get the best available URL for the current image
const currentImageUrl = computed(() => {
  const img = currentImage.value
  if (!img) return ''
  
  // Prefer higher quality variants: lg > md > sm > original > url
  if (img.variants) {
    if (img.variants.lg?.url) return img.variants.lg.url
    if (img.variants.original?.url) return img.variants.original.url
    if (img.variants.md?.url) return img.variants.md.url
    if (img.variants.sm?.url) return img.variants.sm.url
    if (img.variants.thumb?.url) return img.variants.thumb.url
  }
  
  return img.url
})

const hasMultiple = computed(() => props.images.length > 1)
const canPrev = computed(() => currentIndex.value > 0)
const canNext = computed(() => currentIndex.value < props.images.length - 1)

// Reset state when image changes
watch(currentIndex, () => {
  zoom.value = 1
  panX.value = 0
  panY.value = 0
  isLoading.value = true
  hasError.value = false
  emit('indexChange', currentIndex.value)
})

// Reset when opening
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    currentIndex.value = props.initialIndex
    zoom.value = 1
    panX.value = 0
    panY.value = 0
    isLoading.value = true
    hasError.value = false
    document.body.style.overflow = 'hidden'
    
    // Try to fetch variants for the initial image
    fetchVariantsIfNeeded()
  } else {
    document.body.style.overflow = ''
  }
})

// Fetch variants when image changes
watch(currentImageRaw, () => {
  fetchVariantsIfNeeded()
})

// Fetch full-resolution variants if a fetcher is configured
async function fetchVariantsIfNeeded() {
  const img = currentImageRaw.value
  if (!img?.fileId) return
  
  // Already have variants
  if (loadedVariants.value.has(img.fileId)) return
  
  // Check if we already have good variants
  if (img.variants?.lg || img.variants?.original) return
  
  // Check if a variant fetcher is configured
  const fetcher = getVariantFetcher()
  if (!fetcher) return
  
  isLoadingVariants.value = true
  
  try {
    const variants = await fetcher(img.fileId)
    if (variants) {
      loadedVariants.value.set(img.fileId, variants)
    }
  } catch (err) {
    console.error('Failed to fetch variants:', err)
  } finally {
    isLoadingVariants.value = false
  }
}

// Navigation
function prev() {
  if (canPrev.value) {
    currentIndex.value--
  }
}

function next() {
  if (canNext.value) {
    currentIndex.value++
  }
}

function goTo(index: number) {
  if (index >= 0 && index < props.images.length) {
    currentIndex.value = index
  }
}

// Zoom controls
const MIN_ZOOM = 0.5
const MAX_ZOOM = 5
const ZOOM_STEP = 0.25

function zoomIn() {
  zoom.value = Math.min(MAX_ZOOM, zoom.value + ZOOM_STEP)
}

function zoomOut() {
  zoom.value = Math.max(MIN_ZOOM, zoom.value - ZOOM_STEP)
  if (zoom.value <= 1) {
    panX.value = 0
    panY.value = 0
  }
}

function resetZoom() {
  zoom.value = 1
  panX.value = 0
  panY.value = 0
}

function handleWheel(e: WheelEvent) {
  e.preventDefault()
  if (e.deltaY < 0) {
    zoomIn()
  } else {
    zoomOut()
  }
}

// Pan (drag when zoomed)
function startDrag(e: MouseEvent | TouchEvent) {
  if (zoom.value <= 1) return
  isDragging.value = true
  const point = 'touches' in e ? e.touches[0] : e
  dragStart.value = { x: point.clientX - panX.value, y: point.clientY - panY.value }
}

function doDrag(e: MouseEvent | TouchEvent) {
  if (!isDragging.value) return
  e.preventDefault()
  const point = 'touches' in e ? e.touches[0] : e
  panX.value = point.clientX - dragStart.value.x
  panY.value = point.clientY - dragStart.value.y
}

function endDrag() {
  isDragging.value = false
}

// Keyboard handling
function handleKeydown(e: KeyboardEvent) {
  if (!props.open) return
  
  switch (e.key) {
    case 'Escape':
      emit('close')
      break
    case 'ArrowLeft':
      prev()
      break
    case 'ArrowRight':
      next()
      break
    case '+':
    case '=':
      zoomIn()
      break
    case '-':
      zoomOut()
      break
    case '0':
      resetZoom()
      break
  }
}

// Download current image (prefer full-res)
async function downloadImage() {
  if (!currentImage.value) return
  
  try {
    // Use best available URL for download
    const downloadUrl = currentImageUrl.value
    const response = await fetch(downloadUrl)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = currentImage.value.alt || `image-${currentIndex.value + 1}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Failed to download image:', err)
  }
}

// Image load handlers
function onImageLoad() {
  isLoading.value = false
}

function onImageError() {
  isLoading.value = false
  hasError.value = true
}

// Close on backdrop click (but not on image)
function handleBackdropClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('viewer-backdrop')) {
    emit('close')
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

// Image transform style
const imageStyle = computed(() => ({
  transform: `scale(${zoom.value}) translate(${panX.value / zoom.value}px, ${panY.value / zoom.value}px)`,
  cursor: zoom.value > 1 ? (isDragging.value ? 'grabbing' : 'grab') : 'default',
}))
</script>

<template>
  <Teleport to="body">
    <Transition name="viewer">
      <div 
        v-if="open" 
        class="viewer-backdrop"
        @click="handleBackdropClick"
        @wheel.prevent="handleWheel"
      >
        <!-- Close button -->
        <button class="viewer-btn close-btn" @click="emit('close')" title="Close (Esc)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <!-- Top toolbar -->
        <div class="viewer-toolbar top">
          <span class="image-counter" v-if="hasMultiple">
            {{ currentIndex + 1 }} / {{ images.length }}
          </span>
        </div>

        <!-- Navigation arrows -->
        <button 
          v-if="hasMultiple && canPrev" 
          class="viewer-btn nav-btn prev"
          @click.stop="prev"
          title="Previous (←)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        <button 
          v-if="hasMultiple && canNext" 
          class="viewer-btn nav-btn next"
          @click.stop="next"
          title="Next (→)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        <!-- Main image container -->
        <div class="image-container">
          <!-- Loading spinner -->
          <div v-if="isLoading" class="loading-spinner">
            <div class="spinner"></div>
          </div>

          <!-- Error state -->
          <div v-if="hasError" class="error-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
            <span>Failed to load image</span>
          </div>

          <!-- Image -->
          <img
            v-show="!hasError"
            :src="currentImageUrl"
            :alt="currentImage?.alt || 'Image'"
            :style="imageStyle"
            class="viewer-image"
            draggable="false"
            @load="onImageLoad"
            @error="onImageError"
            @mousedown="startDrag"
            @mousemove="doDrag"
            @mouseup="endDrag"
            @mouseleave="endDrag"
            @touchstart="startDrag"
            @touchmove="doDrag"
            @touchend="endDrag"
          />
          
          <!-- Loading variants indicator -->
          <div v-if="isLoadingVariants" class="loading-variants">
            Loading full resolution...
          </div>
        </div>

        <!-- Bottom toolbar -->
        <div class="viewer-toolbar bottom">
          <!-- Zoom controls -->
          <div class="zoom-controls">
            <button class="viewer-btn small" @click="zoomOut" title="Zoom out (-)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35M8 11h6"/>
              </svg>
            </button>
            <span class="zoom-level" @click="resetZoom" title="Reset zoom (0)">
              {{ Math.round(zoom * 100) }}%
            </span>
            <button class="viewer-btn small" @click="zoomIn" title="Zoom in (+)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/>
              </svg>
            </button>
          </div>

          <!-- Download button -->
          <button class="viewer-btn small" @click="downloadImage" title="Download">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
          </button>
        </div>

        <!-- Thumbnail strip for gallery -->
        <div v-if="hasMultiple && images.length <= 20" class="thumbnail-strip">
          <button
            v-for="(img, idx) in images"
            :key="idx"
            class="thumbnail"
            :class="{ active: idx === currentIndex }"
            @click="goTo(idx)"
          >
            <img :src="img.thumbnail || img.url" :alt="`Thumbnail ${idx + 1}`" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.viewer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}

/* Transitions */
.viewer-enter-active,
.viewer-leave-active {
  transition: opacity 0.2s ease;
}

.viewer-enter-from,
.viewer-leave-to {
  opacity: 0;
}

/* Buttons */
.viewer-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.15s;
}

.viewer-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.viewer-btn:active {
  transform: scale(0.95);
}

.viewer-btn svg {
  width: 24px;
  height: 24px;
}

.viewer-btn.small {
  width: 40px;
  height: 40px;
}

.viewer-btn.small svg {
  width: 20px;
  height: 20px;
}

/* Close button */
.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 48px;
  height: 48px;
  z-index: 10;
}

/* Navigation buttons */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  z-index: 10;
}

.nav-btn.prev {
  left: 16px;
}

.nav-btn.next {
  right: 16px;
}

/* Toolbars */
.viewer-toolbar {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  z-index: 10;
}

.viewer-toolbar.top {
  top: 16px;
}

.viewer-toolbar.bottom {
  bottom: 16px;
}

.image-counter {
  color: white;
  font-size: 14px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

/* Zoom controls */
.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-level {
  color: white;
  font-size: 13px;
  font-weight: 500;
  min-width: 50px;
  text-align: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.15s;
}

.zoom-level:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Image container */
.image-container {
  position: relative;
  max-width: 90vw;
  max-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.viewer-image {
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
  user-select: none;
  transition: transform 0.1s ease-out;
}

/* Loading spinner */
.loading-spinner {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error state */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.error-state svg {
  width: 48px;
  height: 48px;
}

/* Loading variants indicator */
.loading-variants {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: rgba(255, 255, 255, 0.8);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
}

/* Thumbnail strip */
.thumbnail-strip {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  max-width: 90vw;
  overflow-x: auto;
}

.thumbnail {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.15s;
  padding: 0;
  background: none;
}

.thumbnail:hover {
  opacity: 0.9;
}

.thumbnail.active {
  border-color: white;
  opacity: 1;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .nav-btn {
    width: 44px;
    height: 44px;
  }
  
  .nav-btn.prev {
    left: 8px;
  }
  
  .nav-btn.next {
    right: 8px;
  }
  
  .close-btn {
    top: 8px;
    right: 8px;
    width: 44px;
    height: 44px;
  }
  
  .thumbnail-strip {
    bottom: 70px;
  }
  
  .thumbnail {
    width: 48px;
    height: 48px;
  }
}
</style>






