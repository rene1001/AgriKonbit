import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';
import { exportToCSV, exportToPrintableHTML } from '../../utils/export';

const FinancesSection = ({ stats }) => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bank_transfer');
  const [withdrawDestination, setWithdrawDestination] = useState('');
  const [withdrawNotes, setWithdrawNotes] = useState('');
  const [depositAmount, setDepositAmount] = useState('100');
  
  const queryClient = useQueryClient();

  // Fetch transactions
  const { data: transactionsData } = useQuery(['farmer-transactions'], async () => {
    const res = await api.get(endpoints.farmer.transactions, {
      params: { limit: 20 }
    });
    return res.data.data;
  });

  // Fetch investors
  const { data: investorsData } = useQuery(['farmer-investors'], async () => {
    const res = await api.get(endpoints.farmer.investors, {
      params: { limit: 10 }
    });
    return res.data.data;
  });

  // Withdraw mutation
  const withdrawMutation = useMutation(
    async (data) => {
      const res = await api.post(endpoints.farmer.withdraw, data);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['farmer-stats']);
        queryClient.invalidateQueries(['farmer-transactions']);
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        setWithdrawDestination('');
        setWithdrawNotes('');
        toast.success('Demande de retrait soumise avec succès !');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erreur lors du retrait');
      }
    }
  );

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Veuillez entrer un montant valide');
      return;
    }
    if (!withdrawDestination) {
      toast.error('Veuillez entrer une destination de retrait');
      return;
    }

    withdrawMutation.mutate({
      amount: parseFloat(withdrawAmount),
      method: withdrawMethod,
      destination: withdrawDestination,
      notes: withdrawNotes
    });
  };

  // Deposit functions (similar to InvestorDashboard)
  const afterDeposit = async (amount) => {
    await queryClient.invalidateQueries(['farmer-stats']);
    await queryClient.invalidateQueries(['farmer-transactions']);
    toast.success(`Dépôt de ${amount} GYT effectué`);
  };

  const handleStripeDeposit = async () => {
    try {
      const amount = Number(depositAmount);
      if (amount <= 0) return;
      const intent = await api.post(endpoints.payments.stripe.createIntent, {
        amount,
        currency: 'usd',
        type: 'deposit'
      });
      if (intent.data.success) {
        await api.post(endpoints.payments.stripe.confirm, {
          paymentIntentId: intent.data.data.paymentIntentId,
          amount,
          type: 'deposit'
        });
        await afterDeposit(amount);
      }
    } catch (e) {
      toast.error('Échec du dépôt Stripe');
    }
  };

  const handlePaypalDeposit = async () => {
    try {
      const amount = Number(depositAmount);
      if (amount <= 0) return;
      const order = await api.post(endpoints.payments.paypal.createOrder, {
        amount,
        currency: 'USD',
        type: 'deposit'
      });
      if (order.data.success) {
        await api.post(endpoints.payments.paypal.capture, {
          orderId: order.data.data.orderId,
          amount,
          type: 'deposit'
        });
        await afterDeposit(amount);
      }
    } catch (e) {
      toast.error('Échec du dépôt PayPal');
    }
  };

  const handleMetaMaskDeposit = async () => {
    try {
      const amount = Number(depositAmount);
      if (amount <= 0) return;
      const tx = await api.post(endpoints.payments.metamask.sendTransaction, {
        to: '0x' + 'b'.repeat(40),
        value: amount,
        type: 'deposit'
      });
      if (tx.data.success) {
        await afterDeposit(amount);
      }
    } catch (e) {
      toast.error('Échec du dépôt MetaMask');
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">Solde Disponible</span>
            <span className="text-3xl">💰</span>
          </div>
          <p className="text-4xl font-bold mb-1">
            {parseFloat(stats?.wallet?.gyt_balance || 0).toFixed(2)}
          </p>
          <p className="text-sm opacity-75">GYT</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">Total Gagné</span>
            <span className="text-3xl">📈</span>
          </div>
          <p className="text-4xl font-bold mb-1">
            {parseFloat(stats?.wallet?.total_earned_gyt || 0).toFixed(2)}
          </p>
          <p className="text-sm opacity-75">GYT</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">Total Retiré</span>
            <span className="text-3xl">💸</span>
          </div>
          <p className="text-4xl font-bold mb-1">
            {parseFloat(stats?.wallet?.total_withdrawn_gyt || 0).toFixed(2)}
          </p>
          <p className="text-sm opacity-75">GYT</p>
        </div>
      </div>

      {/* Deposit and Withdraw */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deposit Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">💰 Déposer des GYT</h3>
            <p className="text-sm text-gray-600 mt-1">
              Achetez des GYT pour vos achats ou investissements
            </p>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Montant (USD → GYT)
              </label>
              <input
                type="number"
                min="1"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="100"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Taux: 1 USD = 1 GYT</p>
            </div>
            <div className="flex gap-2">
              <button 
                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                onClick={handleStripeDeposit}
                disabled={!depositAmount || parseFloat(depositAmount) <= 0}
              >
                Stripe
              </button>
              <button 
                className="flex-1 px-3 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition"
                onClick={handlePaypalDeposit}
                disabled={!depositAmount || parseFloat(depositAmount) <= 0}
              >
                PayPal
              </button>
              <button 
                className="flex-1 px-3 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition"
                onClick={handleMetaMaskDeposit}
                disabled={!depositAmount || parseFloat(depositAmount) <= 0}
              >
                MetaMask
              </button>
            </div>
          </div>
        </div>

        {/* Withdraw Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">💸 Retirer des Fonds</h3>
            <p className="text-sm text-gray-600 mt-1">
              Transférez vos gains vers votre compte bancaire ou portefeuille
            </p>
          </div>
          <div className="flex items-center justify-center h-20">
            <button
              onClick={() => setShowWithdrawModal(true)}
              disabled={!stats?.wallet?.gyt_balance || parseFloat(stats.wallet.gyt_balance) <= 0}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                stats?.wallet?.gyt_balance && parseFloat(stats.wallet.gyt_balance) > 0
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              💸 Retirer
            </button>
          </div>
        </div>
      </div>

      {/* Revenue Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💵 Sources de Revenus</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Financement de Projets</p>
                <p className="text-2xl font-bold text-green-900">
                  {parseFloat(stats?.projects?.total_funded_gyt || 0).toFixed(2)} GYT
                </p>
              </div>
              <span className="text-3xl">🌱</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Ventes Marketplace</p>
                <p className="text-2xl font-bold text-blue-900">
                  {parseFloat(stats?.orders?.total_revenue_gyt || 0).toFixed(2)} GYT
                </p>
              </div>
              <span className="text-3xl">🛒</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Mes Investisseurs</h3>
          <div className="space-y-3">
            {investorsData?.investors?.slice(0, 5).map((investor) => (
              <div key={investor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{investor.full_name}</p>
                  <p className="text-xs text-gray-600">{investor.country}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{investor.total_invested_gyt} GYT</p>
                  <p className="text-xs text-gray-600">{investor.investment_count} investissements</p>
                </div>
              </div>
            ))}
            {(!investorsData?.investors || investorsData.investors.length === 0) && (
              <div className="text-center text-gray-500 py-4">
                Aucun investisseur pour le moment
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transactions History */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">📊 Historique des Transactions</h3>
          <div className="flex gap-2">
            <button
              type="button"
              className="px-3 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200"
              title="Exporter en CSV"
              onClick={() => {
                const rows = (transactionsData?.transactions || []).map(t => ({
                  id: t.id,
                  type: t.type,
                  description: t.description,
                  amount_gyt: t.amount_gyt,
                  status: t.status,
                  created_at: t.created_at
                }));
                if (!rows.length) return toast.error('Aucune donnée à exporter');
                exportToCSV('transactions', rows);
              }}
            >
              Export CSV
            </button>
            <button
              type="button"
              className="px-3 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200"
              title="Imprimer ou sauvegarder en PDF"
              onClick={() => {
                const rows = (transactionsData?.transactions || []);
                if (!rows.length) return toast.error('Aucune donnée à exporter');
                const html = `
                  <h1>Transactions</h1>
                  <table>
                    <thead><tr>
                      <th>ID</th><th>Type</th><th>Description</th><th>Montant (GYT)</th><th>Statut</th><th>Date</th>
                    </tr></thead>
                    <tbody>
                      ${rows.map(t => `
                        <tr>
                          <td>${t.id}</td>
                          <td>${t.type}</td>
                          <td>${t.description || ''}</td>
                          <td>${t.amount_gyt}</td>
                          <td>${t.status}</td>
                          <td>${new Date(t.created_at).toLocaleString()}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>`;
                exportToPrintableHTML('Transactions', html);
              }}
            >
              Export PDF
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactionsData?.transactions?.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      transaction.type === 'deposit' ? 'bg-green-100 text-green-800' :
                      transaction.type === 'withdrawal' ? 'bg-red-100 text-red-800' :
                      transaction.type === 'payment' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{transaction.description}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {transaction.amount_gyt} GYT
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      transaction.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!transactionsData?.transactions || transactionsData.transactions.length === 0) && (
            <div className="text-center text-gray-500 py-8">
              Aucune transaction pour le moment
            </div>
          )}
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">💸 Retirer des Fonds</h3>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant (GYT)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={stats?.wallet?.gyt_balance || 0}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Disponible: {parseFloat(stats?.wallet?.gyt_balance || 0).toFixed(2)} GYT
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Méthode de retrait
                </label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="bank_transfer">Virement bancaire</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="crypto_wallet">Portefeuille crypto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination (numéro de compte/wallet)
                </label>
                <input
                  type="text"
                  value={withdrawDestination}
                  onChange={(e) => setWithdrawDestination(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 0x123... ou 12345678"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optionnel)
                </label>
                <textarea
                  value={withdrawNotes}
                  onChange={(e) => setWithdrawNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="3"
                  placeholder="Informations supplémentaires..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={withdrawMutation.isLoading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                >
                  {withdrawMutation.isLoading ? 'Traitement...' : 'Confirmer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancesSection;
