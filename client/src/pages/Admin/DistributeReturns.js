import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

const DistributeReturns = () => {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch completed projects ready for distribution
  const { data: projects, isLoading } = useQuery(
    ['projects-for-distribution'],
    async () => {
      const res = await api.get('/projects?status=completed');
      return res.data.data;
    }
  );

  // Fetch platform fees
  const { data: fees } = useQuery(
    ['platform-fees'],
    async () => {
      const res = await api.get('/admin/settings/fees');
      return res.data.data;
    }
  );

  // Distribute returns mutation
  const distributeMutation = useMutation(
    async (projectId) => {
      return api.post(`/admin/projects/${projectId}/distribute-returns`);
    },
    {
      onSuccess: () => {
        toast.success('Retours distribués avec succès aux investisseurs');
        qc.invalidateQueries(['projects-for-distribution']);
        closeModal();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erreur lors de la distribution');
      }
    }
  );

  const openModal = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const handleDistribute = () => {
    if (selectedProject) {
      distributeMutation.mutate(selectedProject.id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDistribution = (project) => {
    const fundedAmount = parseFloat(project.funded_amount_gyt || 0);
    const returnPct = parseFloat(project.estimated_return_pct || 0);
    const distributionFeePct = parseFloat(fees?.distributionFeePct || 0);
    
    const grossReturn = fundedAmount * (1 + returnPct / 100);
    const platformFee = grossReturn * (distributionFeePct / 100);
    const netReturn = grossReturn - platformFee;
    
    return {
      fundedAmount,
      returnPct,
      grossReturn,
      platformFee,
      netReturn,
      distributionFeePct
    };
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
          <h1 className="text-3xl font-bold text-gray-900">📊 Distribution des Retours</h1>
          <p className="text-gray-600 mt-2">Distribuez les gains aux investisseurs après la fin des projets</p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">ℹ️</div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Comment fonctionne la distribution ?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>1. Les projets complétés avec fonds retirés apparaissent ici</li>
                <li>2. Le système calcule automatiquement les retours basés sur le pourcentage estimé</li>
                <li>3. Les frais de plateforme ({fees?.distributionFeePct || 0}%) sont déduits du montant brut</li>
                <li>4. Chaque investisseur reçoit sa part proportionnelle avec les gains</li>
                <li>5. Le projet passe au statut "finalisé" après la distribution</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Projects List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="space-y-4">
            {projects.filter(p => p.funds_withdrawn).map((project) => {
              const distribution = calculateDistribution(project);
              
              return (
                <div key={project.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Complété
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Montant financé</p>
                          <p className="text-xl font-bold text-gray-900">
                            ${distribution.fundedAmount.toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Rendement estimé</p>
                          <p className="text-xl font-bold text-emerald-600">
                            {distribution.returnPct}%
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Nombre d'investisseurs</p>
                          <p className="text-xl font-bold text-gray-900">
                            {project.investor_count || 0}
                          </p>
                        </div>
                      </div>

                      {/* Distribution Calculation */}
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Calcul de Distribution</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Montant investi total</span>
                            <span className="font-medium">${distribution.fundedAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Rendement ({distribution.returnPct}%)</span>
                            <span className="font-medium text-emerald-600">
                              + ${(distribution.grossReturn - distribution.fundedAmount).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between border-t border-gray-300 pt-2">
                            <span className="text-gray-600">Retour brut total</span>
                            <span className="font-bold">${distribution.grossReturn.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>Frais de plateforme ({distribution.distributionFeePct}%)</span>
                            <span className="font-medium">- ${distribution.platformFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between border-t border-emerald-300 pt-2">
                            <span className="font-semibold text-gray-900">Retour net à distribuer</span>
                            <span className="font-bold text-emerald-600 text-lg">
                              ${distribution.netReturn.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Date de fin:</span> {formatDate(project.end_date)}
                        </div>
                        <div>
                          <span className="font-medium">Fonds retirés:</span> {formatDate(project.withdrawn_at)}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      <button
                        onClick={() => openModal(project)}
                        className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium shadow-sm"
                      >
                        Distribuer les Retours
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun projet à distribuer</h3>
            <p className="text-gray-600">
              Tous les projets complétés ont déjà été distribués ou aucun projet n'est prêt pour la distribution
            </p>
          </div>
        )}

        {/* Confirmation Modal */}
        {showModal && selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
              <h3 className="text-2xl font-bold mb-4">Confirmer la Distribution</h3>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Vous êtes sur le point de distribuer les retours aux investisseurs du projet :
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{selectedProject.title}</h4>
                  
                  {(() => {
                    const dist = calculateDistribution(selectedProject);
                    return (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nombre d'investisseurs</span>
                          <span className="font-medium">{selectedProject.investor_count || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Montant total investi</span>
                          <span className="font-medium">${dist.fundedAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rendement</span>
                          <span className="font-medium text-emerald-600">{dist.returnPct}%</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-300 pt-2">
                          <span className="text-gray-600">Retour brut</span>
                          <span className="font-bold">${dist.grossReturn.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span>Frais de plateforme ({dist.distributionFeePct}%)</span>
                          <span className="font-medium">- ${dist.platformFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t border-emerald-300 pt-2">
                          <span className="font-semibold">Retour net total</span>
                          <span className="font-bold text-emerald-600 text-lg">
                            ${dist.netReturn.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <span className="text-xl">⚠️</span>
                    <div className="text-sm text-amber-800">
                      <p className="font-semibold mb-1">Attention :</p>
                      <ul className="space-y-1">
                        <li>• Cette action est irréversible</li>
                        <li>• Les fonds seront crédités immédiatement sur les comptes des investisseurs</li>
                        <li>• Le projet passera au statut "finalisé"</li>
                        <li>• Les investisseurs recevront une notification</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDistribute}
                  disabled={distributeMutation.isLoading}
                  className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {distributeMutation.isLoading ? 'Distribution en cours...' : 'Confirmer la Distribution'}
                </button>
                <button
                  onClick={closeModal}
                  disabled={distributeMutation.isLoading}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium disabled:opacity-50"
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

export default DistributeReturns;
