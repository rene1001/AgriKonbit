import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';
import BackButton from '../../components/common/BackButton';

const Subscriptions = () => {
  const qc = useQueryClient();
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState(1);
  const [interval, setInterval] = useState('monthly');
  const [paymentMethod, setPaymentMethod] = useState('gyt_wallet');

  const { data, isLoading, isError, error } = useQuery(['subscriptions'], async () => {
    const res = await api.get(endpoints.subscriptions.my);
    return res.data.data;
  });

  const createMutation = useMutation(async () => {
    await api.post(endpoints.subscriptions.create, {
      productId: Number(productId),
      qty: Number(qty),
      interval,
      paymentMethod
    });
  }, {
    onSuccess: () => {
      toast.success('Abonnement créé');
      setProductId(''); setQty(1); setInterval('monthly'); setPaymentMethod('gyt_wallet');
      qc.invalidateQueries(['subscriptions']);
    },
    onError: (e) => toast.error(e?.response?.data?.message || 'Échec de la création')
  });

  const updateStatus = async (id, status) => {
    try {
      await api.patch(endpoints.subscriptions.update(id), { status });
      toast.success('Statut mis à jour');
      qc.invalidateQueries(['subscriptions']);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Échec de la mise à jour');
    }
  };

  const subs = data?.subscriptions || [];

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Abonnements</h1>
          <BackButton />
        </div>

        <div className="card">
          <div className="font-semibold mb-3">Créer un abonnement</div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
            <input className="input" placeholder="ID produit" value={productId} onChange={(e) => setProductId(e.target.value)} />
            <input className="input" type="number" min={1} value={qty} onChange={(e) => setQty(e.target.value)} />
            <select className="input" value={interval} onChange={(e) => setInterval(e.target.value)}>
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuel</option>
            </select>
            <select className="input" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="gyt_wallet">DOLLAR Wallet</option>
              <option value="card">Carte</option>
              <option value="paypal">PayPal</option>
            </select>
            <button className="btn btn-primary" onClick={() => createMutation.mutate()} disabled={!productId || createMutation.isLoading}>Créer</button>
          </div>
        </div>

        {isLoading && <div className="card">Chargement…</div>}
        {isError && <div className="card text-red-700">{error?.message || 'Erreur'}</div>}

        <div className="card">
          <div className="font-semibold mb-3">Mes abonnements</div>
          <div className="space-y-2">
            {subs.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">Produit #{s.product_id} • {s.qty} pcs • {s.interval}</div>
                  <div className="text-sm text-gray-600">Statut: {s.status} • Prochaine: {s.next_run || '—'}</div>
                </div>
                <div className="flex gap-2">
                  {s.status !== 'paused' && <button className="btn btn-outline btn-sm" onClick={() => updateStatus(s.id, 'paused')}>Pause</button>}
                  {s.status !== 'active' && <button className="btn btn-outline btn-sm" onClick={() => updateStatus(s.id, 'active')}>Activer</button>}
                  {s.status !== 'canceled' && <button className="btn btn-outline btn-sm" onClick={() => updateStatus(s.id, 'canceled')}>Annuler</button>}
                </div>
              </div>
            ))}
            {subs.length === 0 && <div className="text-sm text-gray-500">Aucun abonnement.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
