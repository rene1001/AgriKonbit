import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { api, endpoints } from '../utils/api';
import { useCart } from '../contexts/CartContext';
import ImageWithFallback from '../components/common/ImageWithFallback';
import { resolveImageUrl, parseImagesArray } from '../utils/images';

const Marketplace = () => {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const [filters, setFilters] = useState({ category: '', origin: '', organic: false, search: '' });

  const { data, isLoading, isError, error, refetch } = useQuery(['products', filters], async () => {
    const res = await api.get(endpoints.products.list, {
      params: {
        category: filters.category || undefined,
        origin: filters.origin || undefined,
        organic: filters.organic ? 'true' : undefined,
        search: filters.search || undefined,
        limit: 12
      }
    });
    return res.data.data;
  }, {
    retry: 1,
    onError: (err) => {
      console.error('Error loading products:', err);
      console.error('Error response:', err.response?.data);
    }
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    refetch();
  };

  if (isLoading) return <div className="max-w-7xl mx-auto p-6">{t('marketplace.loadingProducts')}</div>;
  if (isError) return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-red-600 mb-2">{t('marketplace.loadError')}</div>
      <div className="text-sm text-gray-600">
        {error?.response?.data?.message || error?.message || t('marketplace.unknownError')}
      </div>
    </div>
  );

  const products = data?.products || [];

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <aside className="lg:col-span-1">
          <div className="card">
            <h3 className="font-semibold mb-4">{t('marketplace.filters.title')}</h3>
            <div className="space-y-4">
              <div>
                <label className="label">{t('marketplace.filters.search')}</label>
                <input
                  className="input"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder={t('marketplace.filters.searchPlaceholder')}
                />
              </div>
              <div>
                <label className="label">{t('marketplace.filters.category')}</label>
                <select
                  className="input"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">{t('marketplace.filters.all')}</option>
                  <option value="cereals">{t('marketplace.categories.cereals')}</option>
                  <option value="fruits">{t('marketplace.categories.fruits')}</option>
                  <option value="vegetables">{t('marketplace.categories.vegetables')}</option>
                  <option value="honey">{t('marketplace.categories.honey')}</option>
                  <option value="dairy">{t('marketplace.categories.dairy')}</option>
                  <option value="meat">{t('marketplace.categories.meat')}</option>
                </select>
              </div>
              <div>
                <label className="label">{t('marketplace.filters.originCountry')}</label>
                <input
                  className="input"
                  value={filters.origin}
                  onChange={(e) => handleFilterChange('origin', e.target.value)}
                  placeholder={t('marketplace.filters.originPlaceholder')}
                />
              </div>
              <div className="flex items-center">
                <input
                  id="organic"
                  type="checkbox"
                  className="mr-2"
                  checked={filters.organic}
                  onChange={(e) => handleFilterChange('organic', e.target.checked)}
                />
                <label htmlFor="organic" className="text-sm text-gray-700">{t('marketplace.filters.organicOnly')}</label>
              </div>
            </div>
          </div>
        </aside>

        {/* Products */}
        <section className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => {
              const images = parseImagesArray(p.images);
              const mainImage = resolveImageUrl(images[0]);
              
              return (
              <div key={p.id} className="card">
                <div className="h-36 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <ImageWithFallback
                    src={mainImage}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <div className="text-sm text-gray-600 mt-1">{t('marketplace.product.by')} {p.farmer_name}</div>
                <div className="text-gray-700 mt-2 font-semibold">${Number(p.price_usd).toFixed(2)}</div>
                <div className="text-xs text-gray-500">{p.stock} {t('marketplace.product.inStock')}</div>
                <div className="flex gap-2 mt-4">
                  <Link to={`/marketplace/${p.id}`} className="btn btn-outline flex-1">{t('marketplace.product.details')}</Link>
                  <button className="btn btn-primary flex-1" onClick={() => addItem(p, 1)}>{t('marketplace.product.addToCart')}</button>
                </div>
              </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Marketplace;
