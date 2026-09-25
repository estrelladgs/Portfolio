import type { ImgHTMLAttributes } from 'react';

/** Shape returned by vite-imagetools for `?…&as=picture` imports. */
export interface PictureData {
  sources: Record<string, string>;
  img: { src: string; w: number; h: number };
}

const TYPES: Record<string, string> = { avif: 'image/avif', webp: 'image/webp', jpeg: 'image/jpeg', jpg: 'image/jpeg', png: 'image/png' };
// Modern formats first so the browser picks the lightest one it supports.
const ORDER = ['avif', 'webp', 'jpeg', 'jpg', 'png'];
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

type PictureProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height'> & {
  picture: PictureData;
  alt: string;
  sizes: string;
  /** Viewport width (px) below which the image is not shown; nothing is downloaded there. */
  hiddenBelow?: number;
  highPriority?: boolean;
};

export function Picture({ picture, sizes, hiddenBelow, highPriority, alt, ...img }: PictureProps) {
  const formats = Object.keys(picture.sources).sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
  return (
    <picture>
      {hiddenBelow && <source media={`(max-width: ${hiddenBelow - 1}px)`} srcSet={BLANK} />}
      {formats.map((format) => (
        <source key={format} type={TYPES[format]} srcSet={picture.sources[format]} sizes={sizes} />
      ))}
      <img
        {...img}
        {...(highPriority ? { fetchpriority: 'high' } : {})}
        src={picture.img.src}
        width={picture.img.w}
        height={picture.img.h}
        alt={alt}
        decoding="async"
      />
    </picture>
  );
}
