<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAvatarCropper, type CropperConfig, type AvatarCrop } from '../composables/useAvatarCropper'

const props = withDefaults(defineProps<{
  /** File to crop */
  file?: File | null
  /** URL to crop (alternative to file) */
  url?: string | null
  /** Shape of the crop area */
  shape?: 'circle' | 'square' | 'rounded'
  /** Size of the crop preview in pixels */
  cropSize?: number
  /** Output size for exported image */
  outputSize?: number
  /** Show the zoom slider */
  showZoomSlider?: boolean
  /** Show reset button */
  showReset?: boolean
  /** Primary action label */
  confirmLabel?: string
  /** Cancel action label */
  cancelLabel?: string
  /** Additional cropper config */
  config?: CropperConfig
}>(), {
  shape: 'circle',
  cropSize: 280,
  outputSize: 512,
  showZoomSlider: true,
  showReset: true,
  confirmLabel: 'Apply',
  cancelLabel: 'Cancel',
})

const emit = defineEmits<{
  (e: 'confirm', data: { file: File; crop: AvatarCrop }): void
  (e: 'cancel'): void
  (e: 'crop-change', crop: AvatarCrop): void
}>()

const {
  state,
  loading,
  error,
  sourceUrl,
  cropRegion,
  imageTransform,
  config: cropperConfig,
  loadFile,
  loadUrl,
  setZoom,
  pan,
  reset,
  exportCropAsFile,
  cleanup,
} = useAvatarCropper({
  shape: props.shape,
  cropSize: props.cropSize,
  outputSize: props.outputSize,
  ...props.config,
})

const cropAreaRef = ref<HTMLDivElement | null>(null)
const isDragging = ref(false)
const lastPointer = ref({ x: 0, y: 0 })

// Watch for file/url changes
watch(() => props.file, async (newFile) => {
  if (newFile) {
    await loadFile(newFile)
  }
}, { immediate: true })

watch(() => props.url, async (newUrl) => {
  if (newUrl && !props.file) {
    await loadUrl(newUrl)
  }
}, { immediate: true })

// Emit crop changes
watch(cropRegion, (crop) => {
  if (crop) {
    emit('crop-change', crop)
  }
})

// Zoom percentage for display
const zoomPercent = computed(() => {
  if (!state.value.minZoom) return 100
  return Math.round((state.value.zoom / state.value.minZoom) * 100)
})

// Normalized zoom for slider (0-1)
const normalizedZoom = computed({
  get: () => {
    const { zoom, minZoom, maxZoom } = state.value
    if (maxZoom === minZoom) return 0
    return (zoom - minZoom) / (maxZoom - minZoom)
  },
  set: (value: number) => {
    const { minZoom, maxZoom } = state.value
    const newZoom = minZoom + value * (maxZoom - minZoom)
    setZoom(newZoom)
  }
})

// Shape class for crop overlay
const shapeClass = computed(() => {
  switch (props.shape) {
    case 'circle': return 'rounded-full'
    case 'rounded': return 'rounded-3xl'
    default: return ''
  }
})

// Pointer event handlers
function handlePointerDown(e: PointerEvent) {
  if (loading.value) return
  
  isDragging.value = true
  lastPointer.value = { x: e.clientX, y: e.clientY }
  
  const target = e.target as HTMLElement
  target.setPointerCapture(e.pointerId)
}

function handlePointerMove(e: PointerEvent) {
  if (!isDragging.value) return
  
  const deltaX = e.clientX - lastPointer.value.x
  const deltaY = e.clientY - lastPointer.value.y
  
  pan(deltaX, deltaY)
  
  lastPointer.value = { x: e.clientX, y: e.clientY }
}

function handlePointerUp(e: PointerEvent) {
  isDragging.value = false
  const target = e.target as HTMLElement
  target.releasePointerCapture(e.pointerId)
}

// Wheel zoom
function handleWheel(e: WheelEvent) {
  e.preventDefault()
  
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  const { zoom, minZoom, maxZoom } = state.value
  const range = maxZoom - minZoom
  const newZoom = zoom + delta * range * 0.3
  
  setZoom(newZoom)
}

// Touch zoom (pinch)
let lastTouchDistance = 0

function handleTouchStart(e: TouchEvent) {
  if (e.touches.length === 2) {
    lastTouchDistance = getTouchDistance(e.touches)
  }
}

function handleTouchMove(e: TouchEvent) {
  if (e.touches.length === 2) {
    e.preventDefault()
    const newDistance = getTouchDistance(e.touches)
    const scale = newDistance / lastTouchDistance
    
    setZoom(state.value.zoom * scale)
    
    lastTouchDistance = newDistance
  }
}

function getTouchDistance(touches: TouchList): number {
  const dx = touches[0].clientX - touches[1].clientX
  const dy = touches[0].clientY - touches[1].clientY
  return Math.sqrt(dx * dx + dy * dy)
}

// Actions
async function handleConfirm() {
  if (!cropRegion.value) return
  
  const file = await exportCropAsFile()
  if (file) {
    emit('confirm', { file, crop: cropRegion.value })
  }
}

function handleCancel() {
  cleanup()
  emit('cancel')
}

function handleReset() {
  reset()
}

// Keyboard support
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    handleCancel()
  } else if (e.key === 'Enter') {
    handleConfirm()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  cleanup()
})
</script>

<template>
  <div class="avatar-cropper flex flex-col items-center gap-6">
    <!-- Crop area -->
    <div class="relative">
      <!-- Loading state -->
      <div
        v-if="loading"
        class="flex items-center justify-center bg-dark-800"
        :class="shapeClass"
        :style="{ width: `${cropSize}px`, height: `${cropSize}px` }"
      >
        <div class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Error state -->
      <div
        v-else-if="error"
        class="flex flex-col items-center justify-center gap-2 bg-dark-800 text-red-400"
        :class="shapeClass"
        :style="{ width: `${cropSize}px`, height: `${cropSize}px` }"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span class="text-sm">{{ error }}</span>
      </div>

      <!-- Cropper viewport -->
      <div
        v-else-if="state.image"
        ref="cropAreaRef"
        class="relative overflow-hidden bg-dark-900 select-none touch-none"
        :class="shapeClass"
        :style="{ 
          width: `${cropSize}px`, 
          height: `${cropSize}px`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
        @pointercancel="handlePointerUp"
        @wheel="handleWheel"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
      >
        <!-- The image -->
        <img
          :src="sourceUrl || ''"
          alt="Crop preview"
          class="absolute top-0 left-0 origin-top-left pointer-events-none"
          :style="{ transform: imageTransform }"
          draggable="false"
        />

        <!-- Subtle grid overlay for positioning guidance -->
        <div class="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
          <div class="absolute inset-0 border border-white/20"></div>
          <div class="absolute left-1/3 top-0 bottom-0 w-px bg-white/10"></div>
          <div class="absolute right-1/3 top-0 bottom-0 w-px bg-white/10"></div>
          <div class="absolute top-1/3 left-0 right-0 h-px bg-white/10"></div>
          <div class="absolute bottom-1/3 left-0 right-0 h-px bg-white/10"></div>
          <!-- Center crosshair -->
          <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6">
            <div class="absolute left-1/2 top-0 bottom-0 w-px bg-white/30 -translate-x-1/2"></div>
            <div class="absolute top-1/2 left-0 right-0 h-px bg-white/30 -translate-y-1/2"></div>
          </div>
        </div>

        <!-- Drag hint overlay (shows briefly) -->
        <div
          v-if="!isDragging"
          class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
        >
          <div class="flex items-center gap-2 px-3 py-1.5 bg-black/60 rounded-full text-white text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            Drag to reposition
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else
        class="flex items-center justify-center bg-dark-800 text-dark-500"
        :class="shapeClass"
        :style="{ width: `${cropSize}px`, height: `${cropSize}px` }"
      >
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <!-- Shape outline (for non-circle shapes, subtle border) -->
      <div
        v-if="props.shape !== 'circle' && state.image"
        class="absolute inset-0 pointer-events-none border-2 border-white/20"
        :class="shapeClass"
      ></div>
    </div>

    <!-- Zoom controls -->
    <div v-if="showZoomSlider && state.image" class="w-full max-w-xs space-y-2">
      <div class="flex items-center gap-3">
        <!-- Zoom out icon -->
        <button
          type="button"
          class="p-1.5 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors"
          @click="setZoom(state.zoom - (state.maxZoom - state.minZoom) * 0.1)"
          :disabled="state.zoom <= state.minZoom"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
        </button>

        <!-- Zoom slider -->
        <div class="flex-1 relative">
          <input
            type="range"
            :value="normalizedZoom"
            min="0"
            max="1"
            step="0.01"
            class="zoom-slider w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer"
            @input="(e) => normalizedZoom = parseFloat((e.target as HTMLInputElement).value)"
          />
        </div>

        <!-- Zoom in icon -->
        <button
          type="button"
          class="p-1.5 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors"
          @click="setZoom(state.zoom + (state.maxZoom - state.minZoom) * 0.1)"
          :disabled="state.zoom >= state.maxZoom"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </button>

        <!-- Zoom percentage -->
        <span class="w-12 text-right text-sm text-dark-400 tabular-nums">
          {{ zoomPercent }}%
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-3">
      <button
        v-if="showReset && state.image"
        type="button"
        class="px-4 py-2 text-sm text-dark-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors"
        @click="handleReset"
      >
        Reset
      </button>

      <button
        type="button"
        class="px-4 py-2 text-sm text-dark-300 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
        @click="handleCancel"
      >
        {{ cancelLabel }}
      </button>

      <button
        type="button"
        class="px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!state.image || loading"
        @click="handleConfirm"
      >
        {{ confirmLabel }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.avatar-cropper {
  --color-primary-500: #8b5cf6;
  --color-primary-600: #7c3aed;
  --color-dark-400: #9ca3af;
  --color-dark-500: #6b7280;
  --color-dark-600: #4b5563;
  --color-dark-700: #374151;
  --color-dark-800: #1f2937;
  --color-dark-900: #111827;
}

.zoom-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: transform 0.15s ease;
}

.zoom-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.zoom-slider::-webkit-slider-thumb:active {
  transform: scale(0.95);
}

.zoom-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
</style>

