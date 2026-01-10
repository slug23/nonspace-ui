import { type CropperConfig, type AvatarCrop } from '../composables/useAvatarCropper';
type __VLS_Props = {
    /** File to crop */
    file?: File | null;
    /** URL to crop (alternative to file) */
    url?: string | null;
    /** Shape of the crop area */
    shape?: 'circle' | 'square' | 'rounded';
    /** Size of the crop preview in pixels */
    cropSize?: number;
    /** Output size for exported image */
    outputSize?: number;
    /** Show the zoom slider */
    showZoomSlider?: boolean;
    /** Show reset button */
    showReset?: boolean;
    /** Primary action label */
    confirmLabel?: string;
    /** Cancel action label */
    cancelLabel?: string;
    /** Additional cropper config */
    config?: CropperConfig;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    cancel: () => any;
    confirm: (data: {
        file: File;
        crop: AvatarCrop;
    }) => any;
    "crop-change": (crop: AvatarCrop) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onCancel?: (() => any) | undefined;
    onConfirm?: ((data: {
        file: File;
        crop: AvatarCrop;
    }) => any) | undefined;
    "onCrop-change"?: ((crop: AvatarCrop) => any) | undefined;
}>, {
    shape: "circle" | "square" | "rounded";
    cropSize: number;
    outputSize: number;
    showZoomSlider: boolean;
    showReset: boolean;
    confirmLabel: string;
    cancelLabel: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
