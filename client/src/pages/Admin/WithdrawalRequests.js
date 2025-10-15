import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

const WithdrawalRequests = () => {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [notes, setNotes] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(''); // 'approve' | 'reject'

  // Fetch withdrawal requests
  const { data: requests, isLoading } = useQuery(
    ['withdrawal-requests', statusFilter],
    async () => {
      const res = await api.get(`/admin/withdrawal-requests?status=${statusFilter}`);
      return res.data.data;
    }
  );

  // Approve mutation
  const approveMutation = useMutation(
    async ({ id, notes }) => {
      return api.post(`/admin/withdrawal-requests/${id}/approve`, { notes });
    },
    {
      onSuccess: () => {
        toast.success('Demande approuvée avec succès');
        qc.invalidateQueries(['withdrawal-requests']);
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
      return api.post(`/admin/withdrawal-requests/${id}/reject`, { notes });
    },
    {
      onSuccess: () => {
        toast.success('Demande rejetée');
        qc.invalidateQueries(['withdrawal-requests']);
        closeModal();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erreur lors du rejet');
      }
    }
  );

  const openModal = (request, action) => {
    setSelectedRequest(request);
    setModalAction(action);
    setNotes('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setNotes('');
    setModalAction('');
  };

  const handleSubmit = () => {
    if (modalAction === 'reject' && notes.trim().length < 10) {
      return toast.error('Veuillez fournir une raison pour le rejet (minimum 10 caractères)');
    }

    if (modalAction === 'approve') {
      approveMutation.mutate({ id: selectedRequest.id, notes });
    } else {
      rejectMutation.mutate({ id: selectedRequest.id, notes });
    }
  };

  const formatDate = (dateString) => {
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
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    const labels = {
      pending: 'En attente',
      approved: 'Approuvée',
      rejected: 'Rejetée'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
          <h1 className="text-3xl font-bold text-gray-900">💰 Demandes de Retrait de Projet</h1>
          <p className="text-gray-600 mt-2">Gérez les demandes de retrait des agriculteurs</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === 'pending'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === 'approved'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approuvées
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === 'rejected'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejetées
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes
            </button>
          </div>
        </div>

        {/* Requests List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        ) : requests && requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{request.project_title}</h3>
                      {getStatusBadge(request.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Agriculteur</p>
                        <p className="font-medium text-gray-900">{request.farmer_name}</p>
                        <p className="text-sm text-gray-600">{request.farmer_email}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Montant demandé</p>
                        <p className="text-2xl font-bold text-emerald-600">
                          ${parseFloat(request.amount_gyt).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Budget du projet</p>
                        <p className="font-medium text-gray-900">
                          ${parseFloat(request.budget_gyt).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Financé</p>
                        <p className="font-medium text-gray-900">
                          ${parseFloat(request.funded_amount_gyt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-500">Date de demande</p>
                      <p className="text-gray-900">{formatDate(request.created_at)}</p>
                    </div>

                    {request.admin_notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-500 mb-1">Notes de l'administrateur</p>
                        <p className="text-gray-900">{request.admin_notes}</p>
                      </div>
                    )}

                    {request.approved_by_name && (
                      <div className="text-sm text-gray-600">
                        {request.status === 'approved' ? 'Approuvée' : 'Rejetée'} par {request.approved_by_name}
                        {request.approved_at && ` le ${formatDate(request.approved_at)}`}
                      </div>
                    )}
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => openModal(request, 'approve')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                      >
                        Approuver
                      </button>
                      <button
                        onClick={() => openModal(request, 'reject')}
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
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune demande</h3>
            <p className="text-gray-600">
              {statusFilter === 'pending' 
                ? 'Aucune demande en attente pour le moment'
                : `Aucune demande ${statusFilter === 'approved' ? 'approuvée' : statusFilter === 'rejected' ? 'rejetée' : ''}`
              }
            </p>
          </div>
        )}

        {/* Modal */}
        {showModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
              <h3 className="text-2xl font-bold mb-4">
                {modalAction === 'approve' ? 'Approuver la demande' : 'Rejeter la demande'}
              </h3>

              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Projet:</span> {selectedRequest.project_title}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Agriculteur:</span> {selectedRequest.farmer_name}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Montant:</span>{' '}
                  <span className="text-emerald-600 font-bold">
                    ${parseFloat(selectedRequest.amount_gyt).toLocaleString()}
                  </span>
                </p>
              </div>

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

export default WithdrawalRequests;
