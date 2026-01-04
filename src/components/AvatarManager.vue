<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAvatarManager, type Avatar, type AvatarManagerConfig, type AvatarCrop } from '../composables/useAvatarManager'
import AvatarCropper from './AvatarCropper.vue'

const props = withDefaults(defineProps<{
  /** Current user's initials for fallback */
  initials?: string
  /** Maximum number of avatars allowed */
  maxAvatars?: number
  /** Show upload button */
  allowUpload?: boolean
  /** Show delete buttons */
  allowDelete?: boolean
  /** Allow editing/cropping avatars */
  allowEdit?: boolean
  /** Enable crop UI when uploading */
  enableCropOnUpload?: boolean
  /** Avatar grid size (compact mode) */
  avatarSize?: number
  /** Shape of avatars */
  shape?: 'circle' | 'square' | 'rounded'
  /** Display mode: 'compact' (grid) or 'expanded' (list with details) */
  mode?: 'compact' | 'expanded'
  /** Crop preview size */
  cropSize?: number
  /** Local config overrides */
  config?: Partial<AvatarManagerConfig>
}>(), {
  initials: '',
  maxAvatars: 10,
  allowUpload: true,
  allowDelete: true,
  allowEdit: true,
  enableCropOnUpload: false,
  avatarSize: 80,
  shape: 'circle',
  mode: 'compact',
  cropSize: 280,
})

const emit = defineEmits<{
  (e: 'select', avatar: Avatar): void
  (e: 'primary-changed', avatar: Avatar): void
  (e: 'upload-success', avatar: Avatar): void
  (e: 'upload-error', error: string): void
  (e: 'delete', avatar: Avatar): void
  (e: 'crop-updated', avatar: Avatar, crop: AvatarCrop): void
}>()

const {
  avatars,
  loading,
  error,
  uploading,
  uploadProgress,
  fetchAvatars,
  setPrimary,
  deleteAvatar,
  uploadAndCreateAvatar,
  getAvatarUrl,
} = useAvatarManager(props.config)

const fileInputRef = ref<HTMLInputElement | null>(null)
const confirmDeleteId = ref<string | null>(null)
const selectedId = ref<string | null>(null)

// Cropper state
const showCropper = ref(false)
const cropperMode = ref<'upload' | 'edit'>('upload')
const pendingUploadFile = ref<File | null>(null)
const editingAvatar = ref<Avatar | null>(null)

const canUpload = computed(() => {
  return props.allowUpload && avatars.value.length < props.maxAvatars
})

const shapeClass = computed(() => {
  switch (props.shape) {
    case 'circle': return 'rounded-full'
    case 'square': return 'rounded-none'
    case 'rounded': return 'rounded-xl'
    default: return 'rounded-full'
  }
})

// For the cropper, get the image URL to edit
const cropperUrl = computed(() => {
  if (editingAvatar.value) {
    return editingAvatar.value.original_url
  }
  return null
})

onMounted(() => {
  fetchAvatars()
})

function triggerUpload() {
  fileInputRef.value?.click()
}

async function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  input.value = ''

  if (props.enableCropOnUpload) {
    // Show cropper before uploading
    pendingUploadFile.value = file
    cropperMode.value = 'upload'
    showCropper.value = true
  } else {
    // Direct upload without cropping
    const avatar = await uploadAndCreateAvatar(file, {
      name: `Avatar ${avatars.value.length + 1}`,
      is_primary: avatars.value.length === 0,
      fallback_initials: props.initials,
    })

    if (avatar) {
      emit('upload-success', avatar)
    } else if (error.value) {
      emit('upload-error', error.value)
    }
  }
}

function handleEditAvatar(avatar: Avatar) {
  editingAvatar.value = avatar
  cropperMode.value = 'edit'
  showCropper.value = true
}

async function handleCropConfirm(data: { file: File; crop: AvatarCrop }) {
  showCropper.value = false

  if (cropperMode.value === 'upload' && pendingUploadFile.value) {
    // Upload the cropped file
    const avatar = await uploadAndCreateAvatar(data.file, {
      name: `Avatar ${avatars.value.length + 1}`,
      is_primary: avatars.value.length === 0,
      fallback_initials: props.initials,
      crop: data.crop,
    })

    if (avatar) {
      emit('upload-success', avatar)
    } else if (error.value) {
      emit('upload-error', error.value)
    }
  } else if (cropperMode.value === 'edit' && editingAvatar.value) {
    // Re-upload the cropped version and update the avatar
    const avatar = await uploadAndCreateAvatar(data.file, {
      name: editingAvatar.value.name,
      is_primary: editingAvatar.value.is_primary,
      fallback_initials: props.initials,
      crop: data.crop,
    })

    if (avatar) {
      // Delete the old avatar if the new one was created successfully
      await deleteAvatar(editingAvatar.value.id)
      emit('crop-updated', avatar, data.crop)
    } else if (error.value) {
      emit('upload-error', error.value)
    }
  }

  // Reset state
  pendingUploadFile.value = null
  editingAvatar.value = null
}

function handleCropCancel() {
  showCropper.value = false
  pendingUploadFile.value = null
  editingAvatar.value = null
}

async function handleSetPrimary(avatar: Avatar) {
  if (avatar.is_primary) return
  const success = await setPrimary(avatar.id)
  if (success) {
    emit('primary-changed', avatar)
  }
}

async function handleDelete(avatar: Avatar) {
  if (confirmDeleteId.value !== avatar.id) {
    confirmDeleteId.value = avatar.id
    return
  }

  const success = await deleteAvatar(avatar.id)
  if (success) {
    emit('delete', avatar)
    confirmDeleteId.value = null
  }
}

function cancelDelete() {
  confirmDeleteId.value = null
}

function selectAvatar(avatar: Avatar) {
  selectedId.value = avatar.id
  emit('select', avatar)
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  })
}

function getSourceLabel(source: string): string {
  const labels: Record<string, string> = {
    upload: 'Uploaded',
    gravatar: 'Gravatar',
    oauth: 'OAuth',
    generated: 'Generated',
    ai: 'AI Generated',
  }
  return labels[source] || source
}
</script>

<template>
  <div class="avatar-manager">
    <!-- Hidden file input -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      style="display: none;"
      @change="handleFileSelect"
    />

    <!-- Cropper Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showCropper && (pendingUploadFile || editingAvatar)"
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
              {{ cropperMode === 'edit' ? 'Adjust your photo' : 'Position your photo' }}
            </h3>
            
            <AvatarCropper
              :file="pendingUploadFile"
              :url="cropperUrl"
              :shape="shape"
              :crop-size="cropSize"
              :confirm-label="cropperMode === 'edit' ? 'Save changes' : 'Upload'"
              @confirm="handleCropConfirm"
              @cancel="handleCropCancel"
            />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Loading state -->
    <div v-if="loading && avatars.length === 0" class="flex items-center justify-center py-8">
      <div class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error && avatars.length === 0" class="text-center py-8">
      <div class="text-red-400 mb-2">{{ error }}</div>
      <button 
        @click="fetchAvatars"
        class="text-sm text-primary-400 hover:text-primary-300 underline"
      >
        Try again
      </button>
    </div>

    <!-- ================================ -->
    <!-- COMPACT MODE (Grid) -->
    <!-- ================================ -->
    <div v-else-if="mode === 'compact'" class="space-y-3">
      <div class="flex flex-wrap gap-3">
        <!-- Existing avatars -->
        <div
          v-for="avatar in avatars"
          :key="avatar.id"
          class="relative group"
          :style="{ width: `${avatarSize}px`, height: `${avatarSize}px` }"
        >
          <!-- Avatar with ring indicator for primary -->
          <button
            @click="selectAvatar(avatar)"
            class="w-full h-full overflow-hidden transition-all duration-200"
            :class="[
              shapeClass,
              avatar.is_primary 
                ? 'ring-[3px] ring-emerald-500 ring-offset-2 ring-offset-dark-900' 
                : selectedId === avatar.id 
                  ? 'ring-2 ring-dark-400 ring-offset-2 ring-offset-dark-900' 
                  : 'ring-2 ring-transparent hover:ring-dark-500 ring-offset-2 ring-offset-dark-900'
            ]"
          >
            <img
              :src="getAvatarUrl(avatar, 'md')"
              :alt="avatar.alt_text || avatar.name || 'Avatar'"
              class="w-full h-full object-cover"
              :style="avatar.dominant_color ? { backgroundColor: avatar.dominant_color } : {}"
            />
          </button>

          <!-- Moderation pending badge (only badge we keep) -->
          <div
            v-if="avatar.moderation_status === 'pending'"
            class="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg"
            title="Pending moderation"
          >
            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
            </svg>
          </div>

          <!-- Hover actions overlay -->
          <div
            class="absolute inset-0 bg-black/70 transition-opacity flex items-center justify-center gap-1"
            :class="[
              shapeClass,
              confirmDeleteId === avatar.id 
                ? 'z-50 opacity-100' 
                : 'z-10 opacity-0 group-hover:opacity-100'
            ]"
          >
            <!-- Edit/Crop button -->
            <button
              v-if="allowEdit"
              type="button"
              @click.stop="handleEditAvatar(avatar)"
              class="p-1.5 bg-dark-700 hover:bg-primary-600 rounded-lg transition-colors"
              title="Edit crop"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>

            <button
              v-if="!avatar.is_primary"
              type="button"
              @click.stop="handleSetPrimary(avatar)"
              class="p-1.5 bg-dark-700 hover:bg-emerald-600 rounded-lg transition-colors"
              title="Set as primary"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>

            <button
              v-if="allowDelete"
              type="button"
              @click.stop="handleDelete(avatar)"
              class="p-1.5 rounded-lg transition-colors"
              :class="confirmDeleteId === avatar.id ? 'bg-red-600 hover:bg-red-700' : 'bg-dark-700 hover:bg-red-600'"
              :title="confirmDeleteId === avatar.id ? 'Click again to confirm' : 'Delete'"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Upload button -->
        <button
          v-if="canUpload"
          type="button"
          @click="triggerUpload"
          :disabled="uploading"
          class="upload-button flex items-center justify-center border-2 border-dashed border-dark-600 hover:border-primary-500 transition-colors"
          :class="shapeClass"
          :style="{ 
            width: `${avatarSize}px`, 
            height: `${avatarSize}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed #4b5563',
            borderRadius: shape === 'circle' ? '9999px' : shape === 'rounded' ? '12px' : '0',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            transition: 'border-color 0.2s'
          }"
        >
          <div v-if="uploading" style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
            <svg style="position: absolute; inset: 8px; width: auto; height: auto;" viewBox="0 0 36 36">
              <path
                stroke="#374151"
                stroke-width="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                stroke="#8b5cf6"
                stroke-width="3"
                fill="none"
                stroke-linecap="round"
                :stroke-dasharray="`${uploadProgress}, 100`"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span style="font-size: 12px; font-weight: 500; color: #9ca3af;">{{ uploadProgress }}%</span>
          </div>
          <div v-else style="color: #6b7280;">
            <svg style="width: 24px; height: 24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </button>
      </div>

      <!-- Help text -->
      <p class="text-xs text-dark-500">
        <span v-if="avatars.length === 0">Upload your first avatar</span>
        <span v-else>
          {{ avatars.length }}/{{ maxAvatars }} · 
          <span class="text-emerald-500">Green ring</span> = primary · Hover for options
        </span>
      </p>

      <div v-if="error" class="text-sm text-red-400">{{ error }}</div>
    </div>

    <!-- ================================ -->
    <!-- EXPANDED MODE (List with details) -->
    <!-- ================================ -->
    <div v-else class="space-y-3">
      <!-- Avatar list -->
      <div class="space-y-2">
        <div
          v-for="avatar in avatars"
          :key="avatar.id"
          class="flex items-center gap-4 p-3 rounded-xl transition-colors"
          :class="[
            avatar.is_primary 
              ? 'bg-emerald-500/10 border border-emerald-500/30' 
              : 'bg-dark-800 border border-dark-700 hover:border-dark-600'
          ]"
        >
          <!-- Avatar thumbnail -->
          <button
            @click="selectAvatar(avatar)"
            class="flex-shrink-0 w-14 h-14 overflow-hidden transition-transform hover:scale-105"
            :class="shapeClass"
          >
            <img
              :src="getAvatarUrl(avatar, 'sm')"
              :alt="avatar.alt_text || avatar.name || 'Avatar'"
              class="w-full h-full object-cover"
            />
          </button>

          <!-- Avatar info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-medium text-white truncate">
                {{ avatar.name || 'Unnamed avatar' }}
              </span>
              <span 
                v-if="avatar.is_primary" 
                class="px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded-full"
              >
                Primary
              </span>
              <span 
                v-if="avatar.moderation_status === 'pending'" 
                class="px-2 py-0.5 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded-full"
              >
                Pending
              </span>
            </div>
            <div class="flex items-center gap-3 mt-1 text-xs text-dark-400">
              <span>{{ getSourceLabel(avatar.source) }}</span>
              <span>·</span>
              <span>{{ formatDate(avatar.created_at) }}</span>
              <span v-if="avatar.format === 'animated'">·</span>
              <span v-if="avatar.format === 'animated'" class="text-purple-400">Animated</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <!-- Edit/Crop button -->
            <button
              v-if="allowEdit"
              type="button"
              @click="handleEditAvatar(avatar)"
              class="p-2 text-dark-400 hover:text-primary-400 hover:bg-dark-700 rounded-lg transition-colors"
              title="Edit crop"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>

            <button
              v-if="!avatar.is_primary"
              type="button"
              @click="handleSetPrimary(avatar)"
              class="p-2 text-dark-400 hover:text-emerald-400 hover:bg-dark-700 rounded-lg transition-colors"
              title="Set as primary"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>

            <button
              v-if="allowDelete"
              type="button"
              @click="handleDelete(avatar)"
              class="p-2 rounded-lg transition-colors"
              :class="confirmDeleteId === avatar.id 
                ? 'text-white bg-red-600 hover:bg-red-700' 
                : 'text-dark-400 hover:text-red-400 hover:bg-dark-700'"
              :title="confirmDeleteId === avatar.id ? 'Click again to confirm' : 'Delete'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Upload button (expanded) -->
      <button
        v-if="canUpload"
        type="button"
        @click="triggerUpload"
        :disabled="uploading"
        class="w-full flex items-center justify-center gap-3 p-4 border-2 border-dashed border-dark-600 hover:border-primary-500 rounded-xl transition-colors group"
      >
        <template v-if="uploading">
          <div class="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <span class="text-dark-400">Uploading... {{ uploadProgress }}%</span>
        </template>
        <template v-else>
          <svg class="w-5 h-5 text-dark-500 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="text-dark-500 group-hover:text-primary-400 transition-colors">
            Add new avatar
          </span>
        </template>
      </button>

      <!-- Footer info -->
      <div class="flex items-center justify-between text-xs text-dark-500">
        <span>{{ avatars.length }} of {{ maxAvatars }} avatars</span>
        <span v-if="error" class="text-red-400">{{ error }}</span>
      </div>
    </div>

    <!-- Confirm delete overlay (click outside to cancel) -->
    <div
      v-if="confirmDeleteId"
      class="fixed inset-0 z-40"
      @click="cancelDelete"
    ></div>
  </div>
</template>

<style scoped>
.avatar-manager {
  @apply relative;
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
