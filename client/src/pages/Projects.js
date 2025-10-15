import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { api, endpoints } from '../utils/api';
import ImageWithFallback from '../components/common/ImageWithFallback';
import { resolveImageUrl, parseImagesArray } from '../utils/images';

const Projects = () => {
  const { t } = useTranslation();
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
              <Link to={`/projects/${p.id}`} className="btn btn-primary mt-4 w-full">{t('projectsPage.details')}</Link>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Projects;
