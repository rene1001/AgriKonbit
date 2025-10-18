import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';
import ImageUploader from '../../components/common/ImageUploader';

const ProjectUpdates = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', images: [], isPublic: true });
  const [imageUrl, setImageUrl] = useState('');

  const onChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(endpoints.projects.detail(id));
        setProject(res.data?.data || null);
      } catch (e) {
        toast.error("Impossible de charger le projet");
      }
    })();
  }, [id]);

  const submit = async () => {
    try {
      setLoading(true);
      if (!form.title.trim() || form.title.trim().length < 5) {
        toast.error('Titre trop court (>= 5)');
        return;
      }
      if (!form.content.trim() || form.content.trim().length < 20) {
        toast.error('Contenu trop court (>= 20)');
        return;
      }
      await api.post(endpoints.projects.addUpdate(id), {
        title: form.title,
        content: form.content,
        images: form.images,
        isPublic: form.isPublic
      });
      toast.success('Mise à jour ajoutée');
      navigate('/dashboard');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Échec de l\'ajout de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('farmer.projectUpdates.title')}</h1>
          <Link to="/dashboard" className="text-sm text-gray-600 hover:underline">{t('farmer.projectUpdates.back')}</Link>
        </div>
        {!project ? (
          <div className="bg-white p-6 rounded shadow">{t('farmer.projectUpdates.loading')}</div>
        ) : (
          <div className="bg-white p-6 rounded shadow space-y-4">
            <div>
              <label className="label">{t('farmer.projectUpdates.titleLabel')}</label>
              <input className="input w-full" value={form.title} onChange={(e)=>onChange('title', e.target.value)} />
            </div>
            <div>
              <label className="label">{t('farmer.projectUpdates.content')}</label>
              <textarea className="input w-full" rows={8} value={form.content} onChange={(e)=>onChange('content', e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <input id="isPublic" type="checkbox" checked={form.isPublic} onChange={(e)=> onChange('isPublic', e.target.checked)} />
              <label htmlFor="isPublic" className="text-sm">{t('farmer.projectUpdates.public')}</label>
            </div>

            <div className="space-y-2">
              <label className="label">{t('farmer.projectUpdates.images')}</label>
              <div className="flex gap-2 items-center">
                <input className="input flex-1" placeholder="https://..." value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)} />
                <button type="button" className="btn" onClick={()=>{
                  const url = (imageUrl||'').trim();
                  if (!url) return;
                  setForm(prev => ({ ...prev, images: [...(prev.images||[]), url] }));
                  setImageUrl('');
                }}>Ajouter</button>
                <ImageUploader label="Uploader (JPG/PNG)" documentType="project_update_image" onUploaded={(url)=> setForm(prev => ({ ...prev, images: [...(prev.images||[]), url] }))} />
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
              <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading ? 'Enregistrement…' : 'Publier'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectUpdates;
