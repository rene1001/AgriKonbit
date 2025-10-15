import React, { useState } from 'react';

const ImageWithFallback = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = '/api/placeholder/400/200',
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={handleError}
      {...props}
    />
  );
};

export default ImageWithFallback;
