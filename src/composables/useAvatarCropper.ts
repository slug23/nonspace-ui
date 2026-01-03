import { ref, computed, watch, type Ref } from 'vue'
import type { AvatarCrop } from './useAvatarManager'

export interface CropperState {
  /** Image element being cropped */
  image: HTMLImageElement | null
  /** Natural width of the source image */
  naturalWidth: number
  /** Natural height of the source image */
  naturalHeight: number
  /** Current pan offset X (in image pixels) */
  panX: number
  /** Current pan offset Y (in image pixels) */
  panY: number
  /** Current zoom level (1 = fit, higher = zoomed in) */
  zoom: number
  /** Minimum zoom to fill the crop area */
  minZoom: number
  /** Maximum zoom level */
  maxZoom: number
}

export interface CropperConfig {
  /** Shape of the crop area */
  shape?: 'circle' | 'square' | 'rounded'
  /** Size of the crop preview area in pixels */
  cropSize?: number
  /** Output size for the cropped image */
  outputSize?: number
  /** Maximum zoom multiplier */
  maxZoom?: number
  /** Output format */
  format?: 'image/jpeg' | 'image/png' | 'image/webp'
  /** Output quality (0-1) for jpeg/webp */
  quality?: number
}

const defaultConfig: Required<CropperConfig> = {
  shape: 'circle',
  cropSize: 280,
  outputSize: 512,
  maxZoom: 5,
  format: 'image/jpeg',
  quality: 0.92,
}

/**
 * Composable for handling avatar image cropping
 */
export function useAvatarCropper(config?: CropperConfig) {
  const mergedConfig = computed(() => ({ ...defaultConfig, ...config }))
  
  const state = ref<CropperState>({
    image: null,
    naturalWidth: 0,
    naturalHeight: 0,
    panX: 0,
    panY: 0,
    zoom: 1,
    minZoom: 1,
    maxZoom: defaultConfig.maxZoom,
  })
  
  const loading = ref(false)
  const error = ref<string | null>(null)
  const sourceFile = ref<File | null>(null)
  const sourceUrl = ref<string | null>(null)
  
  /**
   * Load an image from a File
   */
  async function loadFile(file: File): Promise<boolean> {
    loading.value = true
    error.value = null
    sourceFile.value = file
    
    // Revoke previous URL
    if (sourceUrl.value) {
      URL.revokeObjectURL(sourceUrl.value)
    }
    
    try {
      const url = URL.createObjectURL(file)
      sourceUrl.value = url
      
      const img = await loadImage(url)
      
      state.value.image = img
      state.value.naturalWidth = img.naturalWidth
      state.value.naturalHeight = img.naturalHeight
      
      // Calculate minimum zoom to fill crop area
      const { cropSize } = mergedConfig.value
      const scaleX = cropSize / img.naturalWidth
      const scaleY = cropSize / img.naturalHeight
      const minZoom = Math.max(scaleX, scaleY)
      
      state.value.minZoom = minZoom
      state.value.maxZoom = minZoom * mergedConfig.value.maxZoom
      state.value.zoom = minZoom
      
      // Center the image
      centerImage()
      
      loading.value = false
      return true
    } catch (e) {
      error.value = 'Failed to load image'
      loading.value = false
      return false
    }
  }
  
  /**
   * Load an image from a URL
   */
  async function loadUrl(url: string): Promise<boolean> {
    loading.value = true
    error.value = null
    sourceFile.value = null
    sourceUrl.value = url
    
    try {
      const img = await loadImage(url)
      
      state.value.image = img
      state.value.naturalWidth = img.naturalWidth
      state.value.naturalHeight = img.naturalHeight
      
      // Calculate minimum zoom to fill crop area
      const { cropSize } = mergedConfig.value
      const scaleX = cropSize / img.naturalWidth
      const scaleY = cropSize / img.naturalHeight
      const minZoom = Math.max(scaleX, scaleY)
      
      state.value.minZoom = minZoom
      state.value.maxZoom = minZoom * mergedConfig.value.maxZoom
      state.value.zoom = minZoom
      
      // Center the image
      centerImage()
      
      loading.value = false
      return true
    } catch (e) {
      error.value = 'Failed to load image'
      loading.value = false
      return false
    }
  }
  
  /**
   * Helper to load an image element
   */
  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = src
    })
  }
  
  /**
   * Center the image in the crop area
   */
  function centerImage() {
    const { cropSize } = mergedConfig.value
    const { naturalWidth, naturalHeight, zoom } = state.value
    
    const scaledWidth = naturalWidth * zoom
    const scaledHeight = naturalHeight * zoom
    
    // Pan offset to center the image
    state.value.panX = (scaledWidth - cropSize) / 2 / zoom
    state.value.panY = (scaledHeight - cropSize) / 2 / zoom
  }
  
  /**
   * Set zoom level (clamped to valid range)
   */
  function setZoom(newZoom: number) {
    const { minZoom, maxZoom } = state.value
    const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom))
    
    // Adjust pan to keep center point stable
    const oldZoom = state.value.zoom
    const { cropSize } = mergedConfig.value
    
    // Calculate center point in image coordinates
    const centerX = state.value.panX + cropSize / (2 * oldZoom)
    const centerY = state.value.panY + cropSize / (2 * oldZoom)
    
    // Set new zoom
    state.value.zoom = clampedZoom
    
    // Recalculate pan to keep same center
    state.value.panX = centerX - cropSize / (2 * clampedZoom)
    state.value.panY = centerY - cropSize / (2 * clampedZoom)
    
    // Clamp pan to valid bounds
    clampPan()
  }
  
  /**
   * Pan the image by delta pixels (in screen space)
   */
  function pan(deltaX: number, deltaY: number) {
    const { zoom } = state.value
    
    // Convert screen delta to image space delta
    state.value.panX -= deltaX / zoom
    state.value.panY -= deltaY / zoom
    
    clampPan()
  }
  
  /**
   * Clamp pan to keep image covering the crop area
   */
  function clampPan() {
    const { cropSize } = mergedConfig.value
    const { naturalWidth, naturalHeight, zoom } = state.value
    
    // Visible area in image coordinates
    const visibleWidth = cropSize / zoom
    const visibleHeight = cropSize / zoom
    
    // Clamp pan so image always covers crop area
    const maxPanX = naturalWidth - visibleWidth
    const maxPanY = naturalHeight - visibleHeight
    
    state.value.panX = Math.max(0, Math.min(maxPanX, state.value.panX))
    state.value.panY = Math.max(0, Math.min(maxPanY, state.value.panY))
  }
  
  /**
   * Get the current crop region in original image coordinates
   */
  const cropRegion = computed<AvatarCrop | null>(() => {
    if (!state.value.image) return null
    
    const { cropSize } = mergedConfig.value
    const { panX, panY, zoom } = state.value
    
    // The visible area in image coordinates
    const width = cropSize / zoom
    const height = cropSize / zoom
    
    return {
      x: Math.round(panX),
      y: Math.round(panY),
      width: Math.round(width),
      height: Math.round(height),
      zoom,
    }
  })
  
  /**
   * Get CSS transform for displaying the image in the crop preview
   */
  const imageTransform = computed(() => {
    const { zoom, panX, panY } = state.value
    const translateX = -panX * zoom
    const translateY = -panY * zoom
    return `translate(${translateX}px, ${translateY}px) scale(${zoom})`
  })
  
  /**
   * Export the cropped image as a Blob
   */
  async function exportCrop(): Promise<Blob | null> {
    if (!state.value.image || !cropRegion.value) return null
    
    const { outputSize, format, quality } = mergedConfig.value
    const crop = cropRegion.value
    
    const canvas = document.createElement('canvas')
    canvas.width = outputSize
    canvas.height = outputSize
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    
    // For circular crops, we still output a square image
    // The circle mask is purely visual in the UI
    
    ctx.drawImage(
      state.value.image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      outputSize,
      outputSize
    )
    
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        format,
        quality
      )
    })
  }
  
  /**
   * Export as a File (with proper filename)
   */
  async function exportCropAsFile(filename?: string): Promise<File | null> {
    const blob = await exportCrop()
    if (!blob) return null
    
    const { format } = mergedConfig.value
    const ext = format.split('/')[1]
    const name = filename || `avatar-cropped.${ext}`
    
    return new File([blob], name, { type: format })
  }
  
  /**
   * Clean up resources
   */
  function cleanup() {
    if (sourceUrl.value && sourceFile.value) {
      // Only revoke if we created the URL from a file
      URL.revokeObjectURL(sourceUrl.value)
    }
    state.value = {
      image: null,
      naturalWidth: 0,
      naturalHeight: 0,
      panX: 0,
      panY: 0,
      zoom: 1,
      minZoom: 1,
      maxZoom: defaultConfig.maxZoom,
    }
    sourceFile.value = null
    sourceUrl.value = null
    error.value = null
  }
  
  /**
   * Reset to initial centered state
   */
  function reset() {
    if (!state.value.image) return
    
    const { cropSize } = mergedConfig.value
    const scaleX = cropSize / state.value.naturalWidth
    const scaleY = cropSize / state.value.naturalHeight
    const minZoom = Math.max(scaleX, scaleY)
    
    state.value.zoom = minZoom
    centerImage()
  }
  
  return {
    // State
    state,
    loading,
    error,
    sourceFile,
    sourceUrl,
    cropRegion,
    imageTransform,
    config: mergedConfig,
    
    // Methods
    loadFile,
    loadUrl,
    setZoom,
    pan,
    centerImage,
    reset,
    exportCrop,
    exportCropAsFile,
    cleanup,
  }
}

export type { AvatarCrop }

