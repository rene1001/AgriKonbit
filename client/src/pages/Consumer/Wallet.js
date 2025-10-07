import React from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';
import BackButton from '../../components/common/BackButton';

const Wallet = () => {
  const { data: balanceData } = useQuery(['gyt-balance'], async () => {
    const res = await api.get(endpoints.blockchain.gytBalance);
    return res.data.data;
  });
  const { data: txData } = useQuery(['gyt-transactions'], async () => {
    const res = await api.get(endpoints.blockchain.gytTransactions);
    return res.data.data;
  });
  const { data: rateData } = useQuery(['gyt-info'], async () => {
    const res = await api.get(endpoints.blockchain.info);
    return res.data.data;
  });

  const queryClient = useQueryClient();
  const balance = Number(balanceData?.balance || 0);
  const txs = txData?.transactions || [];
  const usdRate = Number(rateData?.usdRate || 1);
  const usdEq = balance * usdRate;

  // History pagination (client-side)
  const pageSize = 5;
  const [page, setPage] = React.useState(1);
  const pages = Math.max(1, Math.ceil((txs?.length || 0) / pageSize));
  React.useEffect(() => {
    if (page > pages) setPage(pages);
  }, [pages]);
  const start = (page - 1) * pageSize;
  const pageTxs = txs.slice(start, start + pageSize);

  // Top-up modal state
  const [openTopup, setOpenTopup] = React.useState(false);
  const [amount, setAmount] = React.useState('');
  const [provider, setProvider] = React.useState('stripe');
  const [submitting, setSubmitting] = React.useState(false);
  const [topupStep, setTopupStep] = React.useState('form'); // 'form' | 'confirm'

  // Simulated fees
  const feeRate = 0.015; // 1.5%
  const feeFixed = 0.3; // $0.30 equivalent (simulation)
  const amountNum = parseFloat(amount) || 0;
  const feeGyt = amountNum * feeRate + (feeFixed / usdRate);
  const totalGyt = amountNum + (isFinite(feeGyt) ? feeGyt : 0);

  const openTopupModal = () => {
    setAmount('');
    setProvider('stripe');
    setOpenTopup(true);
    setTopupStep('form');
  };

  const submitTopup = async (e) => {
    e?.preventDefault?.();
    const amountGyt = parseFloat(amount);
    if (isNaN(amountGyt) || amountGyt <= 0) {
      return toast.error('Montant invalide');
    }
    if (topupStep === 'form') {
      // Go to confirmation step
      setTopupStep('confirm');
      return;
    }
    try {
      setSubmitting(true);
      await api.post(endpoints.blockchain.gytTopup, { amountGyt, provider });
      toast.success('Rechargement effectué');
      setOpenTopup(false);
      queryClient.invalidateQueries(['gyt-balance']);
      queryClient.invalidateQueries(['gyt-transactions']);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Échec du rechargement');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Portefeuille GYT</h1>
          <div className="flex items-center gap-3">
            <BackButton />
            <button className="btn btn-primary" onClick={openTopupModal}>Recharger</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-br from-primary-50 to-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-500">Solde disponible</div>
                <div className="text-3xl font-bold">{balance.toFixed(2)} GYT</div>
                <div className="text-sm text-gray-600">≈ ${usdEq.toFixed(2)} USD @ {usdRate.toFixed(2)} USD/GYT</div>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>

          <div className="card hover:shadow transition">
            <div className="font-semibold mb-1">Recharger en GYT</div>
            <div className="text-sm text-gray-600 mb-3">Stripe ou PayPal (démo)</div>
            <button className="btn btn-primary" onClick={openTopupModal}>Ouvrir le formulaire</button>
          </div>

          <div className="card">
            <div className="font-semibold mb-1">Informations</div>
            <div className="text-sm text-gray-600">Taux indicatif • Pas de frais réels • Transactions de test</div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">Historique</div>
            <div className="text-xs text-gray-500">Dernières opérations</div>
          </div>
          <div className="divide-y">
            {pageTxs.map((t, idx) => (
              <div key={start + idx} className="py-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${t.amount >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <div className="font-medium">{t.type || 'Transaction'}</div>
                    <div className="text-gray-500">{t.hash ? t.hash.slice(0, 16) + '…' : '—'}</div>
                  </div>
                </div>
                <div className={`font-medium ${t.amount >= 0 ? 'text-green-700' : 'text-red-700'}`}>{Number(t.amount).toFixed(2)} GYT</div>
              </div>
            ))}
            {txs.length === 0 && (
              <div className="py-6 text-sm text-gray-500 text-center">Aucune transaction.</div>
            )}
          </div>
          {txs.length > pageSize && (
            <div className="flex items-center justify-end gap-2 pt-3">
              <button className="btn btn-outline btn-sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>Précédent</button>
              <div className="text-xs text-gray-600">Page {page} / {pages}</div>
              <button className="btn btn-outline btn-sm" onClick={() => setPage(Math.min(pages, page + 1))} disabled={page === pages}>Suivant</button>
            </div>
          )}
        </div>

        {/* Top-up Modal */}
        {openTopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white w-full max-w-md rounded-lg shadow-lg border">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <div className="font-semibold">Recharger le portefeuille</div>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setOpenTopup(false)}>✕</button>
              </div>
              <form onSubmit={submitTopup} className="px-5 py-4 space-y-4">
                {topupStep === 'form' ? (
                  <>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Montant (GYT)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Ex: 50"
                        required
                      />
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        {[10,25,50,100].map(v => (
                          <button type="button" key={v} className="btn btn-outline btn-xs" onClick={() => setAmount(String(v))}>{v} GYT</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Fournisseur de paiement</label>
                      <div className="flex gap-3">
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" name="provider" value="stripe" checked={provider==='stripe'} onChange={() => setProvider('stripe')} />
                          <span>Stripe</span>
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" name="provider" value="paypal" checked={provider==='paypal'} onChange={() => setProvider('paypal')} />
                          <span>PayPal</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button type="button" className="btn btn-outline" onClick={() => setOpenTopup(false)} disabled={submitting}>Annuler</button>
                      <button type="submit" className="btn btn-primary" disabled={submitting || !(amountNum>0)}>
                        Continuer
                      </button>
                    </div>
                    <div className="text-xs text-gray-500">Démo: pas de frais réels, transactions simulées.</div>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-50 border rounded p-3 text-sm">
                      <div className="flex items-center justify-between"><span>Montant</span><span className="font-medium">{amountNum.toFixed(2)} GYT</span></div>
                      <div className="flex items-center justify-between"><span>Frais (simulés)</span><span className="font-medium">{isFinite(feeGyt) ? feeGyt.toFixed(2) : '—'} GYT</span></div>
                      <div className="flex items-center justify-between"><span>Total débité</span><span className="font-semibold">{isFinite(totalGyt) ? totalGyt.toFixed(2) : '—'} GYT</span></div>
                      <div className="mt-1 text-xs text-gray-600">≈ ${(totalGyt*usdRate).toFixed(2)} USD • Fournisseur: {provider}</div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <button type="button" className="btn btn-outline" onClick={() => setTopupStep('form')} disabled={submitting}>Modifier</button>
                      <div className="flex items-center gap-2">
                        <button type="button" className="btn" onClick={() => setOpenTopup(false)} disabled={submitting}>Annuler</button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Traitement…' : 'Confirmer'}</button>
                      </div>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
