/**
 * Safely parse JSON images array from database
 * @param {string} imagesJson - JSON string containing image URLs
 * @returns {Array} Array of image URLs
 */
export const parseImages = (imagesJson) => {
  if (!imagesJson) return [];
  
  try {
    const parsed = JSON.parse(imagesJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error parsing images JSON:', error);
    return [];
  }
};

/**
 * Get the first image from a parsed images array
 * @param {string} imagesJson - JSON string containing image URLs
 * @param {string} fallback - Fallback image URL
 * @returns {string} Image URL
 */
export const getMainImage = (imagesJson, fallback = '/api/placeholder/400/200') => {
  const images = parseImages(imagesJson);
  return images[0] || fallback;
};

/**
 * Validate if an image URL is accessible
 * @param {string} url - Image URL to validate
 * @returns {Promise<boolean>} Promise resolving to true if image is accessible
 */
export const validateImageUrl = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};
