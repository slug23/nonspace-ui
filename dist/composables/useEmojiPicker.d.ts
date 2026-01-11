/**
 * useEmojiPicker - Composable for emoji picker functionality
 *
 * Features:
 * - Emoji data with categories
 * - Search functionality
 * - User favorites (stored externally via callback)
 * - Support for custom items (SVGs, stickers, etc.)
 */
export interface EmojiItem {
    /** The emoji character or unique ID for custom items */
    id: string;
    /** Display value - emoji character, or URL for custom items */
    value: string;
    /** Type of item */
    type: 'emoji' | 'custom' | 'sticker';
    /** Search keywords */
    keywords: string[];
    /** Category this item belongs to */
    category: string;
    /** Optional: URL for custom image/sticker */
    url?: string;
    /** Optional: Skin tone variants */
    skinTones?: string[];
}
export interface EmojiCategory {
    id: string;
    name: string;
    icon: string;
}
export interface EmojiPickerConfig {
    /** Categories to display (in order) */
    categories?: EmojiCategory[];
    /** Custom items to include */
    customItems?: EmojiItem[];
    /** Callback to get user favorites */
    getFavorites?: () => string[];
    /** Callback to save a favorite */
    saveFavorite?: (itemId: string) => void;
    /** Maximum favorites to show */
    maxFavorites?: number;
    /** Columns in the grid */
    columns?: number;
}
export interface EmojiPickerState {
    isOpen: boolean;
    searchQuery: string;
    activeCategory: string;
    selectedSkinTone: number;
}
export declare function useEmojiPicker(config?: EmojiPickerConfig): {
    isOpen: import("vue").Ref<boolean, boolean>;
    searchQuery: import("vue").Ref<string, string>;
    activeCategory: import("vue").Ref<string, string>;
    selectedSkinTone: import("vue").Ref<number, number>;
    categories: EmojiCategory[];
    allItems: import("vue").ComputedRef<EmojiItem[]>;
    favorites: import("vue").ComputedRef<EmojiItem[]>;
    displayItems: import("vue").ComputedRef<EmojiItem[]>;
    searchResults: import("vue").ComputedRef<EmojiItem[]>;
    columns: number;
    open: () => void;
    close: () => void;
    selectItem: (item: EmojiItem) => EmojiItem;
    setCategory: (categoryId: string) => void;
    setSearch: (query: string) => void;
};
