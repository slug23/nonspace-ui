<script setup lang="ts">
/**
 * EmojiPicker - A fully customizable emoji/sticker picker
 * 
 * Features:
 * - Search with instant filtering
 * - Category tabs with clear visual distinction
 * - User favorites section
 * - Support for custom items (SVGs, stickers, etc.)
 * - Keyboard navigation
 * - Fully styleable
 * 
 * Usage:
 *   <EmojiPicker
 *     :favorites="userFavorites"
 *     @select="handleSelect"
 *     @favorite="saveFavorite"
 *   />
 */

import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useEmojiPicker, type EmojiItem, type EmojiCategory, type EmojiPickerConfig } from '../composables/useEmojiPicker'

const props = withDefaults(defineProps<{
  /** User's favorite emoji IDs */
  favorites?: string[]
  /** Custom items to include */
  customItems?: EmojiItem[]
  /** Custom categories (optional - uses defaults if not provided) */
  categories?: EmojiCategory[]
  /** Number of columns in the grid */
  columns?: number
  /** Maximum favorites to show */
  maxFavorites?: number
  /** Placeholder text for search */
  searchPlaceholder?: string
  /** API endpoint for server-side emoji search (e.g., '/api/emoji/search') */
  searchEndpoint?: string
}>(), {
  favorites: () => [],
  customItems: () => [],
  columns: 8,
  maxFavorites: 16,
  searchPlaceholder: 'Search emoji...',
  searchEndpoint: undefined,
})

const emit = defineEmits<{
  /** Emitted when an item is selected */
  select: [item: EmojiItem]
  /** Emitted to save an item to favorites */
  favorite: [itemId: string]
}>()

// Create picker config from props
const pickerConfig: EmojiPickerConfig = {
  searchEndpoint: props.searchEndpoint,
  categories: props.categories,
  customItems: props.customItems,
  getFavorites: () => props.favorites,
  saveFavorite: (id) => emit('favorite', id),
  maxFavorites: props.maxFavorites,
  columns: props.columns,
}

const {
  searchQuery,
  activeCategory,
  categories,
  displayItems,
  favorites,
  isSearching,
  setCategory,
  setSearch,
  selectItem,
} = useEmojiPicker(pickerConfig)

// Refs
const searchInputRef = ref<HTMLInputElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)

// Focus search on mount
onMounted(() => {
  nextTick(() => {
    searchInputRef.value?.focus()
  })
})

// Handle item click
function handleItemClick(item: EmojiItem) {
  const selected = selectItem(item)
  emit('select', selected)
}

// Handle search input
function handleSearchInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  setSearch(value)
}

// Handle category tab click
function handleCategoryClick(categoryId: string) {
  setCategory(categoryId)
}

// Keyboard navigation
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    searchInputRef.value?.blur()
  }
}

// Grid style based on columns
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
}))
</script>

<template>
  <div class="nui-emoji-picker" @keydown="handleKeydown">
    <!-- Search bar -->
    <div class="nui-picker-search">
      <input
        ref="searchInputRef"
        type="text"
        :value="searchQuery"
        :placeholder="searchPlaceholder"
        class="nui-picker-search-input"
        @input="handleSearchInput"
      />
      <svg class="nui-picker-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
    </div>
    
    <!-- Category tabs -->
    <div class="nui-picker-categories">
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="nui-picker-category-tab"
        :class="{ active: activeCategory === cat.id }"
        :title="cat.name"
        @click="handleCategoryClick(cat.id)"
      >
        <span class="nui-category-icon">{{ cat.icon }}</span>
      </button>
    </div>
    
    <!-- Emoji grid -->
    <div ref="gridRef" class="nui-picker-grid-container">
      <div v-if="isSearching" class="nui-picker-loading">
        <span class="nui-loading-spinner"></span>
        <span>Searching...</span>
      </div>
      <div v-else-if="displayItems.length === 0" class="nui-picker-empty">
        <span v-if="searchQuery">No results for "{{ searchQuery }}"</span>
        <span v-else-if="activeCategory === 'favorites'">No favorites yet</span>
        <span v-else>No items</span>
      </div>
      
      <div v-else class="nui-picker-grid" :style="gridStyle">
        <button
          v-for="item in displayItems"
          :key="item.id"
          class="nui-picker-item"
          :class="{ 'is-custom': item.type !== 'emoji' }"
          :title="item.keywords?.[0] || item.value"
          @click="handleItemClick(item)"
        >
          <!-- Emoji -->
          <span v-if="item.type === 'emoji'" class="nui-item-emoji">
            {{ item.value }}
          </span>
          
          <!-- Custom image/sticker -->
          <img
            v-else-if="item.url"
            :src="item.url"
            :alt="item.value"
            class="nui-item-image"
          />
          
          <!-- Fallback -->
          <span v-else class="nui-item-fallback">{{ item.value }}</span>
        </button>
      </div>
    </div>
    
    <!-- Favorites bar (always visible at bottom if has favorites) -->
    <div v-if="favorites.length > 0" class="nui-picker-favorites">
      <div class="nui-favorites-label">⭐ Favorites</div>
      <div class="nui-favorites-grid">
        <button
          v-for="item in favorites"
          :key="'fav-' + item.id"
          class="nui-picker-item nui-favorite-item"
          :title="item.value"
          @click="handleItemClick(item)"
        >
          <span v-if="item.type === 'emoji'" class="nui-item-emoji">
            {{ item.value }}
          </span>
          <img v-else-if="item.url" :src="item.url" :alt="item.value" class="nui-item-image" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nui-emoji-picker {
  display: flex;
  flex-direction: column;
  width: 360px;
  max-height: 420px;
  background: var(--nui-picker-bg, #1a1a2e);
  border: 1px solid var(--nui-picker-border, #333);
  border-radius: 12px;
  overflow: hidden;
  font-family: system-ui, -apple-system, sans-serif;
}

/* Search bar */
.nui-picker-search {
  position: relative;
  padding: 10px 12px;
  background: var(--nui-picker-header-bg, #151525);
  border-bottom: 1px solid var(--nui-picker-border, #333);
}

.nui-picker-search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  background: var(--nui-picker-input-bg, #252540);
  border: 1px solid var(--nui-picker-border, #333);
  border-radius: 8px;
  color: var(--nui-picker-text, #e0e0e0);
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.nui-picker-search-input:focus {
  border-color: var(--nui-picker-accent, #6366f1);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.nui-picker-search-input::placeholder {
  color: var(--nui-picker-text-muted, #666);
}

.nui-picker-search-icon {
  position: absolute;
  left: 22px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--nui-picker-text-muted, #666);
  pointer-events: none;
}

/* Category tabs */
.nui-picker-categories {
  display: flex;
  padding: 6px 8px;
  gap: 2px;
  background: var(--nui-picker-tabs-bg, #1e1e35);
  border-bottom: 1px solid var(--nui-picker-border, #333);
  overflow-x: auto;
  scrollbar-width: none;
}

.nui-picker-categories::-webkit-scrollbar {
  display: none;
}

.nui-picker-category-tab {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 32px;
  padding: 0;
  background: var(--nui-picker-tab-bg, transparent);
  border: 1px solid transparent;
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  transition: all 0.15s ease;
}

.nui-picker-category-tab:hover {
  background: var(--nui-picker-tab-hover, #2a2a4a);
}

.nui-picker-category-tab.active {
  background: var(--nui-picker-tab-active, #2d2d50);
  border-color: var(--nui-picker-border, #333);
  border-bottom-color: var(--nui-picker-tab-active, #2d2d50);
  position: relative;
}

.nui-picker-category-tab.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--nui-picker-accent, #6366f1);
  border-radius: 2px 2px 0 0;
}

.nui-category-icon {
  font-size: 18px;
  line-height: 1;
}

/* Grid container */
.nui-picker-grid-container {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  min-height: 180px;
  max-height: 260px;
}

.nui-picker-grid {
  display: grid;
  gap: 2px;
}

.nui-picker-empty,
.nui-picker-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100%;
  min-height: 100px;
  color: var(--nui-picker-text-muted, #666);
  font-size: 13px;
}

.nui-loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--nui-picker-border, #333);
  border-top-color: var(--nui-picker-accent, #6366f1);
  border-radius: 50%;
  animation: nui-spin 0.6s linear infinite;
}

@keyframes nui-spin {
  to { transform: rotate(360deg); }
}

/* Grid items */
.nui-picker-item {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.1s ease;
}

.nui-picker-item:hover {
  background: var(--nui-picker-item-hover, #2a2a4a);
  transform: scale(1.15);
}

.nui-picker-item:active {
  transform: scale(1.05);
}

.nui-item-emoji {
  font-size: 24px;
  line-height: 1;
}

.nui-item-image {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.nui-item-fallback {
  font-size: 12px;
  color: var(--nui-picker-text-muted, #666);
}

/* Favorites bar */
.nui-picker-favorites {
  padding: 8px 10px;
  background: var(--nui-picker-favorites-bg, #151525);
  border-top: 1px solid var(--nui-picker-border, #333);
}

.nui-favorites-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--nui-picker-text-muted, #888);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nui-favorites-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.nui-favorite-item {
  width: 32px;
  height: 32px;
}

.nui-favorite-item .nui-item-emoji {
  font-size: 20px;
}
</style>


