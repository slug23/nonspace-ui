import { type AvatarUploadConfig, type AvatarUploadResult } from '../composables/useAvatarUpload';
import type { AvatarCrop } from '../composables/useAvatarManager';
export interface AvatarUploadProps {
    /** Current avatar URL to display */
    modelValue?: string | null;
    /** Size of the avatar in pixels (default: 120) */
    size?: number;
    /** Upload configuration */
    config?: Partial<AvatarUploadConfig>;
    /** Whether the avatar is editable (default: true) */
    editable?: boolean;
    /** Placeholder text when no avatar (default: initials or icon) */
    placeholder?: string;
    /** Shape: 'circle' | 'rounded' | 'square' */
    shape?: 'circle' | 'rounded' | 'square';
    /** Show upload progress ring */
    showProgress?: boolean;
    /** Custom CSS classes for the container */
    containerClass?: string;
    /** Enable crop UI before upload (default: false) */
    enableCrop?: boolean;
    /** Crop area size in pixels (default: 280) */
    cropSize?: number;
    /** Output size for cropped image (default: 512) */
    cropOutputSize?: number;
}
declare const _default: import("vue").DefineComponent<AvatarUploadProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:modelValue": (value: string) => any;
    "upload-start": (file: File) => any;
    "upload-progress": (progress: number) => any;
    "upload-success": (result: AvatarUploadResult & {
        crop?: AvatarCrop;
    }) => any;
    "upload-error": (error: {
        message: string;
        code?: string;
    }) => any;
    "file-selected": (file: File) => any;
    "crop-applied": (data: {
        file: File;
        crop: AvatarCrop;
    }) => any;
}, string, import("vue").PublicProps, Readonly<AvatarUploadProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    "onUpload-start"?: ((file: File) => any) | undefined;
    "onUpload-progress"?: ((progress: number) => any) | undefined;
    "onUpload-success"?: ((result: AvatarUploadResult & {
        crop?: AvatarCrop;
    }) => any) | undefined;
    "onUpload-error"?: ((error: {
        message: string;
        code?: string;
    }) => any) | undefined;
    "onFile-selected"?: ((file: File) => any) | undefined;
    "onCrop-applied"?: ((data: {
        file: File;
        crop: AvatarCrop;
    }) => any) | undefined;
}>, {
    size: number;
    shape: "circle" | "rounded" | "square";
    cropSize: number;
    editable: boolean;
    showProgress: boolean;
    enableCrop: boolean;
    cropOutputSize: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
