/**
 * nonspace-ui - Shared Vue 3 UI components
 * 
 * Install:
 *   npm install nonspace-ui
 *   # or for local development:
 *   npm link nonspace-ui
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
 */

// Components
export { default as ImageViewer } from './components/ImageViewer.vue'
export { default as ImageViewerProvider } from './components/ImageViewerProvider.vue'

// Composables
export { useImageViewer } from './composables/useImageViewer'

// Types
export type {
  ViewerImage,
  ImageVariant,
  ImageVariants,
  FetchVariantsFn,
} from './composables/useImageViewer'

