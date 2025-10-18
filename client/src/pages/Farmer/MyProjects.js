import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';

const MyProjects = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useQuery(['farmer-projects'], async () => {
    const res = await api.get(endpoints.projects.farmerProjects);
    return res.data.data;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('farmer.myProjects.loading')}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{t('farmer.myProjects.loadError')}</h2>
          <p className="text-gray-600 mb-4">{t('farmer.myProjects.unableToLoad')}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const projects = data?.projects || [];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      validated: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-purple-100 text-purple-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      validated: 'Validé',
      active: 'Actif',
      completed: 'Terminé',
      rejected: 'Rejeté',
      cancelled: 'Annulé'
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('farmer.myProjects.title')}</h1>
            <p className="text-gray-600 mt-2">{t('farmer.myProjects.subtitle')}</p>
          </div>
          <Link
            to="/farmer/submit-project"
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            + Nouveau Projet
          </Link>
        </div>

        {/* Stats Summary */}
        {projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-2">{t('farmer.myProjects.totalProjects')}</p>
              <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-2">{t('farmer.myProjects.activeProjects')}</p>
              <p className="text-3xl font-bold text-green-600">
                {projects.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-2">En Attente</p>
              <p className="text-3xl font-bold text-yellow-600">
                {projects.filter(p => p.status === 'pending').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-2">{t('farmer.myProjects.totalBudget')}</p>
              <p className="text-3xl font-bold text-emerald-600">
                {projects.reduce((sum, p) => sum + parseFloat(p.budget_gyt || 0), 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">DOLLAR</p>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('farmer.myProjects.noProjects')}</h3>
            <p className="text-gray-600 mb-6">{t('farmer.myProjects.createFirst')}</p>
            <Link
              to="/farmer/submit-project"
              className="inline-block px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              Créer mon premier projet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const images = typeof project.images === 'string' ? JSON.parse(project.images || '[]') : (project.images || []);
              const firstImage = images[0] || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400';
              const fundingPercentage = ((parseFloat(project.funded_amount_gyt) / parseFloat(project.budget_gyt)) * 100).toFixed(1);

              return (
                <div key={project.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={firstImage}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400';
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {getStatusLabel(project.status)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Stats */}
                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{t('farmer.myProjects.funding')}</span>
                          <span className="font-semibold text-emerald-600">{fundingPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-emerald-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">{t('dashboardComponents.projects.budget')}</p>
                          <p className="font-semibold text-gray-900">{parseFloat(project.budget_gyt).toLocaleString()} DOLLAR</p>
                        </div>
                        <div>
                          <p className="text-gray-500">{t('farmer.myProjects.collected')}</p>
                          <p className="font-semibold text-emerald-600">{parseFloat(project.funded_amount_gyt).toLocaleString()} DOLLAR</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Investisseurs</p>
                          <p className="font-semibold text-gray-900">{project.investor_count || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Retour estimé</p>
                          <p className="font-semibold text-blue-600">{project.estimated_return_pct}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        to={`/farmer/projects/${project.id}/manage`}
                        className="flex-1 px-4 py-2 bg-emerald-600 text-white text-center rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                      >
                        Gérer
                      </Link>
                      {project.status === 'pending' && (
                        <Link
                          to={`/farmer/projects/${project.id}/edit`}
                          className="flex-1 px-4 py-2 bg-gray-600 text-white text-center rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                          Modifier
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
