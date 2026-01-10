import { type Ref } from 'vue';
import type { AvatarCrop } from './useAvatarManager';
export interface CropperState {
    /** Image element being cropped */
    image: HTMLImageElement | null;
    /** Natural width of the source image */
    naturalWidth: number;
    /** Natural height of the source image */
    naturalHeight: number;
    /** Current pan offset X (in image pixels) */
    panX: number;
    /** Current pan offset Y (in image pixels) */
    panY: number;
    /** Current zoom level (1 = fit, higher = zoomed in) */
    zoom: number;
    /** Minimum zoom to fill the crop area */
    minZoom: number;
    /** Maximum zoom level */
    maxZoom: number;
}
export interface CropperConfig {
    /** Shape of the crop area */
    shape?: 'circle' | 'square' | 'rounded';
    /** Size of the crop preview area in pixels */
    cropSize?: number;
    /** Output size for the cropped image */
    outputSize?: number;
    /** Maximum zoom multiplier */
    maxZoom?: number;
    /** Output format */
    format?: 'image/jpeg' | 'image/png' | 'image/webp';
    /** Output quality (0-1) for jpeg/webp */
    quality?: number;
}
/**
 * Composable for handling avatar image cropping
 */
export declare function useAvatarCropper(config?: CropperConfig): {
    state: Ref<{
        image: HTMLImageElement | null;
        naturalWidth: number;
        naturalHeight: number;
        panX: number;
        panY: number;
        zoom: number;
        minZoom: number;
        maxZoom: number;
    }, CropperState | {
        image: HTMLImageElement | null;
        naturalWidth: number;
        naturalHeight: number;
        panX: number;
        panY: number;
        zoom: number;
        minZoom: number;
        maxZoom: number;
    }>;
    loading: Ref<boolean, boolean>;
    error: Ref<string | null, string | null>;
    sourceFile: Ref<{
        readonly lastModified: number;
        readonly name: string;
        readonly webkitRelativePath: string;
        readonly size: number;
        readonly type: string;
        arrayBuffer: () => Promise<ArrayBuffer>;
        bytes: () => Promise<Uint8Array<ArrayBuffer>>;
        slice: (start?: number, end?: number, contentType?: string) => Blob;
        stream: () => ReadableStream<Uint8Array<ArrayBuffer>>;
        text: () => Promise<string>;
    } | null, File | {
        readonly lastModified: number;
        readonly name: string;
        readonly webkitRelativePath: string;
        readonly size: number;
        readonly type: string;
        arrayBuffer: () => Promise<ArrayBuffer>;
        bytes: () => Promise<Uint8Array<ArrayBuffer>>;
        slice: (start?: number, end?: number, contentType?: string) => Blob;
        stream: () => ReadableStream<Uint8Array<ArrayBuffer>>;
        text: () => Promise<string>;
    } | null>;
    sourceUrl: Ref<string | null, string | null>;
    cropRegion: import("vue").ComputedRef<AvatarCrop | null>;
    imageTransform: import("vue").ComputedRef<string>;
    config: import("vue").ComputedRef<{
        shape: "circle" | "square" | "rounded";
        cropSize: number;
        outputSize: number;
        maxZoom: number;
        format: "image/jpeg" | "image/png" | "image/webp";
        quality: number;
    }>;
    loadFile: (file: File) => Promise<boolean>;
    loadUrl: (url: string) => Promise<boolean>;
    setZoom: (newZoom: number) => void;
    pan: (deltaX: number, deltaY: number) => void;
    centerImage: () => void;
    reset: () => void;
    exportCrop: () => Promise<Blob | null>;
    exportCropAsFile: (filename?: string) => Promise<File | null>;
    cleanup: () => void;
};
export type { AvatarCrop };
