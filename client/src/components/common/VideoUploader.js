import React, { useState } from 'react';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';

// Props:
// - onUploaded: (url: string) => void
// - documentType?: string (default 'video')
// - accept?: string (default 'video/*')
// - label?: string
// - maxFileSizeBytes?: number (default 50MB)
// - showPreview?: boolean (default true)
export default function VideoUploader({ 
  onUploaded, 
  documentType = 'video', 
  accept = 'video/*', 
  label = 'Uploader une vidéo', 
  maxFileSizeBytes = 50 * 1024 * 1024,
  showPreview = true
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type and size
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format non supporté. Utilisez MP4, WebM ou OGG.');
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
      setProgress(0);
      const formData = new FormData();
      formData.append('document', file);
      formData.append('document_type', documentType);

      const res = await api.post(endpoints.documents.upload, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
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
        setVideoUrl(publicUrl);
        onUploaded?.(publicUrl);
        toast.success('Vidéo uploadée avec succès');
        // reset input for re-upload same filename
        e.target.value = '';
      } else {
        toast.error(res.data?.message || "Échec de l'upload");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Échec de l'upload");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer text-sm inline-block">
        {uploading ? `Téléversement (${progress}%)` : label}
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      )}
      {showPreview && videoUrl && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Aperçu de la vidéo:</p>
          <video 
            src={videoUrl} 
            controls 
            className="w-full max-h-64 rounded border border-gray-300"
            style={{ maxWidth: '100%' }}
          >
            Votre navigateur ne prend pas en charge la lecture de vidéos.
          </video>
        </div>
      )}
    </div>
  );
}