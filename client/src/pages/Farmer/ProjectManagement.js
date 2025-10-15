import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

const ProjectManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const qc = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'updates' | 'withdrawal'
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState(null);
  
  // Update form state
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [updateImages, setUpdateImages] = useState([]);
  const [isPublic, setIsPublic] = useState(true);

  // Fetch project details
  const { data: project, isLoading: projectLoading } = useQuery(
    ['project', id],
    async () => {
      const res = await api.get(`/api/projects/${id}`);
      return res.data.data;
    }
  );

  // Fetch project updates
  const { data: updates, isLoading: updatesLoading } = useQuery(
    ['project-updates', id],
    async () => {
      const res = await api.get(`/api/farmer/projects/${id}/updates`);
      return res.data.data;
    }
  );

  // Fetch withdrawal requests
  const { data: withdrawalRequests } = useQuery(
    ['withdrawal-requests', id],
    async () => {
      const res = await api.get(`/api/farmer/projects/${id}/withdrawal-requests`);
      return res.data.data;
    }
  );

  // Request withdrawal mutation
  const requestWithdrawalMutation = useMutation(
    async () => {
      return api.post(`/api/farmer/projects/${id}/request-withdrawal`);
    },
    {
      onSuccess: () => {
        toast.success('Demande de retrait envoyée avec succès');
        qc.invalidateQueries(['withdrawal-requests', id]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erreur lors de la demande');
      }
    }
  );

  // Create update mutation
  const createUpdateMutation = useMutation(
    async (data) => {
      return api.post(`/api/farmer/projects/${id}/updates`, data);
    },
    {
      onSuccess: () => {
        toast.success('Mise à jour publiée avec succès');
        qc.invalidateQueries(['project-updates', id]);
        closeUpdateModal();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erreur lors de la publication');
      }
    }
  );

  // Edit update mutation
  const editUpdateMutation = useMutation(
    async ({ updateId, data }) => {
      return api.put(`/api/farmer/projects/${id}/updates/${updateId}`, data);
    },
    {
      onSuccess: () => {
        toast.success('Mise à jour modifiée avec succès');
        qc.invalidateQueries(['project-updates', id]);
        closeUpdateModal();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erreur lors de la modification');
      }
    }
  );

  // Delete update mutation
  const deleteUpdateMutation = useMutation(
    async (updateId) => {
      return api.delete(`/api/farmer/projects/${id}/updates/${updateId}`);
    },
    {
      onSuccess: () => {
        toast.success('Mise à jour supprimée');
        qc.invalidateQueries(['project-updates', id]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
      }
    }
  );

  const openUpdateModal = (update = null) => {
    if (update) {
      setEditingUpdate(update);
      setUpdateTitle(update.title);
      setUpdateContent(update.content);
      setUpdateImages(JSON.parse(update.images || '[]'));
      setIsPublic(update.is_public);
    } else {
      setEditingUpdate(null);
      setUpdateTitle('');
      setUpdateContent('');
      setUpdateImages([]);
      setIsPublic(true);
    }
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setEditingUpdate(null);
    setUpdateTitle('');
    setUpdateContent('');
    setUpdateImages([]);
    setIsPublic(true);
  };

  const handleSubmitUpdate = (e) => {
    e.preventDefault();

    if (updateTitle.trim().length < 5) {
      return toast.error('Le titre doit contenir au moins 5 caractères');
    }

    if (updateContent.trim().length < 20) {
      return toast.error('Le contenu doit contenir au moins 20 caractères');
    }

    const data = {
      title: updateTitle,
      content: updateContent,
      images: updateImages,
      isPublic
    };

    if (editingUpdate) {
      editUpdateMutation.mutate({ updateId: editingUpdate.id, data });
    } else {
      createUpdateMutation.mutate(data);
    }
  };

  const handleRequestWithdrawal = () => {
    if (window.confirm('Êtes-vous sûr de vouloir demander le retrait des fonds de ce projet ?')) {
      requestWithdrawalMutation.mutate();
    }
  };

  const handleDeleteUpdate = (updateId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette mise à jour ?')) {
      deleteUpdateMutation.mutate(updateId);
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

  const canRequestWithdrawal = () => {
    if (!project) return false;
    const fundingPercentage = (parseFloat(project.funded_amount_gyt) / parseFloat(project.budget_gyt)) * 100;
    const hasPendingRequest = withdrawalRequests?.some(req => req.status === 'pending');
    return fundingPercentage >= 100 && !project.funds_withdrawn && !hasPendingRequest;
  };

  if (projectLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Projet non trouvé</h2>
          <button
            onClick={() => navigate('/farmer/my-projects')}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Retour à mes projets
          </button>
        </div>
      </div>
    );
  }

  const fundingPercentage = (parseFloat(project.funded_amount_gyt) / parseFloat(project.budget_gyt)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/farmer/my-projects')}
            className="text-emerald-600 hover:text-emerald-700 mb-4 flex items-center gap-2"
          >
            ← Retour à mes projets
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
          <p className="text-gray-600 mt-2">{project.description}</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-medium transition ${
                activeTab === 'overview'
                  ? 'border-b-2 border-emerald-600 text-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('updates')}
              className={`px-6 py-4 font-medium transition ${
                activeTab === 'updates'
                  ? 'border-b-2 border-emerald-600 text-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mises à jour ({updates?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('withdrawal')}
              className={`px-6 py-4 font-medium transition ${
                activeTab === 'withdrawal'
                  ? 'border-b-2 border-emerald-600 text-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Retrait de fonds
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Project Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <p className="text-sm text-gray-500 mb-2">Budget</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {parseFloat(project.budget_gyt).toLocaleString()} GYT
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <p className="text-sm text-gray-500 mb-2">Financé</p>
                <p className="text-2xl font-bold text-blue-600">
                  {parseFloat(project.funded_amount_gyt).toLocaleString()} GYT
                </p>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">{fundingPercentage.toFixed(1)}%</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <p className="text-sm text-gray-500 mb-2">Investisseurs</p>
                <p className="text-2xl font-bold text-purple-600">{project.investor_count || 0}</p>
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Détails du projet</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Durée</p>
                  <p className="font-medium">{project.duration_days} jours</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rendement estimé</p>
                  <p className="font-medium">{project.estimated_return_pct}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Catégorie</p>
                  <p className="font-medium capitalize">{project.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  <p className="font-medium capitalize">{project.status}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Updates Tab */}
        {activeTab === 'updates' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Mises à jour du projet</h2>
              <button
                onClick={() => openUpdateModal()}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                + Nouvelle mise à jour
              </button>
            </div>

            {updatesLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              </div>
            ) : updates && updates.length > 0 ? (
              <div className="space-y-4">
                {updates.map((update) => (
                  <div key={update.id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{update.title}</h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(update.created_at)}
                          {!update.is_public && (
                            <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              Privé
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openUpdateModal(update)}
                          className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteUpdate(update.id)}
                          className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{update.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune mise à jour</h3>
                <p className="text-gray-600 mb-6">
                  Tenez vos investisseurs informés de l'avancement du projet
                </p>
                <button
                  onClick={() => openUpdateModal()}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                  Créer la première mise à jour
                </button>
              </div>
            )}
          </div>
        )}

        {/* Withdrawal Tab */}
        {activeTab === 'withdrawal' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Retrait de fonds</h2>

            {/* Withdrawal Status */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Statut du financement</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Progression du financement</p>
                  <div className="bg-gray-200 rounded-full h-4 mb-2">
                    <div
                      className="bg-emerald-600 h-4 rounded-full transition-all"
                      style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">{fundingPercentage.toFixed(1)}%</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Montant disponible</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {parseFloat(project.funded_amount_gyt).toLocaleString()} GYT
                  </p>
                </div>
              </div>

              {canRequestWithdrawal() ? (
                <div className="mt-6">
                  <button
                    onClick={handleRequestWithdrawal}
                    disabled={requestWithdrawalMutation.isLoading}
                    className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50"
                  >
                    {requestWithdrawalMutation.isLoading
                      ? 'Envoi en cours...'
                      : 'Demander le retrait des fonds'}
                  </button>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Le retrait sera examiné par un administrateur
                  </p>
                </div>
              ) : (
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    {fundingPercentage < 100
                      ? `Le projet doit être financé à 100% pour demander un retrait (actuellement ${fundingPercentage.toFixed(1)}%)`
                      : project.funds_withdrawn
                      ? 'Les fonds ont déjà été retirés'
                      : 'Une demande de retrait est déjà en cours'}
                  </p>
                </div>
              )}
            </div>

            {/* Withdrawal Requests History */}
            {withdrawalRequests && withdrawalRequests.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Historique des demandes</h3>
                <div className="space-y-4">
                  {withdrawalRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">
                            {parseFloat(request.amount_gyt).toLocaleString()} GYT
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(request.created_at)}</p>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>

                      {request.admin_notes && (
                        <div className="mt-3 bg-gray-50 rounded p-3">
                          <p className="text-sm text-gray-500 mb-1">Notes de l'administrateur</p>
                          <p className="text-gray-900">{request.admin_notes}</p>
                        </div>
                      )}

                      {request.approved_by_name && (
                        <p className="text-sm text-gray-600 mt-2">
                          {request.status === 'approved' ? 'Approuvée' : 'Rejetée'} par{' '}
                          {request.approved_by_name}
                          {request.approved_at && ` le ${formatDate(request.approved_at)}`}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Update Modal */}
        {showUpdateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-6">
                {editingUpdate ? 'Modifier la mise à jour' : 'Nouvelle mise à jour'}
              </h3>

              <form onSubmit={handleSubmitUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={updateTitle}
                    onChange={(e) => setUpdateTitle(e.target.value)}
                    placeholder="Ex: Semaine 1 - Plantation terminée"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">{updateTitle.length}/255 caractères</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenu <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={updateContent}
                    onChange={(e) => setUpdateContent(e.target.value)}
                    placeholder="Décrivez l'avancement du projet..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    rows="6"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {updateContent.length} caractères (minimum 20)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="isPublic" className="text-sm text-gray-700">
                    Visible par les investisseurs
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={createUpdateMutation.isLoading || editUpdateMutation.isLoading}
                    className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50"
                  >
                    {createUpdateMutation.isLoading || editUpdateMutation.isLoading
                      ? 'Enregistrement...'
                      : editingUpdate
                      ? 'Enregistrer les modifications'
                      : 'Publier la mise à jour'}
                  </button>
                  <button
                    type="button"
                    onClick={closeUpdateModal}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManagement;
