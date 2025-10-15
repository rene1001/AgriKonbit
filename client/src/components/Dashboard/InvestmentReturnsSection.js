import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';

const InvestmentReturnsSection = () => {
  const { t } = useTranslation();

  // Fetch investments with return status
  const { data: investments, isLoading } = useQuery(
    ['my-investments-returns'],
    async () => {
      const res = await api.get('/api/investments/my-investments', {
        params: { limit: 50 }
      });
      return res.data.data.investments;
    }
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReturnStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente' },
      distributed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Distribué' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Complété' }
    };
    const config = badges[status] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getProjectStatusBadge = (status) => {
    const badges = {
      validated: { bg: 'bg-green-100', text: 'text-green-800', label: 'Validé' },
      active: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Actif' },
      completed: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Complété' },
      finalized: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Finalisé' }
    };
    const config = badges[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Calculate statistics
  const stats = {
    totalInvested: investments?.reduce((sum, inv) => sum + parseFloat(inv.amount_gyt), 0) || 0,
    totalReturns: investments?.reduce((sum, inv) => sum + parseFloat(inv.return_amount_gyt || 0), 0) || 0,
    pendingReturns: investments?.filter(inv => inv.return_status === 'pending').length || 0,
    distributedReturns: investments?.filter(inv => inv.return_status === 'distributed').length || 0
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
          <p className="text-sm opacity-90 mb-2">Total Investi</p>
          <p className="text-3xl font-bold">{stats.totalInvested.toLocaleString()} GYT</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
          <p className="text-sm opacity-90 mb-2">Retours Reçus</p>
          <p className="text-3xl font-bold">{stats.totalReturns.toLocaleString()} GYT</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-sm p-6 text-white">
          <p className="text-sm opacity-90 mb-2">En Attente</p>
          <p className="text-3xl font-bold">{stats.pendingReturns}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
          <p className="text-sm opacity-90 mb-2">Distribués</p>
          <p className="text-3xl font-bold">{stats.distributedReturns}</p>
        </div>
      </div>

      {/* Investments List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Mes Investissements</h2>
          <Link 
            to="/projects" 
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm"
          >
            + Investir
          </Link>
        </div>

        {investments && investments.length > 0 ? (
          <div className="space-y-4">
            {investments.map((investment) => (
              <div 
                key={investment.id} 
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link 
                        to={`/projects/${investment.project_id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-emerald-600 transition"
                      >
                        {investment.project_title}
                      </Link>
                      {getProjectStatusBadge(investment.project_status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Agriculteur: {investment.farmer_name}
                    </p>
                  </div>
                  {getReturnStatusBadge(investment.return_status)}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Montant Investi</p>
                    <p className="text-lg font-bold text-blue-600">
                      {parseFloat(investment.amount_gyt).toLocaleString()} GYT
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Rendement Estimé</p>
                    <p className="text-lg font-bold text-gray-900">
                      {investment.estimated_return_pct}%
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Retour Attendu</p>
                    <p className="text-lg font-bold text-purple-600">
                      {(parseFloat(investment.amount_gyt) * (1 + investment.estimated_return_pct / 100)).toLocaleString()} GYT
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Retour Reçu</p>
                    <p className="text-lg font-bold text-green-600">
                      {investment.return_amount_gyt 
                        ? parseFloat(investment.return_amount_gyt).toLocaleString() 
                        : '0'} GYT
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Type de Retour</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {investment.return_type === 'financial' ? 'Financier' : 'Produits'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Investi le {formatDate(investment.created_at)}</span>
                  {investment.returned_at && (
                    <span className="text-green-600 font-medium">
                      Retour reçu le {formatDate(investment.returned_at)}
                    </span>
                  )}
                </div>

                {investment.return_status === 'distributed' && investment.return_amount_gyt && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800">
                      <span className="text-2xl">✅</span>
                      <div>
                        <p className="font-semibold">Retour distribué !</p>
                        <p className="text-sm">
                          Vous avez reçu {parseFloat(investment.return_amount_gyt).toLocaleString()} GYT
                          {investment.return_amount_gyt > investment.amount_gyt && (
                            <span className="ml-2 font-bold">
                              (+{((parseFloat(investment.return_amount_gyt) / parseFloat(investment.amount_gyt) - 1) * 100).toFixed(2)}%)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {investment.return_status === 'pending' && investment.project_status === 'completed' && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <span className="text-2xl">⏳</span>
                      <div>
                        <p className="font-semibold">En attente de distribution</p>
                        <p className="text-sm">
                          Le projet est complété. L'administrateur va bientôt distribuer les retours.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun investissement
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez à investir dans des projets agricoles
            </p>
            <Link 
              to="/projects" 
              className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              Découvrir les projets
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentReturnsSection;
