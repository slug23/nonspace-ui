import type { ViewerImage } from '../composables/useImageViewer';
type __VLS_Props = {
    images: ViewerImage[];
    initialIndex?: number;
    open: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: () => any;
    indexChange: (index: number) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onClose?: (() => any) | undefined;
    onIndexChange?: ((index: number) => any) | undefined;
}>, {
    initialIndex: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
