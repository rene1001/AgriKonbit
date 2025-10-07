import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, endpoints } from '../utils/api';
import toast from 'react-hot-toast';

const OrderTracking = () => {
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
      toast.error('Vérification échouée');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-4">Suivi de commande</h1>
        <div className="card">
          <div className="space-y-2 text-sm text-gray-700">
            <div>Tracking: {tracking || '—'}</div>
            <div>NFT: {nftId || '—'}</div>
          </div>
          <button className="btn btn-primary mt-4" onClick={verify} disabled={loading}>
            {loading ? 'Vérification…' : 'Vérifier l’authenticité'}
          </button>
          {result && (
            <div className="mt-4">
              {result.nft ? (
                <div className="text-sm">
                  <div className="font-semibold mb-2">Authenticité: OK</div>
                  <div>Produit: {result.nft.name}</div>
                  <div>Origine: {result.nft.traceability?.origin?.country}{result.nft.traceability?.origin?.region ? `, ${result.nft.traceability.origin.region}` : ''}</div>
                  <div>Récolte: {result.nft.traceability?.harvestDate || '—'}</div>
                </div>
              ) : (
                <div className="text-sm text-gray-600">Aucune donnée NFT.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
