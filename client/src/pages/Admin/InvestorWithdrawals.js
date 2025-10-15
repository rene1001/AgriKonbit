import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

const InvestorWithdrawals = () => {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [notes, setNotes] = useState('');
  const [txHash, setTxHash] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch investor withdrawals
  const { data, isLoading } = useQuery(
    ['investor-withdrawals', statusFilter, currentPage],
    async () => {
      const res = await api.get(`/admin/investor-withdrawals?status=${statusFilter}&page=${currentPage}&limit=20`);
      return res.data.data;
    }
  );

  // Approve mutation
  const approveMutation = useMutation(
    async ({ id, txHash, notes }) => {
      return api.post(`/admin/investor-withdrawals/${id}/approve`, { txHash, notes });
    },
    {
      onSuccess: () => {
        toast.success('Retrait approuvé avec succès');
        qc.invalidateQueries(['investor-withdrawals']);
        closeModal();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erreur lors de l\'approbation');
      }
    }
  );

  // Reject mutation
  const rejectMutation = useMutation(
    async ({ id, notes }) => {
      return api.post(`/admin/investor-withdrawals/${id}/reject`, { notes });
    },
    {
      onSuccess: () => {
        toast.success('Retrait rejeté');
        qc.invalidateQueries(['investor-withdrawals']);
        closeModal();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erreur lors du rejet');
      }
    }
  );

  const openModal = (withdrawal, action) => {
    setSelectedWithdrawal(withdrawal);
    setModalAction(action);
    setNotes('');
    setTxHash('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedWithdrawal(null);
    setNotes('');
    setTxHash('');
    setModalAction('');
  };

  const handleSubmit = () => {
    if (modalAction === 'reject' && notes.trim().length < 10) {
      return toast.error('Veuillez fournir une raison pour le rejet (minimum 10 caractères)');
    }

    if (modalAction === 'approve') {
      approveMutation.mutate({ id: selectedWithdrawal.id, txHash, notes });
    } else {
      rejectMutation.mutate({ id: selectedWithdrawal.id, notes });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    const labels = {
      pending: 'En attente',
      processing: 'En traitement',
      completed: 'Complété',
      rejected: 'Rejeté',
      cancelled: 'Annulé'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getMethodLabel = (method) => {
    const methods = {
      bank_transfer: 'Virement bancaire',
      mobile_money: 'Mobile Money',
      crypto_wallet: 'Portefeuille crypto',
      paypal: 'PayPal'
    };
    return methods[method] || method;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Retraits des Investisseurs</h1>
          <p className="text-gray-600 mt-2">Gérez les demandes de retrait des investisseurs</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setStatusFilter('pending'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === 'pending'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => { setStatusFilter('processing'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === 'processing'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En traitement
            </button>
            <button
              onClick={() => { setStatusFilter('completed'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === 'completed'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Complétés
            </button>
            <button
              onClick={() => { setStatusFilter('rejected'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === 'rejected'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejetés
            </button>
            <button
              onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous
            </button>
          </div>
        </div>

        {/* Withdrawals List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        ) : data?.withdrawals && data.withdrawals.length > 0 ? (
          <>
            <div className="space-y-4">
              {data.withdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">{withdrawal.user_name}</h3>
                        {getStatusBadge(withdrawal.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium text-gray-900">{withdrawal.user_email}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Téléphone</p>
                          <p className="font-medium text-gray-900">{withdrawal.user_phone || 'N/A'}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Méthode</p>
                          <p className="font-medium text-gray-900">{getMethodLabel(withdrawal.method)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 bg-gray-50 rounded-lg p-4">
                        <div>
                          <p className="text-sm text-gray-500">Montant demandé</p>
                          <p className="text-xl font-bold text-gray-900">
                            ${parseFloat(withdrawal.amount_gyt).toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Frais ({withdrawal.fee_percentage}%)</p>
                          <p className="text-xl font-bold text-red-600">
                            - ${parseFloat(withdrawal.fee_amount_gyt || 0).toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Montant net</p>
                          <p className="text-xl font-bold text-emerald-600">
                            ${parseFloat(withdrawal.net_amount_gyt || withdrawal.amount_gyt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-500">Destination</p>
                        <p className="text-gray-900 font-mono text-sm bg-gray-100 p-2 rounded">
                          {withdrawal.destination}
                        </p>
                      </div>

                      {withdrawal.notes && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-500">Notes de l'utilisateur</p>
                          <p className="text-gray-900">{withdrawal.notes}</p>
                        </div>
                      )}

                      {withdrawal.admin_notes && (
                        <div className="bg-blue-50 rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-500 mb-1">Notes de l'administrateur</p>
                          <p className="text-gray-900">{withdrawal.admin_notes}</p>
                        </div>
                      )}

                      {withdrawal.tx_hash && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-500">Hash de transaction</p>
                          <p className="text-gray-900 font-mono text-sm bg-gray-100 p-2 rounded break-all">
                            {withdrawal.tx_hash}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Créé:</span> {formatDate(withdrawal.created_at)}
                        </div>
                        {withdrawal.processed_at && (
                          <div>
                            <span className="font-medium">Traité:</span> {formatDate(withdrawal.processed_at)}
                          </div>
                        )}
                      </div>

                      {withdrawal.processed_by_name && (
                        <div className="text-sm text-gray-600 mt-2">
                          Traité par {withdrawal.processed_by_name}
                        </div>
                      )}
                    </div>

                    {withdrawal.status === 'pending' && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => openModal(withdrawal, 'approve')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                        >
                          Approuver
                        </button>
                        <button
                          onClick={() => openModal(withdrawal, 'reject')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                        >
                          Rejeter
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data.pagination && data.pagination.pages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                <span className="px-4 py-2 bg-white rounded-lg border border-gray-300">
                  Page {currentPage} sur {data.pagination.pages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(data.pagination.pages, p + 1))}
                  disabled={currentPage === data.pagination.pages}
                  className="px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun retrait</h3>
            <p className="text-gray-600">
              Aucun retrait d'investisseur pour le moment
            </p>
          </div>
        )}

        {/* Modal */}
        {showModal && selectedWithdrawal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
              <h3 className="text-2xl font-bold mb-4">
                {modalAction === 'approve' ? 'Approuver le retrait' : 'Rejeter le retrait'}
              </h3>

              <div className="mb-4 bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Investisseur:</span> {selectedWithdrawal.user_name}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Montant brut:</span>{' '}
                  <span className="text-gray-900 font-bold">
                    ${parseFloat(selectedWithdrawal.amount_gyt).toLocaleString()}
                  </span>
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Frais:</span>{' '}
                  <span className="text-red-600 font-bold">
                    - ${parseFloat(selectedWithdrawal.fee_amount_gyt || 0).toLocaleString()}
                  </span>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Montant net à transférer:</span>{' '}
                  <span className="text-emerald-600 font-bold text-lg">
                    ${parseFloat(selectedWithdrawal.net_amount_gyt || selectedWithdrawal.amount_gyt).toLocaleString()}
                  </span>
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-medium">Destination:</span>
                  <span className="block font-mono text-sm bg-white p-2 rounded mt-1">
                    {selectedWithdrawal.destination}
                  </span>
                </p>
              </div>

              {modalAction === 'approve' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hash de transaction (optionnel)
                  </label>
                  <input
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
                  />
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes {modalAction === 'reject' && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    modalAction === 'approve'
                      ? 'Notes optionnelles...'
                      : 'Raison du rejet (minimum 10 caractères)...'
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  rows="4"
                />
                {modalAction === 'reject' && (
                  <p className="text-sm text-gray-500 mt-1">
                    {notes.trim().length}/10 caractères minimum
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={approveMutation.isLoading || rejectMutation.isLoading}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                    modalAction === 'approve'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {approveMutation.isLoading || rejectMutation.isLoading
                    ? 'Traitement...'
                    : modalAction === 'approve'
                    ? 'Confirmer l\'approbation'
                    : 'Confirmer le rejet'}
                </button>
                <button
                  onClick={closeModal}
                  disabled={approveMutation.isLoading || rejectMutation.isLoading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium disabled:opacity-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestorWithdrawals;
