import { type Ref } from 'vue';
export interface AvatarVariant {
    url: string;
    w: number;
    h: number;
}
export interface AvatarVariants {
    /** ~1000px WebP for cropping/editing (browser-compatible) */
    source?: AvatarVariant;
    sm?: AvatarVariant;
    md?: AvatarVariant;
    lg?: AvatarVariant;
}
export interface AvatarCrop {
    x: number;
    y: number;
    width: number;
    height: number;
    zoom?: number;
}
export interface AvatarFallback {
    type: 'initials' | 'default' | 'gravatar' | 'none';
    initials?: string;
    background_color?: string;
    url?: string;
}
export interface Avatar {
    id: string;
    name?: string;
    is_primary: boolean;
    source: 'upload' | 'gravatar' | 'oauth' | 'generated' | 'ai';
    original_url: string;
    variants: AvatarVariants;
    format: 'static' | 'animated';
    animated_url?: string;
    crop?: AvatarCrop;
    blurhash?: string;
    dominant_color?: string;
    alt_text?: string;
    moderation_status: 'pending' | 'approved' | 'rejected';
    fallback: AvatarFallback;
    created_at: string;
    updated_at: string;
}
export interface AvatarManagerConfig {
    /** Base API URL (e.g., '/api' or 'https://api.example.com') */
    apiBaseUrl: string;
    /** Function to get auth headers */
    getHeaders: () => Record<string, string>;
    /** Upload endpoint for new avatars */
    uploadUrl?: string;
    /** Project ID for project-managed avatars */
    projectId?: string;
    /** Entity type for project-managed avatars */
    entityType?: string;
    /** Entity ID for project-managed avatars */
    entityId?: string;
}
/**
 * Configure avatar manager globally
 */
export declare function configureAvatarManager(config: Partial<AvatarManagerConfig>): void;
/**
 * Composable for managing multiple avatars
 */
export declare function useAvatarManager(localConfig?: Partial<AvatarManagerConfig>): {
    avatars: Ref<{
        id: string;
        name?: string | undefined;
        is_primary: boolean;
        source: "upload" | "gravatar" | "oauth" | "generated" | "ai";
        original_url: string;
        variants: {
            source?: {
                url: string;
                w: number;
                h: number;
            } | undefined;
            sm?: {
                url: string;
                w: number;
                h: number;
            } | undefined;
            md?: {
                url: string;
                w: number;
                h: number;
            } | undefined;
            lg?: {
                url: string;
                w: number;
                h: number;
            } | undefined;
        };
        format: "static" | "animated";
        animated_url?: string | undefined;
        crop?: {
            x: number;
            y: number;
            width: number;
            height: number;
            zoom?: number | undefined;
        } | undefined;
        blurhash?: string | undefined;
        dominant_color?: string | undefined;
        alt_text?: string | undefined;
        moderation_status: "pending" | "approved" | "rejected";
        fallback: {
            type: "initials" | "default" | "gravatar" | "none";
            initials?: string | undefined;
            background_color?: string | undefined;
            url?: string | undefined;
        };
        created_at: string;
        updated_at: string;
    }[], Avatar[] | {
        id: string;
        name?: string | undefined;
        is_primary: boolean;
        source: "upload" | "gravatar" | "oauth" | "generated" | "ai";
        original_url: string;
        variants: {
            source?: {
                url: string;
                w: number;
                h: number;
            } | undefined;
            sm?: {
                url: string;
                w: number;
                h: number;
            } | undefined;
            md?: {
                url: string;
                w: number;
                h: number;
            } | undefined;
            lg?: {
                url: string;
                w: number;
                h: number;
            } | undefined;
        };
        format: "static" | "animated";
        animated_url?: string | undefined;
        crop?: {
            x: number;
            y: number;
            width: number;
            height: number;
            zoom?: number | undefined;
        } | undefined;
        blurhash?: string | undefined;
        dominant_color?: string | undefined;
        alt_text?: string | undefined;
        moderation_status: "pending" | "approved" | "rejected";
        fallback: {
            type: "initials" | "default" | "gravatar" | "none";
            initials?: string | undefined;
            background_color?: string | undefined;
            url?: string | undefined;
        };
        created_at: string;
        updated_at: string;
    }[]>;
    loading: Ref<boolean, boolean>;
    error: Ref<string | null, string | null>;
    uploading: Ref<boolean, boolean>;
    uploadProgress: Ref<number, number>;
    primaryAvatar: import("vue").ComputedRef<{
        id: string;
        name?: string | undefined;
        is_primary: boolean;
        source: "upload" | "gravatar" | "oauth" | "generated" | "ai";
        original_url: string;
        variants: {
            source?: {
                url: string;
                w: number;
                h: number;
            } | undefined;
            sm?: {
                url: string;
                w: number;
                h: number;
            } | undefined;
            md?: {
                url: string;
                w: number;
                h: number;
            } | undefined;
            lg?: {
                url: string;
                w: number;
                h: number;
            } | undefined;
        };
        format: "static" | "animated";
        animated_url?: string | undefined;
        crop?: {
            x: number;
            y: number;
            width: number;
            height: number;
            zoom?: number | undefined;
        } | undefined;
        blurhash?: string | undefined;
        dominant_color?: string | undefined;
        alt_text?: string | undefined;
        moderation_status: "pending" | "approved" | "rejected";
        fallback: {
            type: "initials" | "default" | "gravatar" | "none";
            initials?: string | undefined;
            background_color?: string | undefined;
            url?: string | undefined;
        };
        created_at: string;
        updated_at: string;
    } | undefined>;
    config: import("vue").ComputedRef<AvatarManagerConfig>;
    fetchAvatars: () => Promise<void>;
    createAvatar: (data: {
        original_url: string;
        file_id?: string;
        name?: string;
        is_primary?: boolean;
        variants?: AvatarVariants;
        blurhash?: string;
        dominant_color?: string;
        alt_text?: string;
        fallback_initials?: string;
    }) => Promise<Avatar | null>;
    setPrimary: (avatarId: string) => Promise<boolean>;
    deleteAvatar: (avatarId: string) => Promise<boolean>;
    updateAvatar: (avatarId: string, data: {
        name?: string;
        crop?: AvatarCrop;
        alt_text?: string;
    }) => Promise<Avatar | null>;
    uploadAndCreateAvatar: (file: File, options?: {
        name?: string;
        is_primary?: boolean;
        fallback_initials?: string;
        crop?: AvatarCrop;
    }) => Promise<Avatar | null>;
    getAvatarUrl: (avatar: Avatar, size?: "sm" | "md" | "lg" | "source" | "original") => string;
};
