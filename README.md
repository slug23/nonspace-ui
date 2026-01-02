# nonspace-ui

Shared Vue 3 UI components for [nonspace](https://github.com/yourusername/nonspace) and [ecos](https://github.com/yourusername/ecos) projects.

## Components

### ImageViewer

A full-featured image lightbox with:
- Fullscreen overlay with blur backdrop
- Zoom in/out (mouse wheel, +/- keys, buttons)
- Pan when zoomed (drag to move)
- Keyboard navigation (Escape, arrow keys)
- Touch/pinch zoom support
- Gallery mode with thumbnail strip
- Download button
- Optional high-resolution variant loading

## Installation

```bash
# From npm (when published)
npm install nonspace-ui

# For local development, use npm link
cd ~/code/nonspace-ui
npm install
npm link

# Then in your project:
cd ~/code/nonspace  # or ~/code/ecos
npm link nonspace-ui
```

## Usage

### 1. Add the Provider (once, in App.vue)

```vue
<script setup lang="ts">
import { ImageViewerProvider } from 'nonspace-ui'
</script>

<template>
  <RouterView />
  <ImageViewerProvider />
</template>
```

### 2. Open Images from Anywhere

```vue
<script setup lang="ts">
import { useImageViewer } from 'nonspace-ui'

const { openViewer, openImage } = useImageViewer()

// Single image
function viewImage() {
  openImage('https://example.com/photo.jpg', 'A beautiful photo')
}

// Gallery with multiple images
function viewGallery() {
  openViewer([
    { url: 'img1.jpg', thumbnail: 'thumb1.jpg', alt: 'Image 1' },
    { url: 'img2.jpg', thumbnail: 'thumb2.jpg', alt: 'Image 2' },
    { url: 'img3.jpg', thumbnail: 'thumb3.jpg', alt: 'Image 3' },
  ], 0) // start at first image
}
</script>

<template>
  <button @click="viewImage">View Image</button>
  <button @click="viewGallery">View Gallery</button>
</template>
```

### 3. (Optional) Configure Variant Fetching

If your backend supports image variants (different resolutions), you can configure the viewer to fetch them:

```ts
import { useImageViewer } from 'nonspace-ui'

const { setVariantFetcher } = useImageViewer()

// Call once at app initialization
setVariantFetcher(async (fileId: string) => {
  const response = await fetch(`/api/files/${fileId}/status`, {
    headers: { 'Authorization': `Bearer ${yourToken}` }
  })
  const data = await response.json()
  
  // Return variants object with optional thumb, sm, md, lg, original
  return data.success ? data.variants : null
})
```

Then when opening images, include the `fileId`:

```ts
openViewer([
  { 
    url: 'quickthumb.jpg', // shown immediately
    fileId: 'abc123',      // used to fetch higher quality
    alt: 'My image'
  }
])
```

## ViewerImage Type

```ts
interface ViewerImage {
  url: string           // Primary URL to display
  thumbnail?: string    // Optional thumbnail for gallery strip
  alt?: string          // Alt text for accessibility
  width?: number        // Original dimensions (optional)
  height?: number
  fileId?: string       // For variant fetching (optional)
  variants?: {          // Pre-loaded variants (optional)
    thumb?: { url: string; width: number; height: number }
    sm?: { url: string; width: number; height: number }
    md?: { url: string; width: number; height: number }
    lg?: { url: string; width: number; height: number }
    original?: { url: string; width: number; height: number }
  }
}
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Escape` | Close viewer |
| `←` / `→` | Previous / Next image |
| `+` / `=` | Zoom in |
| `-` | Zoom out |
| `0` | Reset zoom |

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Watch mode for development
npm run dev

# Type check
npm run type-check
```

## License

MIT

