import React, { useState } from 'react';

/**
 * Composant d'image optimisé avec support WebP et fallback
 * Utilise lazy loading et format WebP pour meilleure performance
 * 
 * @param {string} src - URL de l'image source (JPG/PNG)
 * @param {string} webpSrc - URL de l'image WebP (optionnel, sera généré si non fourni)
 * @param {string} alt - Texte alternatif
 * @param {string} className - Classes CSS
 * @param {string} fallbackSrc - Image de fallback en cas d'erreur
 * @param {object} ...props - Autres props HTML img
 */
const OptimizedImage = ({
  src,
  webpSrc,
  alt = '',
  className = '',
  fallbackSrc = '/placeholder-image.jpg',
  onLoad,
  onError,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Générer l'URL WebP si non fournie
  const webpUrl = webpSrc || src?.replace(/\.(jpe?g|png)$/i, '.webp');

  // Vérifier si le navigateur supporte WebP
  const supportsWebP = () => {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  };

  const handleError = (e) => {
    if (!hasError) {
      console.log('❌ Erreur chargement image:', imgSrc);
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
    if (onError) {
      onError(e);
    }
  };

  const handleLoad = (e) => {
    if (onLoad) {
      onLoad(e);
    }
  };

  // Si WebP n'est pas supporté ou pas d'URL WebP, utiliser image classique
  if (!supportsWebP() || !webpUrl) {
    return (
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        loading="lazy"
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    );
  }

  // Utiliser <picture> pour WebP avec fallback
  return (
    <picture>
      {/* Source WebP (25-35% plus léger) */}
      <source srcSet={webpUrl} type="image/webp" />
      
      {/* Fallback JPG/PNG */}
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        loading="lazy"
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </picture>
  );
};

export default OptimizedImage;

/**
 * Hook pour précharger des images
 * Utile pour les images critiques above-the-fold
 * 
 * Usage:
 * const preloadImages = useImagePreload();
 * preloadImages(['/hero.jpg', '/logo.png']);
 */
export const useImagePreload = () => {
  const preloadImages = (urls) => {
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  };

  return preloadImages;
};

/**
 * Composant pour lazy load avec Intersection Observer
 * Charge l'image uniquement quand visible
 */
export const LazyImage = ({ src, alt, className, threshold = 0.1, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = React.useRef();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return (
    <div ref={imgRef} className={className}>
      {isVisible ? (
        <OptimizedImage src={src} alt={alt} {...props} />
      ) : (
        <div className="bg-gray-200 animate-pulse" style={{ aspectRatio: '16/9' }} />
      )}
    </div>
  );
};
