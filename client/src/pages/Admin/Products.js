import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const qc = useQueryClient();
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const { data, isLoading, isError } = useQuery([
    'admin-products', status, category, search, page, limit
  ], async () => {
    const res = await api.get(endpoints.admin.products, {
      params: {
        status: status || undefined,
        category: category || undefined,
        search: search || undefined,
        page,
        limit
      }
    });
    return res.data.data;
  });

  const toggleStatus = useMutation(
    async ({ id, isActive }) => {
      return api.patch(endpoints.admin.updateProductStatus(id), { isActive });
    },
    {
      onSuccess: () => {
        toast.success('Produit mis à jour');
        qc.invalidateQueries(['admin-products']);
      },
      onError: () => toast.error('Action impossible')
    }
  );

  if (isLoading) return <div className="max-w-7xl mx-auto p-6">Chargement…</div>;
  if (isError) return <div className="max-w-7xl mx-auto p-6 text-red-600">Échec du chargement.</div>;

  const products = data?.products || [];
  const pagination = data?.pagination || { page, pages: 1 };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header avec bouton retour */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
          <Link 
            to="/admin" 
            className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Retour au Dashboard Admin</span>
          </Link>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🛒 Gestion des Produits</h1>
            <p className="text-gray-600 mt-1">Modérez et gérez les produits de la marketplace</p>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 mb-4 flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Statut</label>
            <select className="border rounded p-2 text-sm" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              <option value="">Tous</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Catégorie</label>
            <select className="border rounded p-2 text-sm" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
              <option value="">Toutes</option>
              <option value="cereals">Céréales</option>
              <option value="fruits">Fruits</option>
              <option value="vegetables">Légumes</option>
              <option value="honey">Miel</option>
              <option value="dairy">Laitiers</option>
              <option value="meat">Viande</option>
              <option value="other">Autres</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-gray-600 mb-1">Recherche</label>
            <input
              type="text"
              className="border rounded p-2 text-sm w-full"
              value={search}
              placeholder="Nom ou description"
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-3">Produit</th>
                <th className="text-left p-3">Prix (USD)</th>
                <th className="text-left p-3">Stock</th>
                <th className="text-left p-3">Catégorie</th>
                <th className="text-left p-3">Agriculteur</th>
                <th className="text-left p-3">Actif</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.description?.slice(0, 80)}{(p.description || '').length > 80 ? '…' : ''}</div>
                  </td>
                  <td className="p-3">{Number(p.price_usd).toFixed(2)}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">
                    <div className="font-medium">{p.farmer_name}</div>
                    <div className="text-xs text-gray-500">{p.farmer_email}</div>
                  </td>
                  <td className="p-3">{p.is_active ? 'Oui' : 'Non'}</td>
                  <td className="p-3">
                    {p.is_active ? (
                      <button className="btn btn-outline btn-sm" onClick={() => toggleStatus.mutate({ id: p.id, isActive: false })}>Désactiver</button>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={() => toggleStatus.mutate({ id: p.id, isActive: true })}>Activer</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            className="btn btn-outline btn-sm"
            disabled={(pagination.page || page) <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >Précédent</button>
          <div className="text-sm text-gray-600">
            Page {pagination.page || page} / {pagination.pages || 1}
          </div>
          <button
            className="btn btn-outline btn-sm"
            disabled={(pagination.page || page) >= (pagination.pages || 1)}
            onClick={() => setPage((p) => p + 1)}
          >Suivant</button>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
