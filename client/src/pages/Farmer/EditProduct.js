import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';
import BackButton from '../../components/common/BackButton';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [stock, setStock] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(endpoints.products.detail(id));
        setProduct(res.data?.data || null);
        setStock(String(res.data?.data?.stock ?? ''));
      } catch (e) {
        toast.error("Impossible de charger le produit");
      }
    })();
  }, [id]);

  const saveStock = async () => {
    try {
      setLoading(true);
      const newStock = parseInt(stock);
      if (!(newStock >= 0)) {
        toast.error('Le stock doit être un entier >= 0');
        return;
      }
      await api.patch(endpoints.products.updateStock(id), { stock: newStock });
      toast.success('Stock mis à jour');
      navigate('/dashboard');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Échec de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Modifier le produit</h1>
          <BackButton />
        </div>
        {!product ? (
          <div className="bg-white p-6 rounded shadow">Chargement…</div>
        ) : (
          <div className="bg-white p-6 rounded shadow space-y-4">
            <div>
              <p className="text-sm text-gray-500">Nom</p>
              <p className="font-semibold">{product.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input type="number" className="input w-full" value={stock} onChange={(e)=>setStock(e.target.value)} />
            </div>
            <div className="pt-2">
              <button className="btn btn-primary" onClick={saveStock} disabled={loading}>{loading ? 'Enregistrement…' : 'Enregistrer'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProduct;
