import { memo, useState, useCallback } from 'react';

/**
 * LazyImage component with loading state and error handling
 * Implements native lazy loading for better performance
 */
function LazyImage({ 
  src, 
  alt = '', 
  className = '', 
  fallback = null,
  width,
  height,
  onLoad,
  onError,
  ...props 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback((e) => {
    setIsLoaded(true);
    onLoad?.(e);
  }, [onLoad]);

  const handleError = useCallback((e) => {
    setHasError(true);
    onError?.(e);
  }, [onError]);

  if (hasError) {
    return fallback || (
      <div 
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400 text-xs">Bild fehlt</span>
      </div>
    );
  }

  return (
    <div className="relative" style={{ width, height }}>
      {/* Loading placeholder */}
      {!isLoaded && (
        <div 
          className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}
          style={{ width, height }}
        />
      )}
      
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        width={width}
        height={height}
        {...props}
      />
    </div>
  );
}

export default memo(LazyImage);
