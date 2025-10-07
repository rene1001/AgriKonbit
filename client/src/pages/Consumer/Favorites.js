import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';
import BackButton from '../../components/common/BackButton';

const Favorites = () => {
  const qc = useQueryClient();
  const [type, setType] = useState('product');
  const [targetId, setTargetId] = useState('');

  const { data, isLoading, isError, error } = useQuery(['favorites'], async () => {
    const res = await api.get(endpoints.favorites.list);
    return res.data.data;
  });

  const addMutation = useMutation(async () => {
    await api.post(endpoints.favorites.add, { type, id: Number(targetId) });
  }, {
    onSuccess: () => {
      toast.success('Ajouté aux favoris');
      setTargetId('');
      qc.invalidateQueries(['favorites']);
    },
    onError: (e) => toast.error(e?.response?.data?.message || 'Échec de l\'ajout')
  });

  const removeFavorite = async (t, id) => {
    try {
      await api.delete(endpoints.favorites.remove(t, id));
      toast.success('Retiré des favoris');
      qc.invalidateQueries(['favorites']);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Échec du retrait');
    }
  };

  const products = data?.products || [];
  const producers = data?.producers || [];

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Favoris</h1>
          <BackButton />
        </div>

        <div className="card">
          <div className="font-semibold mb-3">Ajouter un favori</div>
          <div className="flex gap-2 items-center">
            <select value={type} onChange={(e) => setType(e.target.value)} className="input">
              <option value="product">Produit</option>
              <option value="producer">Producteur</option>
            </select>
            <input className="input flex-1" placeholder="ID cible" value={targetId} onChange={(e) => setTargetId(e.target.value)} />
            <button className="btn btn-primary" onClick={() => addMutation.mutate()} disabled={!targetId || addMutation.isLoading}>Ajouter</button>
          </div>
        </div>

        {isLoading && <div className="card">Chargement…</div>}
        {isError && <div className="card text-red-700">{error?.message || 'Erreur'}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="font-semibold mb-3">Produits favoris</div>
            <div className="space-y-2">
              {products.map(p => (
                <div key={`p-${p.id}`} className="flex items-center justify-between">
                  <div>ID Produit: {p.id}</div>
                  <button className="btn btn-outline btn-sm" onClick={() => removeFavorite('product', p.id)}>Retirer</button>
                </div>
              ))}
              {products.length === 0 && <div className="text-sm text-gray-500">Aucun produit favori.</div>}
            </div>
          </div>
          <div className="card">
            <div className="font-semibold mb-3">Producteurs favoris</div>
            <div className="space-y-2">
              {producers.map(p => (
                <div key={`pr-${p.id}`} className="flex items-center justify-between">
                  <div>ID Producteur: {p.id}</div>
                  <button className="btn btn-outline btn-sm" onClick={() => removeFavorite('producer', p.id)}>Retirer</button>
                </div>
              ))}
              {producers.length === 0 && <div className="text-sm text-gray-500">Aucun producteur favori.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
