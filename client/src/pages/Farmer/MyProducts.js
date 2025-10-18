import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';
import BackButton from '../../components/common/BackButton';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import { parseImagesArray, resolveImageUrl } from '../../utils/images';

const MyProducts = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery(['farmer-products-page'], async () => {
    const res = await api.get(endpoints.products.farmerProducts, { params: { limit: 50 } });
    return res.data?.data || { products: [], pagination: {} };
  });

  const products = data?.products || [];

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Mes Produits</h1>
          <BackButton />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          {isLoading ? (
            <div>{t('farmer.myProducts.loading')}</div>
          ) : products.length === 0 ? (
            <div className="text-gray-500 text-center py-12">{t('farmer.myProducts.noProducts')}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="border rounded-lg p-4">
                  <div className="h-32 bg-gray-100 rounded mb-3 overflow-hidden">
                    {(() => {
                      const imgs = parseImagesArray(p.images);
                      const main = resolveImageUrl(imgs[0]);
                      return (
                        <ImageWithFallback
                          src={main}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      );
                    })()}
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{p.name}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${p.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{p.is_active ? 'Actif' : 'Inactif'}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{p.description}</p>
                  <div className="flex gap-2">
                    <Link to={`/marketplace/${p.id}`} className="flex-1 px-3 py-2 bg-green-600 text-white text-sm text-center rounded">Voir</Link>
                    <Link to={`/farmer/edit-product/${p.id}`} className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 text-sm text-center rounded">{t('farmer.myProducts.edit')}</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProducts;
