import React from 'react';
import type { ImageLoaderProps } from '../shared/lib/image-config';
declare const VALID_LOADING_VALUES: readonly ["lazy", "eager", undefined];
declare type LoadingValue = typeof VALID_LOADING_VALUES[number];
export type { ImageLoaderProps };
export declare type ImageLoader = (p: ImageLoaderProps) => string;
declare type PlaceholderValue = 'blur' | 'empty';
declare type OnLoadingComplete = (img: HTMLImageElement) => void;
export interface StaticImageData {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
    blurWidth?: number;
    blurHeight?: number;
}
interface StaticRequire {
    default: StaticImageData;
}
declare type StaticImport = StaticRequire | StaticImageData;
declare type SafeNumber = number | `${number}`;
export declare type ImageProps = Omit<JSX.IntrinsicElements['img'], 'src' | 'srcSet' | 'ref' | 'alt' | 'width' | 'height' | 'loading'> & {
    src: string | StaticImport;
    alt: string;
    width?: SafeNumber;
    height?: SafeNumber;
    fill?: boolean;
    loader?: ImageLoader;
    quality?: SafeNumber;
    priority?: boolean;
    loading?: LoadingValue;
    placeholder?: PlaceholderValue;
    blurDataURL?: string;
    unoptimized?: boolean;
    onLoadingComplete?: OnLoadingComplete;
    /**
     * @deprecated Use `fill` prop instead of `layout="fill"` or change import to `next/legacy/image`.
     * @see https://nextjs.org/docs/api-reference/next/legacy/image
     */
    layout?: string;
    /**
     * @deprecated Use `style` prop instead.
     */
    objectFit?: string;
    /**
     * @deprecated Use `style` prop instead.
     */
    objectPosition?: string;
    /**
     * @deprecated This prop does not do anything.
     */
    lazyBoundary?: string;
    /**
     * @deprecated This prop does not do anything.
     */
    lazyRoot?: string;
};
declare const Image: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, "height" | "width" | "loading" | "ref" | "alt" | "src" | "srcSet"> & {
    src: string | StaticImport;
    alt: string;
    width?: SafeNumber | undefined;
    height?: SafeNumber | undefined;
    fill?: boolean | undefined;
    loader?: ImageLoader | undefined;
    quality?: SafeNumber | undefined;
    priority?: boolean | undefined;
    loading?: LoadingValue;
    placeholder?: PlaceholderValue | undefined;
    blurDataURL?: string | undefined;
    unoptimized?: boolean | undefined;
    onLoadingComplete?: OnLoadingComplete | undefined;
    /**
     * @deprecated Use `fill` prop instead of `layout="fill"` or change import to `next/legacy/image`.
     * @see https://nextjs.org/docs/api-reference/next/legacy/image
     */
    layout?: string | undefined;
    /**
     * @deprecated Use `style` prop instead.
     */
    objectFit?: string | undefined;
    /**
     * @deprecated Use `style` prop instead.
     */
    objectPosition?: string | undefined;
    /**
     * @deprecated This prop does not do anything.
     */
    lazyBoundary?: string | undefined;
    /**
     * @deprecated This prop does not do anything.
     */
    lazyRoot?: string | undefined;
} & React.RefAttributes<HTMLImageElement | null>>;
export default Image;
