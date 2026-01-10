import { type Avatar, type AvatarManagerConfig, type AvatarCrop } from '../composables/useAvatarManager';
type __VLS_Props = {
    /** Current user's initials for fallback */
    initials?: string;
    /** Maximum number of avatars allowed */
    maxAvatars?: number;
    /** Show upload button */
    allowUpload?: boolean;
    /** Show delete buttons */
    allowDelete?: boolean;
    /** Allow editing/cropping avatars */
    allowEdit?: boolean;
    /** Enable crop UI when uploading */
    enableCropOnUpload?: boolean;
    /** Avatar grid size (compact mode) */
    avatarSize?: number;
    /** Shape of avatars */
    shape?: 'circle' | 'square' | 'rounded';
    /** Display mode: 'compact' (grid) or 'expanded' (list with details) */
    mode?: 'compact' | 'expanded';
    /** Crop preview size */
    cropSize?: number;
    /** Local config overrides */
    config?: Partial<AvatarManagerConfig>;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    delete: (avatar: Avatar) => any;
    select: (avatar: Avatar) => any;
    "upload-success": (avatar: Avatar) => any;
    "upload-error": (error: string) => any;
    "primary-changed": (avatar: Avatar) => any;
    "crop-updated": (avatar: Avatar, crop: AvatarCrop) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onDelete?: ((avatar: Avatar) => any) | undefined;
    onSelect?: ((avatar: Avatar) => any) | undefined;
    "onUpload-success"?: ((avatar: Avatar) => any) | undefined;
    "onUpload-error"?: ((error: string) => any) | undefined;
    "onPrimary-changed"?: ((avatar: Avatar) => any) | undefined;
    "onCrop-updated"?: ((avatar: Avatar, crop: AvatarCrop) => any) | undefined;
}>, {
    mode: "compact" | "expanded";
    initials: string;
    shape: "circle" | "square" | "rounded";
    cropSize: number;
    maxAvatars: number;
    allowUpload: boolean;
    allowDelete: boolean;
    allowEdit: boolean;
    enableCropOnUpload: boolean;
    avatarSize: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
