import { ref, computed, type Ref } from 'vue'

export interface AvatarVariant {
  url: string
  w: number
  h: number
}

export interface AvatarVariants {
  /** ~1000px WebP for cropping/editing (browser-compatible) */
  source?: AvatarVariant
  sm?: AvatarVariant
  md?: AvatarVariant
  lg?: AvatarVariant
}

export interface AvatarCrop {
  x: number
  y: number
  width: number
  height: number
  zoom?: number
}

export interface AvatarFallback {
  type: 'initials' | 'default' | 'gravatar' | 'none'
  initials?: string
  background_color?: string
  url?: string
}

export interface Avatar {
  id: string
  name?: string
  is_primary: boolean
  source: 'upload' | 'gravatar' | 'oauth' | 'generated' | 'ai'
  original_url: string
  variants: AvatarVariants
  format: 'static' | 'animated'
  animated_url?: string
  crop?: AvatarCrop
  blurhash?: string
  dominant_color?: string
  alt_text?: string
  moderation_status: 'pending' | 'approved' | 'rejected'
  fallback: AvatarFallback
  created_at: string
  updated_at: string
}

export interface AvatarManagerConfig {
  /** Base API URL (e.g., '/api' or 'https://api.example.com') */
  apiBaseUrl: string
  /** Function to get auth headers */
  getHeaders: () => Record<string, string>
  /** Upload endpoint for new avatars */
  uploadUrl?: string
  /** Media proxy URL for loading external images (to bypass CORS) */
  mediaProxyUrl?: string
  /** Project ID for project-managed avatars */
  projectId?: string
  /** Entity type for project-managed avatars */
  entityType?: string
  /** Entity ID for project-managed avatars */
  entityId?: string
}

// Global configuration
const globalConfig = ref<Partial<AvatarManagerConfig>>({})

/**
 * Configure avatar manager globally
 */
export function configureAvatarManager(config: Partial<AvatarManagerConfig>) {
  globalConfig.value = { ...globalConfig.value, ...config }
}

/**
 * Composable for managing multiple avatars
 */
export function useAvatarManager(localConfig?: Partial<AvatarManagerConfig>) {
  const avatars = ref<Avatar[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const uploading = ref(false)
  const uploadProgress = ref(0)

  const config = computed<AvatarManagerConfig>(() => ({
    apiBaseUrl: '/api',
    getHeaders: () => ({}),
    ...globalConfig.value,
    ...localConfig,
  }))

  const primaryAvatar = computed(() => avatars.value.find(a => a.is_primary))

  /**
   * Fetch all avatars
   */
  async function fetchAvatars(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      let url = `${config.value.apiBaseUrl}/avatars`
      const params = new URLSearchParams()
      
      if (config.value.projectId) {
        params.set('project_id', config.value.projectId)
      }
      if (config.value.entityType) {
        params.set('entity_type', config.value.entityType)
      }
      if (config.value.entityId) {
        params.set('entity_id', config.value.entityId)
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url, {
        headers: config.value.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      avatars.value = data.avatars || []
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch avatars'
    } finally {
      loading.value = false
    }
  }

  /**
   * Create a new avatar from an uploaded file result
   */
  async function createAvatar(data: {
    original_url: string
    file_id?: string
    name?: string
    is_primary?: boolean
    variants?: AvatarVariants
    blurhash?: string
    dominant_color?: string
    alt_text?: string
    fallback_initials?: string
  }): Promise<Avatar | null> {
    error.value = null

    try {
      const response = await fetch(`${config.value.apiBaseUrl}/avatars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.value.getHeaders(),
        },
        body: JSON.stringify({
          original_url: data.original_url,
          file_id: data.file_id,
          name: data.name,
          is_primary: data.is_primary ?? false,
          source: 'upload',
          format: 'static',
          variants: data.variants,
          blurhash: data.blurhash,
          dominant_color: data.dominant_color,
          alt_text: data.alt_text,
          fallback_type: data.fallback_initials ? 'initials' : 'default',
          fallback_data: data.fallback_initials ? { initials: data.fallback_initials } : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const avatar = await response.json()
      
      // Refresh list
      await fetchAvatars()
      
      return avatar
    } catch (e: any) {
      error.value = e.message || 'Failed to create avatar'
      return null
    }
  }

  /**
   * Set an avatar as primary
   */
  async function setPrimary(avatarId: string): Promise<boolean> {
    error.value = null

    try {
      const response = await fetch(`${config.value.apiBaseUrl}/avatars/${avatarId}/primary`, {
        method: 'POST',
        headers: config.value.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      // Update local state
      avatars.value = avatars.value.map(a => ({
        ...a,
        is_primary: a.id === avatarId,
      }))

      return true
    } catch (e: any) {
      error.value = e.message || 'Failed to set primary avatar'
      return false
    }
  }

  /**
   * Delete an avatar
   */
  async function deleteAvatar(avatarId: string): Promise<boolean> {
    error.value = null

    try {
      const response = await fetch(`${config.value.apiBaseUrl}/avatars/${avatarId}`, {
        method: 'DELETE',
        headers: config.value.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      // Remove from local state
      avatars.value = avatars.value.filter(a => a.id !== avatarId)

      return true
    } catch (e: any) {
      error.value = e.message || 'Failed to delete avatar'
      return false
    }
  }

  /**
   * Update an avatar
   */
  async function updateAvatar(avatarId: string, data: {
    name?: string
    crop?: AvatarCrop
    alt_text?: string
  }): Promise<Avatar | null> {
    error.value = null

    try {
      const response = await fetch(`${config.value.apiBaseUrl}/avatars/${avatarId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...config.value.getHeaders(),
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const updatedAvatar = await response.json()

      // Update local state
      avatars.value = avatars.value.map(a => 
        a.id === avatarId ? updatedAvatar : a
      )

      return updatedAvatar
    } catch (e: any) {
      error.value = e.message || 'Failed to update avatar'
      return null
    }
  }

  /**
   * Upload a file and create an avatar
   */
  async function uploadAndCreateAvatar(
    file: File,
    options?: {
      name?: string
      is_primary?: boolean
      fallback_initials?: string
      crop?: AvatarCrop
    }
  ): Promise<Avatar | null> {
    if (!config.value.uploadUrl) {
      error.value = 'Upload URL not configured'
      return null
    }

    uploading.value = true
    uploadProgress.value = 0
    error.value = null

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('profile', 'avatar')

      // Upload the file
      const uploadResult = await new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            uploadProgress.value = Math.round((e.loaded / e.total) * 100)
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText)
              resolve(response.data || response)
            } catch {
              reject(new Error('Invalid response from server'))
            }
          } else {
            let errorMessage = 'Upload failed'
            try {
              const response = JSON.parse(xhr.responseText)
              errorMessage = response.error || response.message || errorMessage
            } catch {}
            reject(new Error(errorMessage))
          }
        })

        xhr.addEventListener('error', () => reject(new Error('Network error')))
        xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')))

        xhr.open('POST', config.value.uploadUrl!)
        
        const headers = config.value.getHeaders()
        for (const [key, value] of Object.entries(headers)) {
          xhr.setRequestHeader(key, value)
        }

        xhr.send(formData)
      })

      uploadProgress.value = 100

      // Create the avatar record
      const avatar = await createAvatar({
        original_url: uploadResult.url || uploadResult.signed_url,
        file_id: uploadResult.id,
        name: options?.name,
        is_primary: options?.is_primary,
        variants: uploadResult.variants,
        fallback_initials: options?.fallback_initials,
      })

      return avatar
    } catch (e: any) {
      error.value = e.message || 'Failed to upload avatar'
      return null
    } finally {
      uploading.value = false
    }
  }

  /**
   * Get the best URL for an avatar at a given size
   * @param size - 'sm' | 'md' | 'lg' for display, 'source' for cropping/editing, 'original' for raw file
   */
  function getAvatarUrl(avatar: Avatar, size: 'sm' | 'md' | 'lg' | 'source' | 'original' = 'md'): string {
    if (size === 'original') {
      return avatar.original_url
    }
    
    if (size === 'source') {
      // For cropping: prefer source, then original
      return avatar.variants.source?.url || avatar.original_url
    }
    
    const variant = avatar.variants[size]
    if (variant) {
      return variant.url
    }

    // Fallback to other sizes
    if (size === 'sm') {
      return avatar.variants.md?.url || avatar.variants.lg?.url || avatar.original_url
    }
    if (size === 'md') {
      return avatar.variants.lg?.url || avatar.variants.sm?.url || avatar.original_url
    }
    if (size === 'lg') {
      return avatar.variants.md?.url || avatar.variants.sm?.url || avatar.original_url
    }

    return avatar.original_url
  }

  return {
    // State
    avatars,
    loading,
    error,
    uploading,
    uploadProgress,
    primaryAvatar,
    config,

    // Methods
    fetchAvatars,
    createAvatar,
    setPrimary,
    deleteAvatar,
    updateAvatar,
    uploadAndCreateAvatar,
    getAvatarUrl,
  }
}

