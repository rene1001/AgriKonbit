import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';
import BackButton from '../../components/common/BackButton';

const Orders = () => {
  const { data, isLoading, isError, error } = useQuery(['consumer-orders'], async () => {
    const res = await api.get(endpoints.orders.list, { params: { limit: 20 } });
    return res.data.data;
  }, { retry: 1 });

  if (isLoading) return <div className="max-w-7xl mx-auto p-6">Chargement des commandes…</div>;
  if (isError) return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-red-600 mb-2">Échec du chargement.</div>
      <div className="text-sm text-gray-600">{error?.response?.data?.message || error?.message || 'Erreur inconnue'}</div>
    </div>
  );

  const orders = data?.orders || [];

  const downloadInvoice = async (id) => {
    try {
      const res = await api.get(endpoints.orders.invoice(id), { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Téléchargement de la facture échoué');
    }
  };

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Mes commandes</h1>
          <div className="flex items-center gap-3">
            <BackButton />
            <Link to="/marketplace" className="btn btn-primary">Acheter des produits</Link>
          </div>
        </div>
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produits</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paiement</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium">#{o.order_number}</div>
                    <div className="text-xs text-gray-500">{new Date(o.created_at).toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{o.items?.map(i => i.product_name || i.name).filter(Boolean).join(', ') || '—'}</td>
                  <td className="px-4 py-3 font-medium">${Number(o.total_usd || 0).toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm">{o.payment_method || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      o.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      o.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      o.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>{o.status || '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <Link to={`/orders/${o.id}`} className="btn btn-outline btn-sm">Détails</Link>
                      <button className="btn btn-outline btn-sm" onClick={() => downloadInvoice(o.id)}>Facture PDF</button>
                      {o.tracking_number && (
                        <Link to={`/tracking?t=${encodeURIComponent(o.tracking_number)}`} className="btn btn-outline btn-sm">Suivre</Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">Aucune commande pour l’instant.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
