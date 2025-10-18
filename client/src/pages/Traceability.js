import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { api, endpoints } from '../utils/api';

const Traceability = () => {
  const { t } = useTranslation();
  const { nftId } = useParams();

  const { data, isLoading, isError } = useQuery(['nft', nftId], async () => {
    const res = await api.get(endpoints.blockchain.nftInfo(nftId));
    return res.data.data;
  });

  if (isLoading) return <div className="max-w-5xl mx-auto p-6">{t('traceability.loading')}</div>;
  if (isError || !data) return <div className="max-w-5xl mx-auto p-6 text-red-600">{t('traceability.notFound')}</div>;

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-4">{t('traceability.title')}</h1>
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="h-56 bg-gray-200 rounded" />
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-gray-500">{t('traceability.nftId')}</div>
              <div className="font-semibold">{data.nftId}</div>
              <div className="mt-3">
                <div className="text-sm text-gray-500">{t('traceability.name')}</div>
                <div className="font-semibold">{data.name}</div>
              </div>
              <div className="mt-3">
                <div className="text-sm text-gray-500">{t('traceability.description')}</div>
                <div className="text-gray-700">{data.description}</div>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.attributes?.map((a, idx) => (
                  <div key={idx} className="bg-gray-50 border rounded p-3">
                    <div className="text-xs text-gray-500">{a.trait_type}</div>
                    <div className="font-medium">{String(a.value)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Traceability;
