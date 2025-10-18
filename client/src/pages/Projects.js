import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { api, endpoints } from '../utils/api';
import ImageWithFallback from '../components/common/ImageWithFallback';
import { resolveImageUrl, parseImagesArray } from '../utils/images';
import toast from 'react-hot-toast';

const Projects = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [investingProject, setInvestingProject] = useState(null);
  const [investAmount, setInvestAmount] = useState('');
  const [showInvestModal, setShowInvestModal] = useState(false);

  const handleInvestClick = (project) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Veuillez vous connecter pour investir');
      navigate('/login');
      return;
    }
    setInvestingProject(project);
    setInvestAmount('');
    setShowInvestModal(true);
  };

  const handleInvestSubmit = async () => {
    if (!investAmount || parseFloat(investAmount) <= 0) {
      toast.error('Montant invalide');
      return;
    }

    try {
      await api.post(endpoints.investments.create, {
        projectId: investingProject.id,
        amountGyt: parseFloat(investAmount),
        returnType: 'financial'
      });
      toast.success('Investissement réussi!');
      setShowInvestModal(false);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'investissement');
    }
  };
  const { data, isLoading, isError, error } = useQuery(['projects'], async () => {
    const res = await api.get(endpoints.projects.list, { params: { status: 'validated', limit: 9 } });
    return res.data.data;
  }, {
    retry: 1,
    onError: (err) => {
      console.error('Error loading projects:', err);
      console.error('Error response:', err.response?.data);
    }
  });

  if (isLoading) {
    return <div className="max-w-7xl mx-auto p-6">{t('projectsPage.loading')}</div>;
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-red-600 mb-2">{t('projectsPage.error')}</div>
        <div className="text-sm text-gray-600">
          {error?.response?.data?.message || error?.message || t('projectsPage.unknownError')}
        </div>
      </div>
    );
  }

  const projects = data?.projects || [];

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{t('projectsPage.title')}</h1>
          <div className="text-sm text-gray-600">{t('projectsPage.total', { count: data?.pagination?.total || 0 })}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => {
            const images = parseImagesArray(p.images);
            const mainImage = resolveImageUrl(images[0]);
            
            return (
            <div key={p.id} className="card">
              <div className="h-36 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                <ImageWithFallback
                  src={mainImage}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg mb-1">{p.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">{p.description}</p>
              <div className="text-sm text-gray-600 space-y-1">
                <div>{t('projectsPage.budget', { amount: p.budget_gyt })}</div>
                <div>{t('projectsPage.return', { percent: p.estimated_return_pct })}</div>
                <div>{t('projectsPage.duration', { days: p.duration_days })}</div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${p.funding_percentage || 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{p.funded_amount_gyt} DOLLAR</span>
                  <span>{p.funding_percentage || 0}%</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link 
                  to={`/projects/${p.id}`} 
                  className="flex-1 px-4 py-2 bg-gray-600 text-white text-center rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  {t('projectsPage.details', 'Détails')}
                </Link>
                <button
                  onClick={() => handleInvestClick(p)}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                  💰 Investir
                </button>
              </div>
            </div>
            );
          })}
        </div>

        {/* Modal d'investissement */}
        {showInvestModal && investingProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('projectsPage.investModal.title', { title: investingProject.title })}
              </h2>
              
              <div className="mb-4 p-4 bg-emerald-50 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">{t('projectsPage.investModal.budgetRequired')}</span>
                  <span className="font-semibold">{investingProject.budget_gyt} DOLLAR</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">{t('projectsPage.investModal.alreadyFunded')}</span>
                  <span className="font-semibold text-emerald-600">{investingProject.funded_amount_gyt} DOLLAR</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('projectsPage.investModal.estimatedReturn')}</span>
                  <span className="font-semibold text-blue-600">{investingProject.estimated_return_pct}%</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('projectsPage.investModal.amountLabel')}
                </label>
                <input
                  type="number"
                  min="10"
                  step="0.01"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  placeholder={t('projectsPage.investModal.placeholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {t('projectsPage.investModal.minimum')}
                </p>
              </div>

              {investAmount && parseFloat(investAmount) > 0 && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{t('projectsPage.investModal.yourInvestment')}</span>
                    <span className="font-bold">{parseFloat(investAmount).toLocaleString()} DOLLAR</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('projectsPage.investModal.estimatedReturnCalc', { percent: investingProject.estimated_return_pct })}</span>
                    <span className="font-bold text-emerald-600">
                      {(parseFloat(investAmount) * (1 + investingProject.estimated_return_pct / 100)).toLocaleString()} DOLLAR
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowInvestModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleInvestSubmit}
                  disabled={!investAmount || parseFloat(investAmount) < 10}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
