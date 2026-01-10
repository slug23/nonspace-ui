<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useAvatarUpload, type AvatarUploadConfig, type AvatarUploadResult } from '../composables/useAvatarUpload'
import type { AvatarCrop } from '../composables/useAvatarManager'
import AvatarCropper from './AvatarCropper.vue'

export interface AvatarUploadProps {
  /** Current avatar URL to display */
  modelValue?: string | null
  /** Size of the avatar in pixels (default: 120) */
  size?: number
  /** Upload configuration */
  config?: Partial<AvatarUploadConfig>
  /** Whether the avatar is editable (default: true) */
  editable?: boolean
  /** Placeholder text when no avatar (default: initials or icon) */
  placeholder?: string
  /** Shape: 'circle' | 'rounded' | 'square' */
  shape?: 'circle' | 'rounded' | 'square'
  /** Show upload progress ring */
  showProgress?: boolean
  /** Custom CSS classes for the container */
  containerClass?: string
  /** Enable crop UI before upload (default: false) */
  enableCrop?: boolean
  /** Crop area size in pixels (default: 280) */
  cropSize?: number
  /** Output size for cropped image (default: 512) */
  cropOutputSize?: number
}

const props = withDefaults(defineProps<AvatarUploadProps>(), {
  size: 120,
  editable: true,
  shape: 'circle',
  showProgress: true,
  enableCrop: false,
  cropSize: 280,
  cropOutputSize: 512,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'upload-start', file: File): void
  (e: 'upload-progress', progress: number): void
  (e: 'upload-success', result: AvatarUploadResult & { crop?: AvatarCrop }): void
  (e: 'upload-error', error: { message: string; code?: string }): void
  (e: 'file-selected', file: File): void
  (e: 'crop-applied', data: { file: File; crop: AvatarCrop }): void
}>()

const {
  uploading,
  progress,
  error,
  previewUrl,
  selectedFile,
  selectFile,
  clearSelection,
  upload,
  uploadWithCrop,
} = useAvatarUpload(props.config)

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const showCropper = ref(false)
const pendingFile = ref<File | null>(null)
const lastCrop = ref<AvatarCrop | null>(null)

// Computed display URL (preview takes priority over modelValue)
const displayUrl = computed(() => previewUrl.value || props.modelValue || null)

// Shape class
const shapeClass = computed(() => {
  switch (props.shape) {
    case 'rounded': return 'rounded-2xl'
    case 'square': return 'rounded-none'
    default: return 'rounded-full'
  }
})

// Progress ring calculations
const circumference = computed(() => 2 * Math.PI * 45) // radius 45
const strokeDashoffset = computed(() => {
  return circumference.value - (progress.value / 100) * circumference.value
})

// Watch for upload completion
watch(progress, (newProgress) => {
  emit('upload-progress', newProgress)
})

watch(error, (newError) => {
  if (newError) {
    emit('upload-error', newError)
  }
})

function triggerFileInput() {
  if (!props.editable || uploading.value) return
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    handleFile(file)
  }
  // Reset input so same file can be selected again
  input.value = ''
}

function handleFile(file: File) {
  // Validate file type first
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
  if (!validTypes.some(type => file.type === type)) {
    emit('upload-error', { 
      message: 'Invalid file type. Please select a JPEG, PNG, WebP, or HEIC image.',
      code: 'INVALID_TYPE'
    })
    return
  }
  
  emit('file-selected', file)
  
  if (props.enableCrop) {
    // Show cropper instead of auto-uploading
    pendingFile.value = file
    showCropper.value = true
  } else {
    // Original behavior: select and auto-upload
    const validationError = selectFile(file)
    if (validationError) {
      return
    }
    handleUpload()
  }
}

async function handleUpload() {
  if (!selectedFile.value) return
  
  emit('upload-start', selectedFile.value)
  
  const result = await upload()
  
  if (result) {
    emit('upload-success', result)
    // Emit the best available URL
    const bestUrl = result.variants?.lg?.url || result.variants?.md?.url || result.url
    emit('update:modelValue', bestUrl)
    // Clear selection after successful upload
    clearSelection()
  }
}

async function handleCropConfirm(data: { file: File; crop: AvatarCrop }) {
  showCropper.value = false
  pendingFile.value = null
  lastCrop.value = data.crop
  
  emit('crop-applied', data)
  
  // Select the cropped file and upload
  const validationError = selectFile(data.file)
  if (validationError) {
    return
  }
  
  emit('upload-start', data.file)
  
  // Upload with crop metadata
  const result = await uploadWithCrop(data.crop)
  
  if (result) {
    emit('upload-success', { ...result, crop: data.crop })
    const bestUrl = result.variants?.lg?.url || result.variants?.md?.url || result.url
    emit('update:modelValue', bestUrl)
    clearSelection()
  }
}

function handleCropCancel() {
  showCropper.value = false
  pendingFile.value = null
}

// Drag and drop handlers
function handleDragEnter(e: DragEvent) {
  e.preventDefault()
  if (props.editable && !uploading.value) {
    isDragging.value = true
  }
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
}

function handleDragOver(e: DragEvent) {
  e.preventDefault()
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  
  if (!props.editable || uploading.value) return
  
  const file = e.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    handleFile(file)
  }
}

// Cleanup on unmount
onUnmounted(() => {
  clearSelection()
})
</script>

<template>
  <div>
    <!-- Cropper Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showCropper && pendingFile"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <!-- Backdrop -->
          <div 
            class="absolute inset-0 bg-black/80 backdrop-blur-sm"
            @click="handleCropCancel"
          ></div>
          
          <!-- Cropper container -->
          <div class="relative bg-dark-900 rounded-2xl p-6 shadow-2xl border border-dark-700 max-w-md w-full">
            <h3 class="text-lg font-semibold text-white mb-4 text-center">
              Adjust your photo
            </h3>
            
            <AvatarCropper
              :file="pendingFile"
              :shape="shape"
              :crop-size="cropSize"
              :output-size="cropOutputSize"
              confirm-label="Save"
              @confirm="handleCropConfirm"
              @cancel="handleCropCancel"
            />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Main avatar display -->
    <div 
      class="avatar-upload-container relative inline-block"
      :class="containerClass"
      :style="{ width: `${size}px`, height: `${size}px` }"
    >
      <!-- Hidden file input -->
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        class="hidden"
        @change="handleFileSelect"
      />
      
      <!-- Avatar display -->
      <div
        class="avatar-upload relative w-full h-full overflow-hidden transition-all duration-200"
        :class="[
          shapeClass,
          editable && !uploading ? 'cursor-pointer hover:ring-4 hover:ring-primary-500/30' : '',
          isDragging ? 'ring-4 ring-primary-500 scale-105' : '',
          error ? 'ring-2 ring-red-500' : ''
        ]"
        @click="triggerFileInput"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        @dragover="handleDragOver"
        @drop="handleDrop"
      >
        <!-- Image -->
        <img
          v-if="displayUrl"
          :src="displayUrl"
          alt="Avatar"
          class="w-full h-full object-cover"
        />
        
        <!-- Placeholder when no image -->
        <div
          v-else
          class="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center"
        >
          <span v-if="placeholder" class="text-white font-semibold" :style="{ fontSize: `${size / 3}px` }">
            {{ placeholder }}
          </span>
          <svg v-else class="text-slate-400" :width="size / 2.5" :height="size / 2.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        
        <!-- Hover overlay for editable -->
        <div
          v-if="editable && !uploading"
          class="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <svg class="text-white" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        
        <!-- Upload progress overlay -->
        <div
          v-if="uploading"
          class="absolute inset-0 bg-black/60 flex items-center justify-center"
        >
          <svg v-if="showProgress" class="transform -rotate-90" width="60" height="60" viewBox="0 0 100 100">
            <!-- Background circle -->
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              stroke-width="6"
              class="text-white/20"
            />
            <!-- Progress circle -->
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              stroke-width="6"
              stroke-linecap="round"
              class="text-primary-500 transition-all duration-200"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="strokeDashoffset"
            />
          </svg>
          <span class="absolute text-white font-medium text-sm">{{ progress }}%</span>
        </div>
      </div>
      
      <!-- Error message -->
      <div
        v-if="error && !uploading"
        class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-red-400"
      >
        {{ error.message }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar-upload-container {
  --color-primary-500: #8b5cf6;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

