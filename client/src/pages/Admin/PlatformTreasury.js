import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

const PlatformTreasury = () => {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawNotes, setWithdrawNotes] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch treasury balance
  const { data: treasury, isLoading: loadingTreasury } = useQuery(
    ['platform-treasury'],
    async () => {
      const res = await api.get('/treasury');
      return res.data.data;
    }
  );

  // Fetch treasury stats
  const { data: stats } = useQuery(
    ['treasury-stats'],
    async () => {
      const res = await api.get('/treasury/stats');
      return res.data.data;
    }
  );

  // Fetch transactions
  const { data: transactionsData, isLoading: loadingTransactions } = useQuery(
    ['treasury-transactions', filterType, currentPage],
    async () => {
      const res = await api.get(`/treasury/transactions?type=${filterType}&page=${currentPage}&limit=20`);
      return res.data.data;
    }
  );

  // Withdraw mutation
  const withdrawMutation = useMutation(
    async (data) => {
      return api.post('/treasury/withdraw', data);
    },
    {
      onSuccess: () => {
        toast.success('Retrait effectué avec succès');
        qc.invalidateQueries(['platform-treasury']);
        qc.invalidateQueries(['treasury-transactions']);
        qc.invalidateQueries(['treasury-stats']);
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        setWithdrawNotes('');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erreur lors du retrait');
      }
    }
  );

  const handleWithdraw = (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    
    if (!amount || amount <= 0) {
      toast.error('Montant invalide');
      return;
    }

    if (amount > parseFloat(treasury?.balance_usd || 0)) {
      toast.error('Solde insuffisant');
      return;
    }

    withdrawMutation.mutate({ amount, notes: withdrawNotes });
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'fee_collection': return 'Collecte de frais';
      case 'admin_withdrawal': return 'Retrait admin';
      case 'adjustment': return 'Ajustement';
      default: return type;
    }
  };

  const getSourceLabel = (source) => {
    switch (source) {
      case 'withdrawal_fee': return 'Frais de retrait';
      case 'distribution_fee': return 'Frais de distribution';
      case 'project_withdrawal_fee': return 'Frais retrait projet';
      default: return source || '-';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with back button */}
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
          <h1 className="text-3xl font-bold text-gray-900">💰 Trésorerie de la Plateforme</h1>
          <p className="text-gray-600 mt-2">Gérez les fonds collectés via les frais de la plateforme</p>
        </div>

        {/* Treasury Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border-2 border-emerald-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Solde Actuel</span>
              <span className="text-2xl">💵</span>
            </div>
            <div className="text-3xl font-bold text-emerald-600">
              ${parseFloat(treasury?.balance_usd || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition"
            >
              Retirer des Fonds
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Frais Collectés</span>
              <span className="text-2xl">📈</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              ${parseFloat(treasury?.total_fees_collected || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Retiré</span>
              <span className="text-2xl">💸</span>
            </div>
            <div className="text-3xl font-bold text-gray-600">
              ${parseFloat(treasury?.total_withdrawn || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Fee Stats */}
        {stats?.feeStats && stats.feeStats.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">📊 Répartition des Frais</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.feeStats.map((stat, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">{getSourceLabel(stat.source)}</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${parseFloat(stat.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{stat.count} transactions</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transactions History */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">📋 Historique des Transactions</h2>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
            >
              <option value="all">Tous les types</option>
              <option value="fee_collection">Collecte de frais</option>
              <option value="admin_withdrawal">Retraits admin</option>
              <option value="adjustment">Ajustements</option>
            </select>
          </div>

          {loadingTransactions ? (
            <div className="text-center py-8 text-gray-500">Chargement...</div>
          ) : transactionsData?.transactions?.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Montant</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Solde Après</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactionsData.transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {new Date(tx.created_at).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            tx.type === 'fee_collection' ? 'bg-green-100 text-green-700' :
                            tx.type === 'admin_withdrawal' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {getTypeLabel(tx.type)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {getSourceLabel(tx.source)}
                        </td>
                        <td className={`px-4 py-3 text-sm text-right font-semibold ${
                          tx.type === 'fee_collection' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {tx.type === 'fee_collection' ? '+' : '-'}${parseFloat(tx.amount_usd).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">
                          ${parseFloat(tx.balance_after).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {tx.notes || '-'}
                          {tx.admin_username && <div className="text-xs text-gray-500">Par: {tx.admin_username}</div>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {transactionsData?.pagination && transactionsData.pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} sur {transactionsData.pagination.pages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage >= transactionsData.pagination.pages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">Aucune transaction</div>
          )}
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Retirer des Fonds</h3>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant à retirer ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={treasury?.balance_usd || 0}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="0.00"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Solde disponible: ${parseFloat(treasury?.balance_usd || 0).toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optionnel)
                </label>
                <textarea
                  value={withdrawNotes}
                  onChange={(e) => setWithdrawNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  rows="3"
                  placeholder="Raison du retrait..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={withdrawMutation.isLoading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {withdrawMutation.isLoading ? 'Traitement...' : 'Confirmer le Retrait'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowWithdrawModal(false);
                    setWithdrawAmount('');
                    setWithdrawNotes('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformTreasury;
