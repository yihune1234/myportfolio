import { useState } from 'react';

/**
 * CloudinaryImage Component
 * Handles image loading with fallback and optimization
 * Supports both Cloudinary URLs and local/external URLs
 */
export default function CloudinaryImage({
  src,
  alt = 'Image',
  className = '',
  width = 800,
  height = 600,
  ...props
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!src) {
    return (
      <div
        className={`bg-muted flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-muted-foreground text-sm">No image</span>
      </div>
    );
  }

  // Determine the image URL
  let imageUrl = src;

  // If it's a local path, convert to Cloudinary fetch URL
  if (!src.startsWith('http')) {
    const BASE_URL = 'https://portfoliobackend-a6ah.onrender.com';
    const cleanPath = src.startsWith('/') ? src.substring(1) : src;
    const fullPath = cleanPath.startsWith('uploads/')
      ? `${BASE_URL}/${cleanPath}`
      : `${BASE_URL}/uploads/${cleanPath}`;
    imageUrl = `https://res.cloudinary.com/dqcrqtzz6/image/fetch/f_auto,q_auto,w_${width},h_${height},c_fill/${fullPath}`;
  } else if (src.includes('res.cloudinary.com')) {
    // Already a Cloudinary URL, use as is
    imageUrl = src;
  } else {
    // External URL, wrap in Cloudinary fetch for optimization
    imageUrl = `https://res.cloudinary.com/dqcrqtzz6/image/fetch/f_auto,q_auto,w_${width},h_${height},c_fill/${src}`;
  }

  return (
    <>
      <img
        src={imageUrl}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        {...props}
      />
      {hasError && (
        <div
          className={`bg-muted flex items-center justify-center ${className}`}
          style={{ width, height }}
        >
          <span className="text-muted-foreground text-sm">Failed to load image</span>
        </div>
      )}
    </>
  );
}
