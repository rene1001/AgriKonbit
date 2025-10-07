import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';
import BackButton from '../../components/common/BackButton';

const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: 'crops',
    unit: 'kg',
    location: '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const onChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const submit = async () => {
    try {
      setLoading(true);

      // Validations de base
      if (!form.name.trim() || form.name.trim().length < 3) {
        toast.error('Le nom du produit est requis (minimum 3 caractères)');
        return;
      }

      if (!form.description.trim() || form.description.trim().length < 10) {
        toast.error('La description doit contenir au moins 10 caractères');
        return;
      }

      if (!(parseFloat(form.price) > 0)) {
        toast.error('Le prix doit être supérieur à 0');
        return;
      }

      if (!(parseInt(form.stock) >= 0)) {
        toast.error('Le stock doit être un entier positif ou nul');
        return;
      }

      if (!form.location.trim() || form.location.trim().length < 3) {
        toast.error('La localisation doit contenir au moins 3 caractères');
        return;
      }

      const payload = {
        ...form,
        images: form.images || []
      };

      const res = await api.post(endpoints.products.create, payload);

      if (res.data.success) {
        toast.success('Produit ajouté avec succès');
        navigate('/farmer/my-products');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Échec de l\'ajout du produit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Ajouter un produit</h1>
          <BackButton />
        </div>

        <div className="bg-white p-6 rounded shadow space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={form.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Ex: Tomates bio, Miel artisanal..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={4}
              value={form.description}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Décrivez votre produit, ses caractéristiques, son mode de production..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (GYT)</label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={form.price}
                onChange={(e) => onChange('price', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={form.stock}
                onChange={(e) => onChange('stock', e.target.value)}
                placeholder="Quantité disponible"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unité</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={form.unit}
                onChange={(e) => onChange('unit', e.target.value)}
              >
                <option value="kg">Kilogrammes (kg)</option>
                <option value="g">Grammes (g)</option>
                <option value="l">Litres (l)</option>
                <option value="ml">Millilitres (ml)</option>
                <option value="piece">Pièce(s)</option>
                <option value="box">Boîte(s)</option>
                <option value="bottle">Bouteille(s)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={form.category}
                onChange={(e) => onChange('category', e.target.value)}
              >
                <option value="crops">Cultures</option>
                <option value="livestock">Élevage</option>
                <option value="dairy">Produits laitiers</option>
                <option value="honey">Miel</option>
                <option value="fruits">Fruits</option>
                <option value="vegetables">Légumes</option>
                <option value="grains">Céréales</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={form.location}
                onChange={(e) => onChange('location', e.target.value)}
                placeholder="Ex: Port-au-Prince, Cap-Haïtien..."
              />
            </div>
          </div>

          {/* Section Images */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Images du produit</label>
            <div className="flex gap-2 items-center">
              <input
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://... ou URL d'image"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <button
                type="button"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                title="Ajouter l'image"
                onClick={() => {
                  const url = (imageUrl || '').trim();
                  if (!url) return;
                  setForm(prev => ({ ...prev, images: [...(prev.images || []), url] }));
                  setImageUrl('');
                }}
              >
                Ajouter
              </button>
            </div>

            {(form.images || []).length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                {form.images.map((url, idx) => (
                  <div key={`${url}-${idx}`} className="relative border rounded-lg overflow-hidden">
                    <img
                      src={url}
                      alt={`image-${idx}`}
                      className="w-full h-24 object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.png';
                      }}
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded"
                      title="Supprimer"
                      onClick={() => setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              onClick={submit}
              disabled={loading}
            >
              {loading ? 'Ajout en cours...' : 'Ajouter le produit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
