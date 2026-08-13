import { useState } from 'react';

/**
 * LazyImage  -  responsive image with shimmer skeleton + fade-in on load.
 * Fixed aspect container (via className) prevents layout shift.
 */
export default function LazyImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  width,
  height,
  eager = false,
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden bg-maroon/10"
        >
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </div>
  );
}
