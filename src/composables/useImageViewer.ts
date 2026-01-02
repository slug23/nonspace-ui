/**
 * useImageViewer - Composable for opening the image viewer from anywhere
 * 
 * Usage:
 *   import { useImageViewer } from 'nonspace-ui'
 *   
 *   const { openViewer } = useImageViewer()
 *   
 *   // Single image
 *   openViewer([{ url: 'https://...' }])
 *   
 *   // Gallery with starting index
 *   openViewer([
 *     { url: 'img1.jpg', thumbnail: 'img1_thumb.jpg' },
 *     { url: 'img2.jpg', thumbnail: 'img2_thumb.jpg' },
 *   ], 1) // Start at second image
 */

import { ref, readonly, type Ref, type DeepReadonly } from 'vue'

/** A single variant with URL and dimensions */
export interface ImageVariant {
  url: string
  width: number
  height: number
}

/** Available image variants for quality selection */
export interface ImageVariants {
  thumb?: ImageVariant
  sm?: ImageVariant
  md?: ImageVariant
  lg?: ImageVariant
  original?: ImageVariant
}

/** An image that can be displayed in the viewer */
export interface ViewerImage {
  /** Primary URL to display */
  url: string
  /** Thumbnail URL for gallery strip */
  thumbnail?: string
  /** Alt text for accessibility */
  alt?: string
  /** Original dimensions */
  width?: number
  height?: number
  /** Optional file ID for custom variant fetching */
  fileId?: string
  /** Pre-loaded variants for quality selection */
  variants?: ImageVariants
}

/**
 * Function signature for fetching image variants
 * Allows consuming projects to plug in their own API
 */
export type FetchVariantsFn = (fileId: string) => Promise<ImageVariants | null>

// Global state - shared across all components
const isOpen = ref(false)
const images = ref<ViewerImage[]>([])
const initialIndex = ref(0)

// Optional variant fetcher that can be set by consuming app
let variantFetcher: FetchVariantsFn | null = null

export function useImageViewer() {
  /**
   * Set a custom function for fetching image variants
   * Call this once at app initialization
   */
  function setVariantFetcher(fn: FetchVariantsFn | null) {
    variantFetcher = fn
  }

  /**
   * Get the current variant fetcher (if set)
   */
  function getVariantFetcher(): FetchVariantsFn | null {
    return variantFetcher
  }

  /**
   * Open the image viewer
   */
  function openViewer(newImages: ViewerImage[], startIndex = 0) {
    images.value = newImages
    initialIndex.value = startIndex
    isOpen.value = true
  }

  /**
   * Close the image viewer
   */
  function closeViewer() {
    isOpen.value = false
  }

  /**
   * Open a single image
   */
  function openImage(url: string, alt?: string) {
    openViewer([{ url, alt }], 0)
  }

  return {
    // State (readonly to prevent external mutation)
    isOpen: readonly(isOpen) as DeepReadonly<Ref<boolean>>,
    images: readonly(images) as DeepReadonly<Ref<ViewerImage[]>>,
    initialIndex: readonly(initialIndex) as DeepReadonly<Ref<number>>,
    
    // Actions
    openViewer,
    closeViewer,
    openImage,
    setVariantFetcher,
    getVariantFetcher,
    
    // For the provider component
    _setOpen: (value: boolean) => { isOpen.value = value },
  }
}

