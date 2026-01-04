import { ref, computed, type Ref } from 'vue'
import type { AvatarCrop } from './useAvatarManager'

export interface CropperState {
  /** Image element being cropped */
  image: HTMLImageElement | null
  /** Natural width of the source image */
  naturalWidth: number
  /** Natural height of the source image */
  naturalHeight: number
  /** 
   * Pan offset X - the LEFT edge of the crop window in original image pixels.
   * Range: [0, naturalWidth - cropWindowSize]
   */
  panX: number
  /** 
   * Pan offset Y - the TOP edge of the crop window in original image pixels.
   * Range: [0, naturalHeight - cropWindowSize]
   */
  panY: number
  /** 
   * Zoom level - how many screen pixels per original image pixel.
   * zoom = 1 means 1:1, zoom = 2 means each original pixel takes 2 screen pixels.
   * minZoom is the smallest zoom that still covers the crop area.
   */
  zoom: number
  /** Minimum zoom to fill the crop area */
  minZoom: number
  /** Maximum zoom level */
  maxZoom: number
}

export interface CropperConfig {
  /** Shape of the crop area */
  shape?: 'circle' | 'square' | 'rounded'
  /** Size of the crop preview area in pixels (UI display size) */
  cropSize?: number
  /** Output size for the cropped image (0 = use original crop size) */
  outputSize?: number
  /** Maximum zoom multiplier relative to minZoom */
  maxZoom?: number
  /** Output format */
  format?: 'image/jpeg' | 'image/png' | 'image/webp'
  /** Output quality (0-1) for jpeg/webp */
  quality?: number
}

const defaultConfig: Required<CropperConfig> = {
  shape: 'circle',
  cropSize: 280,
  outputSize: 0, // 0 = use original crop dimensions
  maxZoom: 5,
  format: 'image/jpeg',
  quality: 0.92,
}

/**
 * Composable for handling avatar image cropping
 * 
 * Coordinate system:
 * - panX, panY: Top-left corner of crop window in ORIGINAL image pixels
 * - zoom: Screen pixels per original pixel (zoom=2 means 2x magnification)
 * - cropSize: Fixed UI size of crop window in screen pixels
 * 
 * The crop window size in original pixels = cropSize / zoom
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
   * Get the size of the crop window in original image pixels at current zoom
   */
  function getCropWindowSize(): number {
    return mergedConfig.value.cropSize / state.value.zoom
  }
  
  /**
   * Calculate the minimum zoom needed to fill the crop area
   * The image must be scaled up enough that its smaller dimension fills the crop area
   */
  function calculateMinZoom(naturalWidth: number, naturalHeight: number): number {
    const { cropSize } = mergedConfig.value
    const smallerDimension = Math.min(naturalWidth, naturalHeight)
    // zoom = screen pixels / original pixels
    // We need: smallerDimension * zoom >= cropSize
    return cropSize / smallerDimension
  }
  
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
      initializeState(img)
      
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
      initializeState(img)
      
      loading.value = false
      return true
    } catch (e) {
      error.value = 'Failed to load image'
      loading.value = false
      return false
    }
  }
  
  /**
   * Initialize state after loading an image
   */
  function initializeState(img: HTMLImageElement) {
    const minZoom = calculateMinZoom(img.naturalWidth, img.naturalHeight)
    
    state.value.image = img
    state.value.naturalWidth = img.naturalWidth
    state.value.naturalHeight = img.naturalHeight
    state.value.minZoom = minZoom
    state.value.maxZoom = minZoom * mergedConfig.value.maxZoom
    state.value.zoom = minZoom
    state.value.panX = 0
    state.value.panY = 0
    
    // Center the image
    centerImage()
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
   * Center the crop window in the image
   */
  function centerImage() {
    const { naturalWidth, naturalHeight } = state.value
    const cropWindowSize = getCropWindowSize()
    
    // Center the crop window
    state.value.panX = Math.max(0, (naturalWidth - cropWindowSize) / 2)
    state.value.panY = Math.max(0, (naturalHeight - cropWindowSize) / 2)
    
    clampPan()
  }
  
  /**
   * Set zoom level (clamped to valid range)
   * Keeps the center of the crop window stable during zoom
   */
  function setZoom(newZoom: number) {
    const { minZoom, maxZoom, zoom: oldZoom, panX, panY } = state.value
    const { cropSize } = mergedConfig.value
    
    const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom))
    if (Math.abs(clampedZoom - oldZoom) < 0.0001) return
    
    // Calculate the center point of the current crop window in original image coords
    const oldCropWindowSize = cropSize / oldZoom
    const centerX = panX + oldCropWindowSize / 2
    const centerY = panY + oldCropWindowSize / 2
    
    // Update zoom
    state.value.zoom = clampedZoom
    
    // Calculate new pan to keep the same center point visible
    const newCropWindowSize = cropSize / clampedZoom
    state.value.panX = centerX - newCropWindowSize / 2
    state.value.panY = centerY - newCropWindowSize / 2
    
    // Clamp pan to valid bounds
    clampPan()
  }
  
  /**
   * Pan the image by delta pixels (in screen space)
   * Dragging RIGHT (positive deltaX) moves the image right, showing more of the LEFT side
   */
  function pan(deltaX: number, deltaY: number) {
    const { zoom } = state.value
    
    // Convert screen delta to original image delta
    // Positive screen delta = dragging right/down = decrease pan (show earlier part of image)
    state.value.panX -= deltaX / zoom
    state.value.panY -= deltaY / zoom
    
    clampPan()
  }
  
  /**
   * Clamp pan to keep image covering the crop area
   * Pan values are the top-left corner of the crop window
   */
  function clampPan() {
    const { naturalWidth, naturalHeight } = state.value
    const cropWindowSize = getCropWindowSize()
    
    // The crop window must stay within the image bounds
    // panX range: [0, naturalWidth - cropWindowSize]
    // panY range: [0, naturalHeight - cropWindowSize]
    const maxPanX = Math.max(0, naturalWidth - cropWindowSize)
    const maxPanY = Math.max(0, naturalHeight - cropWindowSize)
    
    state.value.panX = Math.max(0, Math.min(maxPanX, state.value.panX))
    state.value.panY = Math.max(0, Math.min(maxPanY, state.value.panY))
  }
  
  /**
   * Get the current crop region in original image coordinates
   */
  const cropRegion = computed<AvatarCrop | null>(() => {
    if (!state.value.image) return null
    
    const { panX, panY, zoom, naturalWidth, naturalHeight } = state.value
    const cropWindowSize = getCropWindowSize()
    
    // Ensure the crop doesn't exceed image bounds
    const x = Math.max(0, Math.round(panX))
    const y = Math.max(0, Math.round(panY))
    const width = Math.min(Math.round(cropWindowSize), naturalWidth - x)
    const height = Math.min(Math.round(cropWindowSize), naturalHeight - y)
    
    return {
      x,
      y,
      width,
      height,
      zoom,
    }
  })
  
  /**
   * Get CSS transform for displaying the image in the crop preview
   * 
   * The image starts at natural size, positioned at top-left.
   * We need to:
   * 1. Scale it by zoom (each original pixel becomes 'zoom' screen pixels)
   * 2. Translate so that (panX, panY) in original coords appears at (0, 0) on screen
   * 
   * After scaling, point (panX, panY) is at screen position (panX * zoom, panY * zoom)
   * To move it to (0, 0), translate by (-panX * zoom, -panY * zoom)
   */
  const imageTransform = computed(() => {
    const { zoom, panX, panY } = state.value
    
    const translateX = -panX * zoom
    const translateY = -panY * zoom
    
    // CSS transforms apply right-to-left, so scale happens first, then translate
    return `translate(${translateX}px, ${translateY}px) scale(${zoom})`
  })
  
  /**
   * Export the cropped image as a Blob
   * Uses original image data for maximum quality
   */
  async function exportCrop(): Promise<Blob | null> {
    if (!state.value.image || !cropRegion.value) return null
    
    const { outputSize, format, quality } = mergedConfig.value
    const crop = cropRegion.value
    
    // Use original crop size if outputSize is 0, otherwise scale to outputSize
    const finalSize = outputSize > 0 ? outputSize : crop.width
    
    const canvas = document.createElement('canvas')
    canvas.width = finalSize
    canvas.height = finalSize
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    
    // Draw from original image at full resolution
    ctx.drawImage(
      state.value.image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      finalSize,
      finalSize
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
   * Reset to initial centered state at minimum zoom
   */
  function reset() {
    if (!state.value.image) return
    
    state.value.zoom = state.value.minZoom
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
