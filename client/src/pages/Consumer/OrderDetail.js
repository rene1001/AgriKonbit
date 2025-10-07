import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { api, endpoints } from '../../utils/api';

const OrderDetail = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery(['order', id], async () => {
    const res = await api.get(endpoints.orders.detail(id));
    return res.data.data;
  }, { enabled: !!id });

  if (isLoading) return <div className="max-w-5xl mx-auto p-6">Chargement…</div>;
  if (isError) return (
    <div className="max-w-5xl mx-auto p-6 text-red-600">{error?.response?.data?.message || error?.message || 'Erreur'}</div>
  );

  const o = data?.order || data;
  const items = o?.items || [];

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Commande #{o?.order_number || id}</h1>
          <div className="flex gap-2">
            <a className="btn btn-outline opacity-60 pointer-events-none" title="Bientôt">Télécharger facture</a>
            {o?.tracking_number && (
              <Link to={`/tracking?t=${encodeURIComponent(o.tracking_number)}`} className="btn btn-primary">Suivre la livraison</Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 card">
            <h2 className="font-semibold mb-3">Articles</h2>
            <div className="divide-y">
              {items.map((it, idx) => (
                <div key={idx} className="py-3 flex items-start gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded" />
                  <div className="flex-1">
                    <div className="font-medium">{it.product_name || it.name}</div>
                    <div className="text-sm text-gray-600">Qté: {it.quantity} • ${Number(it.price_usd || it.price || 0).toFixed(2)}</div>
                  </div>
                </div>
              ))}
              {items.length === 0 && <div className="text-gray-500 text-sm">Aucun article.</div>}
            </div>
          </div>
          <div className="card space-y-2">
            <div className="flex justify-between"><span>Statut</span><span className="font-medium">{o?.status || '—'}</span></div>
            <div className="flex justify-between"><span>Total</span><span className="font-medium">${Number(o?.total_usd || 0).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Paiement</span><span className="font-medium">{o?.payment_method || '—'}</span></div>
            <div className="flex justify-between"><span>Créée</span><span className="font-medium">{o?.created_at ? new Date(o.created_at).toLocaleString() : '—'}</span></div>
            <div className="pt-2 text-sm text-gray-600">
              <div className="font-semibold mb-1">Adresse de livraison</div>
              <div>{o?.shipping_address?.line1 || '—'}</div>
              <div>{o?.shipping_address?.city || ''} {o?.shipping_address?.country || ''}</div>
            </div>
          </div>
        </div>

        {o?.nft_id && (
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Traçabilité & Blockchain</div>
                <div className="text-sm text-gray-600">NFT: {o.nft_id}</div>
              </div>
              <Link to={`/traceability/${o.nft_id}`} className="btn btn-outline">Voir</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
