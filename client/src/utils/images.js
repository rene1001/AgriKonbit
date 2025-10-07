import { api } from './api';

// Returns the API base without the trailing /api suffix
const getPublicBase = () => {
  const base = api?.defaults?.baseURL || '';
  return base.replace(/\/?api\/?$/, '');
};

// Normalize any stored image value into a browsable absolute URL
export const resolveImageUrl = (value, fallback = '/api/placeholder/400/200') => {
  if (!value || typeof value !== 'string') return fallback;
  // Normalize backslashes (Windows paths) and trim
  const trimmed = value.replace(/\\/g, '/').trim();
  if (!trimmed) return fallback;

  // Already absolute (http/https/data)
  if (/^(https?:)?\/\//i.test(trimmed) || /^data:/i.test(trimmed)) return trimmed;

  // Ensure leading slash for server-served uploads
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

  // If it already starts with /uploads, prefix with server origin
  if (path.startsWith('/uploads/')) {
    return `${getPublicBase()}${path}`;
  }

  // Common stored variants like 'documents/....' or 'uploads/documents/...'
  if (path.startsWith('/documents/') || path.startsWith('/uploads/documents/')) {
    const normalized = path.startsWith('/uploads') ? path : `/uploads${path}`;
    return `${getPublicBase()}${normalized}`;
  }

  // Fallback: try to serve under uploads root
  return `${getPublicBase()}/uploads${path}`;
};

// Safely parse images field that may be a JSON string, array, or null
export const parseImagesArray = (images) => {
  if (!images) return [];
  try {
    if (Array.isArray(images)) return images.filter(Boolean);
    if (typeof images === 'string') {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    }
  } catch (_) {
    // ignore
  }
  return [];
};
