# nonspace-ui

Shared Vue 3 UI components for [nonspace](https://github.com/slug23/nonspace) and [scoutship](https://github.com/slug23/scoutship) projects.

## Components

- **ImageViewer** - Full-featured image lightbox with zoom, pan, keyboard navigation
- **AvatarUpload** - Profile avatar upload with drag & drop, preview, and progress

---

## ImageViewer

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
cd ~/code/nonspace  # or ~/code/scoutship
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

## Keyboard Shortcuts (ImageViewer)

| Key | Action |
|-----|--------|
| `Escape` | Close viewer |
| `←` / `→` | Previous / Next image |
| `+` / `=` | Zoom in |
| `-` | Zoom out |
| `0` | Reset zoom |

---

## AvatarUpload

A complete avatar upload component with:
- Circular/rounded/square avatar display
- Click or drag & drop to upload
- Live preview before upload
- Upload progress ring
- Automatic use of "avatar" processing profile
- v-model support for the avatar URL

### Setup (once, at app initialization)

```ts
import { configureAvatarUpload } from 'nonspace-ui'

// Configure with your API details
configureAvatarUpload({
  uploadUrl: 'https://api.yoursite.com/v1/upload',
  apiKey: 'your-api-key',        // or use headers for auth
  projectId: 'your-project-id',
  profile: 'avatar',             // uses the avatar processing profile
})
```

### Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AvatarUpload } from 'nonspace-ui'

const avatarUrl = ref<string | null>(null)

function onAvatarUpdated(result) {
  console.log('Avatar uploaded:', result)
  // result contains: { id, url, variants }
}
</script>

<template>
  <AvatarUpload
    v-model="avatarUrl"
    :size="120"
    placeholder="JD"
    shape="circle"
    @upload-success="onAvatarUpdated"
  />
</template>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| null` | - | Current avatar URL |
| `size` | `number` | `120` | Size in pixels |
| `editable` | `boolean` | `true` | Allow upload |
| `placeholder` | `string` | - | Text when no avatar (e.g., initials) |
| `shape` | `'circle' \| 'rounded' \| 'square'` | `'circle'` | Avatar shape |
| `showProgress` | `boolean` | `true` | Show progress ring during upload |
| `config` | `Partial<AvatarUploadConfig>` | - | Override upload config |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted with new URL after upload |
| `upload-start` | `File` | Upload has started |
| `upload-progress` | `number` | Progress (0-100) |
| `upload-success` | `AvatarUploadResult` | Upload completed successfully |
| `upload-error` | `{ message, code? }` | Upload failed |
| `file-selected` | `File` | File was selected |

### Using with Composable

For more control, use the composable directly:

```ts
import { useAvatarUpload } from 'nonspace-ui'

const {
  uploading,
  progress,
  error,
  previewUrl,
  selectFile,
  upload,
  clearSelection,
} = useAvatarUpload({
  uploadUrl: '/api/v1/upload',
  profile: 'avatar',
})

// Handle file input
function handleFile(file: File) {
  selectFile(file)
  upload().then(result => {
    if (result) {
      console.log('Uploaded:', result.url)
    }
  })
}
```

### AvatarUploadConfig

```ts
interface AvatarUploadConfig {
  uploadUrl: string                    // API endpoint
  apiKey?: string                      // Bearer token
  headers?: Record<string, string>     // Custom headers
  projectId?: string                   // Project to upload to
  profile?: string                     // Processing profile (default: 'avatar')
  maxFileSize?: number                 // Max size in bytes (default: 10MB)
  acceptedTypes?: string[]             // Accepted MIME types
}
```

---

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

