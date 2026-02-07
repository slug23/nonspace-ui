import { ref, computed, type Ref } from 'vue'
import type { AvatarCrop } from './useAvatarManager'

export interface AvatarUploadConfig {
  /** API endpoint for uploading (e.g., '/api/v1/upload') */
  uploadUrl: string
  /** API key or auth token for authentication */
  apiKey?: string
  /** Custom headers to include in upload request */
  headers?: Record<string, string>
  /** Project ID to upload to */
  projectId?: string
  /** Processing profile to use (default: 'avatar') */
  profile?: string
  /** Max file size in bytes (default: 10MB) */
  maxFileSize?: number
  /** Accepted file types (default: image/jpeg, image/png, image/webp, image/heic) */
  acceptedTypes?: string[]
}

export interface AvatarUploadResult {
  id: string
  url: string
  variants: Record<string, { url: string; w: number; h: number }>
}

export interface AvatarUploadError {
  message: string
  code?: string
}

// Global configuration
const globalConfig = ref<Partial<AvatarUploadConfig>>({})

/**
 * Configure avatar upload globally
 * Call this once at app initialization
 */
export function configureAvatarUpload(config: Partial<AvatarUploadConfig>) {
  globalConfig.value = { ...globalConfig.value, ...config }
}

/**
 * Composable for avatar upload functionality
 */
export function useAvatarUpload(localConfig?: Partial<AvatarUploadConfig>) {
  const uploading = ref(false)
  const progress = ref(0)
  const error = ref<AvatarUploadError | null>(null)
  const previewUrl = ref<string | null>(null)
  const selectedFile = ref<File | null>(null)
  
  // Merge global and local config
  const config = computed<AvatarUploadConfig>(() => ({
    uploadUrl: '/api/v1/upload',
    profile: 'avatar',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
    ...globalConfig.value,
    ...localConfig,
  }))

  /**
   * Validate a file before upload
   */
  function validateFile(file: File): AvatarUploadError | null {
    if (!config.value.acceptedTypes?.some(type => file.type === type || file.type.startsWith(type.replace('/*', '/')))) {
      return { 
        message: 'Invalid file type. Please select a JPEG, PNG, WebP, or HEIC image.',
        code: 'INVALID_TYPE'
      }
    }
    
    if (config.value.maxFileSize && file.size > config.value.maxFileSize) {
      const maxMB = Math.round(config.value.maxFileSize / (1024 * 1024))
      return {
        message: `File too large. Maximum size is ${maxMB}MB.`,
        code: 'FILE_TOO_LARGE'
      }
    }
    
    return null
  }

  /**
   * Select a file and create preview
   */
  function selectFile(file: File): AvatarUploadError | null {
    const validationError = validateFile(file)
    if (validationError) {
      error.value = validationError
      return validationError
    }
    
    // Revoke previous preview URL to avoid memory leak
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }
    
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
    error.value = null
    
    return null
  }

  /**
   * Clear the current selection
   */
  function clearSelection() {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }
    selectedFile.value = null
    previewUrl.value = null
    error.value = null
    progress.value = 0
  }

  /**
   * Upload the selected file
   */
  async function upload(): Promise<AvatarUploadResult | null> {
    if (!selectedFile.value) {
      error.value = { message: 'No file selected', code: 'NO_FILE' }
      return null
    }
    
    uploading.value = true
    progress.value = 0
    error.value = null
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile.value)
      formData.append('profile', config.value.profile || 'avatar')
      
      if (config.value.projectId) {
        formData.append('project_id', config.value.projectId)
      }
      
      // Build headers
      const headers: Record<string, string> = {}
      
      if (config.value.apiKey) {
        headers['Authorization'] = `Bearer ${config.value.apiKey}`
      }
      
      if (config.value.headers) {
        Object.assign(headers, config.value.headers)
      }
      
      // Use XMLHttpRequest for progress tracking
      const result = await new Promise<AvatarUploadResult>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            progress.value = Math.round((e.loaded / e.total) * 100)
          }
        })
        
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText)
              // Handle API response format (may have data wrapper)
              const data = response.data || response
              resolve({
                id: data.id,
                url: data.url || data.signed_url,
                variants: data.variants || {}
              })
            } catch {
              reject({ message: 'Invalid response from server', code: 'PARSE_ERROR' })
            }
          } else {
            let errorMessage = 'Upload failed'
            try {
              const response = JSON.parse(xhr.responseText)
              errorMessage = response.error || response.message || errorMessage
            } catch {}
            reject({ message: errorMessage, code: `HTTP_${xhr.status}` })
          }
        })
        
        xhr.addEventListener('error', () => {
          reject({ message: 'Network error during upload', code: 'NETWORK_ERROR' })
        })
        
        xhr.addEventListener('abort', () => {
          reject({ message: 'Upload cancelled', code: 'ABORTED' })
        })
        
        xhr.open('POST', config.value.uploadUrl)
        
        for (const [key, value] of Object.entries(headers)) {
          xhr.setRequestHeader(key, value)
        }
        
        xhr.send(formData)
      })
      
      progress.value = 100
      return result
      
    } catch (e: any) {
      error.value = e as AvatarUploadError
      return null
    } finally {
      uploading.value = false
    }
  }

  /**
   * Select and immediately upload a file
   */
  async function selectAndUpload(file: File): Promise<AvatarUploadResult | null> {
    const validationError = selectFile(file)
    if (validationError) {
      return null
    }
    return upload()
  }

  /**
   * Upload the selected file with crop metadata
   * The crop data is sent to the server so it can be stored/applied server-side
   */
  async function uploadWithCrop(crop: AvatarCrop): Promise<AvatarUploadResult | null> {
    if (!selectedFile.value) {
      error.value = { message: 'No file selected', code: 'NO_FILE' }
      return null
    }
    
    uploading.value = true
    progress.value = 0
    error.value = null
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile.value)
      formData.append('profile', config.value.profile || 'avatar')
      
      // Include crop metadata
      formData.append('crop_x', String(crop.x))
      formData.append('crop_y', String(crop.y))
      formData.append('crop_width', String(crop.width))
      formData.append('crop_height', String(crop.height))
      if (crop.zoom !== undefined) {
        formData.append('crop_zoom', String(crop.zoom))
      }
      
      if (config.value.projectId) {
        formData.append('project_id', config.value.projectId)
      }
      
      // Build headers
      const headers: Record<string, string> = {}
      
      if (config.value.apiKey) {
        headers['Authorization'] = `Bearer ${config.value.apiKey}`
      }
      
      if (config.value.headers) {
        Object.assign(headers, config.value.headers)
      }
      
      // Use XMLHttpRequest for progress tracking
      const result = await new Promise<AvatarUploadResult>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            progress.value = Math.round((e.loaded / e.total) * 100)
          }
        })
        
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText)
              // Handle API response format (may have data wrapper)
              const data = response.data || response
              resolve({
                id: data.id,
                url: data.url || data.signed_url,
                variants: data.variants || {}
              })
            } catch {
              reject({ message: 'Invalid response from server', code: 'PARSE_ERROR' })
            }
          } else {
            let errorMessage = 'Upload failed'
            try {
              const response = JSON.parse(xhr.responseText)
              errorMessage = response.error || response.message || errorMessage
            } catch {}
            reject({ message: errorMessage, code: `HTTP_${xhr.status}` })
          }
        })
        
        xhr.addEventListener('error', () => {
          reject({ message: 'Network error during upload', code: 'NETWORK_ERROR' })
        })
        
        xhr.addEventListener('abort', () => {
          reject({ message: 'Upload cancelled', code: 'ABORTED' })
        })
        
        xhr.open('POST', config.value.uploadUrl)
        
        for (const [key, value] of Object.entries(headers)) {
          xhr.setRequestHeader(key, value)
        }
        
        xhr.send(formData)
      })
      
      progress.value = 100
      return result
      
    } catch (e: any) {
      error.value = e as AvatarUploadError
      return null
    } finally {
      uploading.value = false
    }
  }

  return {
    // State
    uploading,
    progress,
    error,
    previewUrl,
    selectedFile,
    config,
    
    // Methods
    validateFile,
    selectFile,
    clearSelection,
    upload,
    selectAndUpload,
    uploadWithCrop,
  }
}

export type { Ref }






