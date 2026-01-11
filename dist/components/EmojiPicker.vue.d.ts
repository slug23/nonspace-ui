import { type EmojiItem, type EmojiCategory } from '../composables/useEmojiPicker';
type __VLS_Props = {
    /** User's favorite emoji IDs */
    favorites?: string[];
    /** Custom items to include */
    customItems?: EmojiItem[];
    /** Custom categories (optional - uses defaults if not provided) */
    categories?: EmojiCategory[];
    /** Number of columns in the grid */
    columns?: number;
    /** Maximum favorites to show */
    maxFavorites?: number;
    /** Placeholder text for search */
    searchPlaceholder?: string;
    /** API endpoint for server-side emoji search (e.g., '/api/emoji/search') */
    searchEndpoint?: string;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    select: (item: EmojiItem) => any;
    favorite: (itemId: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSelect?: ((item: EmojiItem) => any) | undefined;
    onFavorite?: ((itemId: string) => any) | undefined;
}>, {
    favorites: string[];
    searchEndpoint: string;
    customItems: EmojiItem[];
    maxFavorites: number;
    columns: number;
    searchPlaceholder: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
