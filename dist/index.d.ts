/**
 * nonspace-ui - Shared Vue 3 UI components
 *
 * Install:
 *   npm install nonspace-ui
 *   # or for local development:
 *   npm link nonspace-ui
 *
 * ============================================
 * IMAGE VIEWER
 * ============================================
 *
 * Usage:
 *   // In your App.vue, add the provider once:
 *   import { ImageViewerProvider } from 'nonspace-ui'
 *
 *   <template>
 *     <RouterView />
 *     <ImageViewerProvider />
 *   </template>
 *
 *   // Anywhere in your app, open images:
 *   import { useImageViewer } from 'nonspace-ui'
 *
 *   const { openViewer } = useImageViewer()
 *   openViewer([{ url: 'https://example.com/image.jpg' }])
 *
 * Optional: Configure variant fetching for higher-quality images:
 *   const { setVariantFetcher } = useImageViewer()
 *   setVariantFetcher(async (fileId) => {
 *     const response = await fetch(`/api/files/${fileId}/status`)
 *     const data = await response.json()
 *     return data.variants
 *   })
 *
 * ============================================
 * AVATAR UPLOAD
 * ============================================
 *
 * A complete avatar upload component with preview, drag & drop, and progress.
 *
 * Setup (once, at app initialization):
 *   import { configureAvatarUpload } from 'nonspace-ui'
 *
 *   configureAvatarUpload({
 *     uploadUrl: 'https://api.example.com/v1/upload',
 *     apiKey: 'your-api-key',
 *     projectId: 'your-project-id'
 *   })
 *
 * Usage:
 *   import { AvatarUpload } from 'nonspace-ui'
 *
 *   <template>
 *     <AvatarUpload
 *       v-model="user.avatarUrl"
 *       :size="100"
 *       placeholder="JD"
 *       @upload-success="onAvatarUpdated"
 *     />
 *   </template>
 *
 * Props:
 *   - modelValue: Current avatar URL
 *   - size: Size in pixels (default: 120)
 *   - editable: Allow upload (default: true)
 *   - placeholder: Text to show when no avatar
 *   - shape: 'circle' | 'rounded' | 'square'
 *   - showProgress: Show upload progress ring (default: true)
 *   - enableCrop: Show crop UI before upload (default: false)
 *   - cropSize: Crop preview size in pixels (default: 280)
 *   - cropOutputSize: Output size for cropped image (default: 512)
 *
 * Events:
 *   - update:modelValue: Emitted with new URL after successful upload
 *   - upload-start: Emitted when upload begins
 *   - upload-progress: Emitted with progress (0-100)
 *   - upload-success: Emitted with full upload result (includes crop data if used)
 *   - upload-error: Emitted on error
 *   - file-selected: Emitted when a file is selected
 *   - crop-applied: Emitted when user confirms crop (with file and crop data)
 *
 * ============================================
 * AVATAR CROPPER (Standalone)
 * ============================================
 *
 * Use the cropper independently for custom workflows:
 *
 *   import { AvatarCropper, useAvatarCropper } from 'nonspace-ui'
 *
 *   <template>
 *     <AvatarCropper
 *       :file="selectedFile"
 *       shape="circle"
 *       :crop-size="300"
 *       @confirm="handleCropConfirm"
 *       @cancel="handleCancel"
 *     />
 *   </template>
 *
 * Cropper Props:
 *   - file: File object to crop
 *   - url: URL to crop (alternative to file)
 *   - shape: 'circle' | 'square' | 'rounded'
 *   - cropSize: Preview area size in pixels (default: 280)
 *   - outputSize: Output image size (default: 512)
 *   - showZoomSlider: Show zoom controls (default: true)
 *   - showReset: Show reset button (default: true)
 *   - confirmLabel: Primary button text (default: 'Apply')
 *   - cancelLabel: Cancel button text (default: 'Cancel')
 *
 * Cropper Events:
 *   - confirm: Emitted with { file: File, crop: AvatarCrop }
 *   - cancel: Emitted when user cancels
 *   - crop-change: Emitted when crop region changes
 *
 * Low-level composable for custom crop UIs:
 *   const {
 *     state,
 *     loading,
 *     cropRegion,
 *     imageTransform,
 *     loadFile,
 *     setZoom,
 *     pan,
 *     exportCropAsFile,
 *   } = useAvatarCropper({ shape: 'circle', cropSize: 300 })
 */
export { default as ImageViewer } from './components/ImageViewer.vue';
export { default as ImageViewerProvider } from './components/ImageViewerProvider.vue';
export { default as AvatarUpload } from './components/AvatarUpload.vue';
export { default as AvatarManager } from './components/AvatarManager.vue';
export { default as AvatarCropper } from './components/AvatarCropper.vue';
export { useImageViewer } from './composables/useImageViewer';
export { useAvatarUpload, configureAvatarUpload } from './composables/useAvatarUpload';
export { useAvatarManager, configureAvatarManager } from './composables/useAvatarManager';
export { useAvatarCropper } from './composables/useAvatarCropper';
export type { ViewerImage, ImageVariant, ImageVariants, FetchVariantsFn, } from './composables/useImageViewer';
export type { AvatarUploadConfig, AvatarUploadResult, AvatarUploadError, } from './composables/useAvatarUpload';
export type { Avatar, AvatarVariant, AvatarVariants, AvatarCrop, AvatarFallback, AvatarManagerConfig, } from './composables/useAvatarManager';
export type { CropperConfig, CropperState, } from './composables/useAvatarCropper';
