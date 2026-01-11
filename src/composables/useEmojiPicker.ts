/**
 * useEmojiPicker - Composable for emoji picker functionality
 * 
 * Features:
 * - Server-side search via API endpoint (recommended)
 * - Local fallback with embedded emoji data
 * - User favorites (stored externally via callback)
 * - Support for custom items (SVGs, stickers, etc.)
 */

import { ref, computed, shallowRef, watch } from 'vue'

// ============================================
// Types
// ============================================

export interface EmojiItem {
  /** The emoji character or unique ID for custom items */
  id: string
  /** Display value - emoji character, or URL for custom items */
  value: string
  /** Type of item */
  type: 'emoji' | 'custom' | 'sticker'
  /** Search keywords */
  keywords: string[]
  /** Category this item belongs to */
  category: string
  /** Optional: URL for custom image/sticker */
  url?: string
  /** Optional: Skin tone variants */
  skinTones?: string[]
}

export interface EmojiCategory {
  id: string
  name: string
  icon: string // Emoji or SVG for the tab
}

export interface EmojiPickerConfig {
  /** API endpoint for emoji search (e.g., '/api/emoji/search') */
  searchEndpoint?: string
  /** Categories to display (in order) */
  categories?: EmojiCategory[]
  /** Custom items to include */
  customItems?: EmojiItem[]
  /** Callback to get user favorites */
  getFavorites?: () => string[]
  /** Callback to save a favorite */
  saveFavorite?: (itemId: string) => void
  /** Maximum favorites to show */
  maxFavorites?: number
  /** Columns in the grid */
  columns?: number
  /** Debounce delay for search (ms) */
  searchDebounceMs?: number
}

export interface EmojiPickerState {
  isOpen: boolean
  searchQuery: string
  activeCategory: string
  selectedSkinTone: number
}

// ============================================
// Default Emoji Data (fallback when no API)
// ============================================

const DEFAULT_CATEGORIES: EmojiCategory[] = [
  { id: 'favorites', name: 'Favorites', icon: '⭐' },
  { id: 'smileys', name: 'Smileys', icon: '😀' },
  { id: 'people', name: 'People', icon: '👋' },
  { id: 'animals', name: 'Animals', icon: '🐶' },
  { id: 'food', name: 'Food', icon: '🍔' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'activities', name: 'Activities', icon: '⚽' },
  { id: 'objects', name: 'Objects', icon: '💡' },
  { id: 'symbols', name: 'Symbols', icon: '❤️' },
  { id: 'flags', name: 'Flags', icon: '🏳️' },
]

// Minimal embedded emoji data (used for category browsing and fallback search)
const FALLBACK_EMOJI_DATA: Record<string, string[]> = {
  smileys: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😍', '🥰', '😘', '😎', '🤔', '😴', '🥳'],
  people: ['👋', '👌', '✌️', '👍', '👎', '👏', '🙌', '🤝', '🙏', '💪', '🤘', '🖕'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐸', '🦁', '🐮', '🐷', '🐵', '🦄', '🐝', '🦋', '🐢', '🦈'],
  food: ['🍏', '🍎', '🍌', '🍕', '🍔', '🍟', '🌮', '🍣', '🍩', '🍪', '🎂', '🍺', '☕', '🍷'],
  travel: ['🚗', '✈️', '🚀', '🏠', '🏖️', '🌅', '🏔️', '🗽'],
  activities: ['⚽', '🏀', '🎾', '🎮', '🎬', '🎤', '🎸', '🎲'],
  objects: ['💡', '📱', '💻', '🔧', '💰', '🎁', '🔑', '📚'],
  symbols: ['❤️', '💔', '💯', '✅', '❌', '⚠️', '🔔', '💬'],
  flags: ['🏳️', '🏴', '🏁', '🚩', '🏳️‍🌈', '🇺🇸', '🇬🇧', '🇯🇵'],
}

// Build basic items from fallback data
function buildFallbackItems(): EmojiItem[] {
  const items: EmojiItem[] = []
  for (const [category, emojis] of Object.entries(FALLBACK_EMOJI_DATA)) {
    for (const emoji of emojis) {
      items.push({
        id: emoji,
        value: emoji,
        type: 'emoji',
        keywords: [emoji],
        category,
      })
    }
  }
  return items
}

// ============================================
// Composable
// ============================================

export function useEmojiPicker(config: EmojiPickerConfig = {}) {
  const {
    searchEndpoint,
    categories = DEFAULT_CATEGORIES,
    customItems = [],
    getFavorites = () => [],
    saveFavorite,
    maxFavorites = 16,
    columns = 8,
    searchDebounceMs = 150,
  } = config
  
  // State
  const isOpen = ref(false)
  const searchQuery = ref('')
  const activeCategory = ref(categories[0]?.id || 'smileys')
  const selectedSkinTone = ref(0)
  
  // Search state
  const isSearching = ref(false)
  const searchResults = shallowRef<EmojiItem[]>([])
  const searchError = ref<string | null>(null)
  
  // Fallback emoji data (for category browsing)
  const fallbackEmojis = shallowRef<EmojiItem[]>(buildFallbackItems())
  
  // Category items from API (cached per category)
  const categoryCache = new Map<string, EmojiItem[]>()
  const categoryItems = shallowRef<EmojiItem[]>([])
  
  // Combined items (fallback + custom)
  const allLocalItems = computed(() => [...fallbackEmojis.value, ...customItems])
  
  // Favorites from external source
  const favorites = computed(() => {
    const favIds = getFavorites()
    // Try to find in search results first, then category items, then fallback
    const allKnown = [...searchResults.value, ...categoryItems.value, ...allLocalItems.value]
    const seen = new Set<string>()
    const items: EmojiItem[] = []
    
    for (const id of favIds) {
      if (seen.has(id)) continue
      seen.add(id)
      
      // Find the item in known items, or create a basic one
      const found = allKnown.find(item => item.id === id)
      if (found) {
        items.push(found)
      } else {
        // Assume it's an emoji character
        items.push({
          id,
          value: id,
          type: 'emoji',
          keywords: [id],
          category: 'favorites',
        })
      }
    }
    
    return items.slice(0, maxFavorites)
  })
  
  // Debounce timer
  let searchTimer: ReturnType<typeof setTimeout> | null = null
  
  // Fetch search results from API
  async function fetchSearch(query: string): Promise<EmojiItem[]> {
    if (!searchEndpoint) {
      // Local fallback search
      const q = query.toLowerCase()
      return allLocalItems.value.filter(item => 
        item.value.includes(q) || 
        item.keywords.some(kw => kw.toLowerCase().includes(q))
      )
    }
    
    try {
      const url = `${searchEndpoint}?q=${encodeURIComponent(query)}&limit=50`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success && Array.isArray(data.results)) {
        return data.results.map((item: any) => ({
          id: item.id || item.value,
          value: item.value,
          type: item.type || 'emoji',
          keywords: item.keywords || [],
          category: item.category || 'search',
          url: item.url,
        }))
      }
      
      return []
    } catch (err) {
      searchError.value = err instanceof Error ? err.message : 'Search failed'
      console.error('[EmojiPicker] Search error:', err)
      return []
    }
  }
  
  // Fetch category items from API
  async function fetchCategory(categoryId: string): Promise<EmojiItem[]> {
    if (!searchEndpoint || categoryId === 'favorites') {
      // Use fallback data for category browsing
      return allLocalItems.value.filter(item => item.category === categoryId)
    }
    
    // Check cache
    if (categoryCache.has(categoryId)) {
      return categoryCache.get(categoryId)!
    }
    
    try {
      // Use empty search with a hint for category (API could support this)
      // For now, just return fallback data for category browsing
      const localItems = allLocalItems.value.filter(item => item.category === categoryId)
      categoryCache.set(categoryId, localItems)
      return localItems
    } catch (err) {
      console.error('[EmojiPicker] Category fetch error:', err)
      return allLocalItems.value.filter(item => item.category === categoryId)
    }
  }
  
  // Watch for search query changes
  watch(searchQuery, (query) => {
    // Clear previous timer
    if (searchTimer) {
      clearTimeout(searchTimer)
    }
    
    if (!query.trim()) {
      searchResults.value = []
      isSearching.value = false
      return
    }
    
    isSearching.value = true
    
    // Debounce the search
    searchTimer = setTimeout(async () => {
      const results = await fetchSearch(query)
      searchResults.value = results
      isSearching.value = false
    }, searchDebounceMs)
  })
  
  // Watch for category changes
  watch(activeCategory, async (categoryId) => {
    if (!searchQuery.value.trim()) {
      categoryItems.value = await fetchCategory(categoryId)
    }
  }, { immediate: true })
  
  // What to display in the grid
  const displayItems = computed(() => {
    if (searchQuery.value.trim()) {
      return searchResults.value
    }
    if (activeCategory.value === 'favorites') {
      return favorites.value
    }
    return categoryItems.value
  })
  
  // Actions
  function open() {
    isOpen.value = true
    searchQuery.value = ''
  }
  
  function close() {
    isOpen.value = false
  }
  
  function selectItem(item: EmojiItem) {
    // Save to favorites if callback provided
    if (saveFavorite) {
      saveFavorite(item.id)
    }
    return item
  }
  
  function setCategory(categoryId: string) {
    activeCategory.value = categoryId
    searchQuery.value = ''
  }
  
  function setSearch(query: string) {
    searchQuery.value = query
  }
  
  return {
    // State
    isOpen,
    searchQuery,
    activeCategory,
    selectedSkinTone,
    isSearching,
    searchError,
    
    // Data
    categories,
    allItems: allLocalItems,
    favorites,
    displayItems,
    searchResults,
    columns,
    
    // Actions
    open,
    close,
    selectItem,
    setCategory,
    setSearch,
  }
}
