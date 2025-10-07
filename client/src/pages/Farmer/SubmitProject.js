import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';
import ImageUploader from '../../components/common/ImageUploader';

const SubmitProject = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    budgetUsd: 1000,
    durationDays: 180,
    estimatedReturnPct: 7,
    location: '',
    category: 'crops',
    latitude: '',
    longitude: '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const onChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const toDisplayUrl = (u) => {
    if (!u) return u;
    if (/^https?:\/\//i.test(u)) return u;
    const base = (api.defaults?.baseURL || '').replace(/\/api$/, '');
    return `${base}/uploads/documents/${u}`;
  };

  const submit = async () => {
    try {
      setLoading(true);
      // Basic validations
      if (!form.title.trim() || form.title.trim().length < 5) {
        toast.error('Le titre est requis');
        return;
      }
      if (!form.description.trim() || form.description.trim().length < 50) {
        toast.error('La description doit contenir au moins 50 caractères');
        return;
      }
      if (!(parseFloat(form.budgetUsd) > 0)) {
        toast.error('Le budget doit être supérieur à 0');
        return;
      }
      if (!(parseInt(form.durationDays) >= 30)) {
        toast.error('La durée doit être d\'au moins 30 jours');
        return;
      }
      if (!(parseFloat(form.estimatedReturnPct) >= 0)) {
        toast.error('Le rendement doit être un nombre positif');
        return;
      }
      if (!form.location.trim() || form.location.trim().length < 3) {
        toast.error('La localisation doit contenir au moins 3 caractères');
        return;
      }
      const payload = {
        ...form,
        latitude: form.latitude || null,
        longitude: form.longitude || null,
        images: form.images || [],
        documents: []
      };
      const res = await api.post(endpoints.projects.create, payload);
      if (res.data.success) {
        toast.success('Projet soumis, en attente de validation');
        navigate('/dashboard');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Échec de soumission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Soumettre un projet</h1>
        <div className="card space-y-4">
          <div>
            <label className="label">Titre</label>
            <input className="input" value={form.title} onChange={(e)=>onChange('title', e.target.value)} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={5} value={form.description} onChange={(e)=>onChange('description', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Budget (USD)</label>
              <input type="number" className="input" value={form.budgetUsd} onChange={(e)=>onChange('budgetUsd', e.target.value)} />
            </div>
            <div>
              <label className="label">Durée (jours)</label>
              <input type="number" className="input" value={form.durationDays} onChange={(e)=>onChange('durationDays', e.target.value)} />
            </div>
            <div>
              <label className="label">Rendement (%)</label>
              <input type="number" className="input" value={form.estimatedReturnPct} onChange={(e)=>onChange('estimatedReturnPct', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Localisation</label>
            <input className="input" value={form.location} onChange={(e)=>onChange('location', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Catégorie</label>
              <select className="input" value={form.category} onChange={(e)=>onChange('category', e.target.value)}>
                <option value="crops">Crops</option>
                <option value="livestock">Livestock</option>
                <option value="fishing">Fishing</option>
                <option value="forestry">Forestry</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Latitude</label>
              <input className="input" value={form.latitude} onChange={(e)=>onChange('latitude', e.target.value)} />
            </div>
            <div>
              <label className="label">Longitude</label>
              <input className="input" value={form.longitude} onChange={(e)=>onChange('longitude', e.target.value)} />
            </div>
          </div>
          {/* Images */}
          <div className="space-y-2">
            <label className="label">Images (URL)</label>
            <div className="flex gap-2 items-center">
              <input
                className="flex-1 input"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <button
                type="button"
                className="btn"
                title="Ajouter l'image"
                onClick={() => {
                  const url = (imageUrl || '').trim();
                  if (!url) return;
                  setForm(prev => ({ ...prev, images: [...(prev.images || []), url] }));
                  setImageUrl('');
                }}
              >Ajouter</button>
              <ImageUploader
                label="Uploader (JPG/PNG)"
                documentType="project_image"
                onUploaded={(url) => setForm(prev => ({ ...prev, images: [...(prev.images || []), url] }))}
              />
            </div>
            {(form.images || []).length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {form.images.map((url, idx) => (
                  <div key={`${url}-${idx}`} className="relative border rounded overflow-hidden">
                    <img src={toDisplayUrl(url)} alt={`image-${idx}`} className="w-full h-24 object-cover" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-white/80 text-xs px-2 py-0.5 rounded"
                      title="Supprimer"
                      onClick={() => setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                    >Supprimer</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="btn btn-primary" onClick={submit} disabled={loading} title="Soumettre le projet">{loading ? 'Envoi…' : 'Soumettre'}</button>
        </div>
      </div>
    </div>
  );
};

export default SubmitProject;
