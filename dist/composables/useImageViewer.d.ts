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
import { type Ref, type DeepReadonly } from 'vue';
/** A single variant with URL and dimensions */
export interface ImageVariant {
    url: string;
    width: number;
    height: number;
}
/** Available image variants for quality selection */
export interface ImageVariants {
    thumb?: ImageVariant;
    sm?: ImageVariant;
    md?: ImageVariant;
    lg?: ImageVariant;
    original?: ImageVariant;
}
/** An image that can be displayed in the viewer */
export interface ViewerImage {
    /** Primary URL to display */
    url: string;
    /** Thumbnail URL for gallery strip */
    thumbnail?: string;
    /** Alt text for accessibility */
    alt?: string;
    /** Original dimensions */
    width?: number;
    height?: number;
    /** Optional file ID for custom variant fetching */
    fileId?: string;
    /** Pre-loaded variants for quality selection */
    variants?: ImageVariants;
}
/**
 * Function signature for fetching image variants
 * Allows consuming projects to plug in their own API
 */
export type FetchVariantsFn = (fileId: string) => Promise<ImageVariants | null>;
export declare function useImageViewer(): {
    isOpen: DeepReadonly<Ref<boolean>>;
    images: DeepReadonly<Ref<ViewerImage[]>>;
    initialIndex: DeepReadonly<Ref<number>>;
    openViewer: (newImages: ViewerImage[], startIndex?: number) => void;
    closeViewer: () => void;
    openImage: (url: string, alt?: string) => void;
    setVariantFetcher: (fn: FetchVariantsFn | null) => void;
    getVariantFetcher: () => FetchVariantsFn | null;
    _setOpen: (value: boolean) => void;
};
