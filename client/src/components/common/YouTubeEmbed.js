import React from 'react';

/**
 * Extrait l'ID YouTube depuis différents formats d'URL
 * @param {string} url - URL YouTube
 * @returns {string|null} - ID de la vidéo ou null
 */
const extractYouTubeId = (url) => {
  if (!url) return null;
  
  // Formats supportés:
  // https://www.youtube.com/watch?v=VIDEO_ID
  // https://youtu.be/VIDEO_ID
  // https://www.youtube.com/embed/VIDEO_ID
  // https://www.youtube.com/v/VIDEO_ID
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/ // Si c'est juste l'ID
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

/**
 * Composant pour afficher une vidéo YouTube embarquée
 * @param {Object} props
 * @param {string} props.url - URL YouTube ou ID de vidéo
 * @param {string} props.title - Titre de la vidéo (pour l'accessibilité)
 * @param {string} props.className - Classes CSS supplémentaires
 */
const YouTubeEmbed = ({ url, title = 'Vidéo YouTube', className = '' }) => {
  const videoId = extractYouTubeId(url);
  
  if (!videoId) {
    return null;
  }
  
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`} style={{ paddingBottom: '56.25%' }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default YouTubeEmbed;
