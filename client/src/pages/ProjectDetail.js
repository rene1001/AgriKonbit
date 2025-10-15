import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api, endpoints } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import ImageWithFallback from '../components/common/ImageWithFallback';
import { parseImagesArray, resolveImageUrl } from '../utils/images';

const ProjectDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState(50);

  const { data, isLoading, isError } = useQuery(['project', id], async () => {
    const res = await api.get(endpoints.projects.detail(id));
    return res.data.data;
  });

  const investMutation = useMutation(
    async ({ amountGyt }) => {
      return api.post(endpoints.investments.create, {
        projectId: Number(id),
        amountGyt,
        paymentMethod: 'gyt_wallet',
      });
    },
    {
      onSuccess: () => {
        toast.success(t('projectDetail.investOk'));
        queryClient.invalidateQueries(['project', id]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || t('projectDetail.investFail'));
      }
    }
  );

  if (isLoading) return <div className="max-w-7xl mx-auto p-6">{t('projectDetail.loading')}</div>;
  if (isError || !data) return <div className="max-w-7xl mx-auto p-6 text-red-600">{t('projectDetail.loadError')}</div>;

  const project = data;

  const handleInvest = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (amount < 10) {
      toast.error(t('projectDetail.minError'));
      return;
    }
    investMutation.mutate({ amountGyt: Number(amount) });
  };

  return (
    <div className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 hover:text-gray-900 underline"
        >
          {t('projectDetail.back')}
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="h-64 bg-gray-200 rounded-lg mb-6 overflow-hidden">
            {(() => {
              const imgs = parseImagesArray(project.images);
              const main = resolveImageUrl(imgs[0], '/api/placeholder/800/400');
              return (
                <ImageWithFallback
                  src={main}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  fallbackSrc="/api/placeholder/800/400"
                />
              );
            })()}
          </div>
          <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
          <div className="text-gray-600 mb-6">{project.location}</div>
          <p className="text-gray-700 leading-relaxed mb-6">{project.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="card">
              <div className="text-xs text-gray-500">{t('projectDetail.cards.budget')}</div>
              <div className="font-semibold">{project.budget_gyt} DOLLAR</div>
            </div>
            <div className="card">
              <div className="text-xs text-gray-500">{t('projectDetail.cards.return')}</div>
              <div className="font-semibold">{t('projectDetail.cards.returnYearly', { percent: project.estimated_return_pct })}</div>
            </div>
            <div className="card">
              <div className="text-xs text-gray-500">{t('projectDetail.cards.duration')}</div>
              <div className="font-semibold">{t('projectDetail.cards.durationDays', { days: project.duration_days })}</div>
            </div>
            <div className="card">
              <div className="text-xs text-gray-500">{t('projectDetail.cards.progress')}</div>
              <div className="font-semibold">{project.funding_percentage}%</div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-3">{t('projectDetail.updates')}</h3>
            {data.updates?.length ? (
              <ul className="space-y-3">
                {data.updates.map((u) => (
                  <li key={u.id}>
                    <div className="text-sm font-medium">{u.title}</div>
                    <div className="text-sm text-gray-600">{u.content}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 text-sm">{t('projectDetail.noUpdates')}</div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="card">
            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${project.funding_percentage || 0}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{project.funded_amount_gyt} / {project.budget_gyt} DOLLAR</span>
                <span>{project.funding_percentage || 0}%</span>
              </div>
            </div>

            <label className="label">{t('projectDetail.amountLabel')}</label>
            <input
              type="number"
              min="10"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input"
            />
            <button
              className="btn btn-primary w-full mt-3"
              onClick={handleInvest}
              disabled={investMutation.isLoading}
            >
              {investMutation.isLoading ? t('projectDetail.processing') : t('projectDetail.investBtn')}
            </button>

            <div className="text-xs text-gray-500 mt-2">
              {t('projectDetail.minInfo')}
            </div>

            <div className="border-t mt-4 pt-4">
              <Link to="/dashboard" className="text-primary-600 text-sm">{t('projectDetail.goDashboard')}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
