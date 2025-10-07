import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';
import ImageUploader from '../../components/common/ImageUploader';
import BackButton from '../../components/common/BackButton';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', location: '', latitude: '', longitude: '', images: [] });
  const [imageUrl, setImageUrl] = useState('');

  const onChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(endpoints.projects.detail(id));
        const p = res.data?.data;
        setProject(p);
        setForm({
          title: p?.title || '',
          description: p?.description || '',
          location: p?.location || '',
          latitude: p?.latitude ?? '',
          longitude: p?.longitude ?? '',
          images: (() => { try { return p?.images ? JSON.parse(p.images) : []; } catch { return []; } })()
        });
      } catch (e) {
        toast.error("Impossible de charger le projet");
      }
    })();
  }, [id]);

  const save = async () => {
    try {
      setLoading(true);
      if (!form.title.trim() || form.title.trim().length < 5) {
        toast.error('Titre trop court (>= 5)');
        return;
      }
      if (!form.description.trim() || form.description.trim().length < 50) {
        toast.error('Description trop courte (>= 50)');
        return;
      }
      if (!form.location.trim() || form.location.trim().length < 3) {
        toast.error('Localisation trop courte (>= 3)');
        return;
      }
      await api.put(endpoints.projects.update(id), {
        title: form.title,
        description: form.description,
        location: form.location,
        latitude: form.latitude || null,
        longitude: form.longitude || null,
        images: form.images
      });
      toast.success('Projet mis à jour');
      navigate('/dashboard');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Échec de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Modifier le projet</h1>
          <BackButton />
        </div>
        {!project ? (
          <div className="bg-white p-6 rounded shadow">Chargement…</div>
        ) : (
          <div className="bg-white p-6 rounded shadow space-y-4">
            {project?.status !== 'pending' && (
              <div className="p-3 bg-yellow-50 text-yellow-800 rounded text-sm">Seuls les projets en attente peuvent être modifiés.</div>
            )}
            <div>
              <label className="label">Titre</label>
              <input className="input w-full" value={form.title} onChange={(e)=>onChange('title', e.target.value)} />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="input w-full" rows={6} value={form.description} onChange={(e)=>onChange('description', e.target.value)} />
            </div>
            <div>
              <label className="label">Localisation</label>
              <input className="input w-full" value={form.location} onChange={(e)=>onChange('location', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Latitude</label>
                <input className="input w-full" value={form.latitude} onChange={(e)=>onChange('latitude', e.target.value)} />
              </div>
              <div>
                <label className="label">Longitude</label>
                <input className="input w-full" value={form.longitude} onChange={(e)=>onChange('longitude', e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="label">Images</label>
              <div className="flex gap-2 items-center">
                <input className="input flex-1" placeholder="https://..." value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)} />
                <button type="button" className="btn" onClick={()=>{
                  const url = (imageUrl||'').trim();
                  if (!url) return;
                  setForm(prev => ({ ...prev, images: [...(prev.images||[]), url] }));
                  setImageUrl('');
                }}>Ajouter</button>
                <ImageUploader label="Uploader (JPG/PNG)" documentType="project_image" onUploaded={(url)=> setForm(prev => ({ ...prev, images: [...(prev.images||[]), url] }))} />
              </div>
              {(form.images||[]).length>0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {form.images.map((u,i)=> (
                    <div key={`${u}-${i}`} className="relative border rounded overflow-hidden">
                      <img src={u} alt={`image-${i}`} className="w-full h-24 object-cover" />
                      <button type="button" className="absolute top-1 right-1 bg-white/80 text-xs px-2 py-0.5 rounded" onClick={()=> setForm(prev => ({ ...prev, images: prev.images.filter((_,idx)=> idx!==i) }))}>Supprimer</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2">
              <button className="btn btn-primary" onClick={save} disabled={loading || project?.status !== 'pending'}>{loading ? 'Enregistrement…' : 'Enregistrer'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProject;
