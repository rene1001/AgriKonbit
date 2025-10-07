import React, { useState } from 'react';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';

// Props:
// - onUploaded: (url: string) => void
// - documentType?: string (default 'image')
// - accept?: string (default 'image/*')
// - label?: string
// - maxFileSizeBytes?: number (default 5MB)
export default function ImageUploader({ onUploaded, documentType = 'image', accept = 'image/*', label = 'Uploader une image', maxFileSizeBytes = 5 * 1024 * 1024 }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type (JPEG/PNG) and size
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format non supporté. Utilisez JPG ou PNG.');
      e.target.value = '';
      return;
    }
    if (file.size > maxFileSizeBytes) {
      const mb = (maxFileSizeBytes / (1024 * 1024)).toFixed(0);
      toast.error(`Fichier trop volumineux (> ${mb}MB).`);
      e.target.value = '';
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('document', file);
      formData.append('document_type', documentType);

      const res = await api.post(endpoints.documents.upload, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success) {
        const filename = res.data?.data?.filename;
        if (!filename) {
          toast.error("Réponse d'upload invalide");
          return;
        }
        // Build public URL to the uploaded file
        const base = (api.defaults?.baseURL || '').replace(/\/api$/, '');
        const publicUrl = `${base}/uploads/documents/${filename}`;
        onUploaded?.(publicUrl);
        toast.success('Image uploadée');
        // reset input for re-upload same filename
        e.target.value = '';
      } else {
        toast.error(res.data?.message || "Échec de l'upload");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Échec de l'upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer text-sm">
        {uploading ? 'Téléversement…' : label}
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
    </div>
  );
}
