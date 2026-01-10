import { type Ref } from 'vue';
import type { AvatarCrop } from './useAvatarManager';
export interface AvatarUploadConfig {
    /** API endpoint for uploading (e.g., '/api/v1/upload') */
    uploadUrl: string;
    /** API key or auth token for authentication */
    apiKey?: string;
    /** Custom headers to include in upload request */
    headers?: Record<string, string>;
    /** Project ID to upload to */
    projectId?: string;
    /** Processing profile to use (default: 'avatar') */
    profile?: string;
    /** Max file size in bytes (default: 10MB) */
    maxFileSize?: number;
    /** Accepted file types (default: image/jpeg, image/png, image/webp, image/heic) */
    acceptedTypes?: string[];
}
export interface AvatarUploadResult {
    id: string;
    url: string;
    variants: Record<string, {
        url: string;
        w: number;
        h: number;
    }>;
}
export interface AvatarUploadError {
    message: string;
    code?: string;
}
/**
 * Configure avatar upload globally
 * Call this once at app initialization
 */
export declare function configureAvatarUpload(config: Partial<AvatarUploadConfig>): void;
/**
 * Composable for avatar upload functionality
 */
export declare function useAvatarUpload(localConfig?: Partial<AvatarUploadConfig>): {
    uploading: Ref<boolean, boolean>;
    progress: Ref<number, number>;
    error: Ref<{
        message: string;
        code?: string | undefined;
    } | null, AvatarUploadError | {
        message: string;
        code?: string | undefined;
    } | null>;
    previewUrl: Ref<string | null, string | null>;
    selectedFile: Ref<{
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
    config: import("vue").ComputedRef<AvatarUploadConfig>;
    validateFile: (file: File) => AvatarUploadError | null;
    selectFile: (file: File) => AvatarUploadError | null;
    clearSelection: () => void;
    upload: () => Promise<AvatarUploadResult | null>;
    selectAndUpload: (file: File) => Promise<AvatarUploadResult | null>;
    uploadWithCrop: (crop: AvatarCrop) => Promise<AvatarUploadResult | null>;
};
export type { Ref };
