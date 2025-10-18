import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api, endpoints } from '../utils/api';
import toast from 'react-hot-toast';

const OrderTracking = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const tracking = searchParams.get('t');
  const nftId = searchParams.get('nft');

  const verify = async () => {
    try {
      setLoading(true);
      const out = {};
      if (tracking) out.tracking = tracking;
      if (nftId) {
        const res = await api.get(endpoints.blockchain.nftInfo(nftId));
        out.nft = res.data.data;
      }
      setResult(out);
    } catch (e) {
      toast.error(t('orderTracking.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-4">{t('orderTracking.title')}</h1>
        <div className="card">
          <div className="space-y-2 text-sm text-gray-700">
            <div>{t('orderTracking.tracking')}: {tracking || '—'}</div>
            <div>{t('orderTracking.nft')}: {nftId || '—'}</div>
          </div>
          <button className="btn btn-primary mt-4" onClick={verify} disabled={loading}>
            {loading ? t('orderTracking.verifying') : t('orderTracking.verify')}
          </button>
          {result && (
            <div className="mt-4">
              {result.nft ? (
                <div className="text-sm">
                  <div className="font-semibold mb-2">{t('orderTracking.authenticity')}</div>
                  <div>{t('orderTracking.product')}: {result.nft.name}</div>
                  <div>{t('orderTracking.origin')}: {result.nft.traceability?.origin?.country}{result.nft.traceability?.origin?.region ? `, ${result.nft.traceability.origin.region}` : ''}</div>
                  <div>{t('orderTracking.harvest')}: {result.nft.traceability?.harvestDate || '—'}</div>
                </div>
              ) : (
                <div className="text-sm text-gray-600">{t('orderTracking.noData')}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
