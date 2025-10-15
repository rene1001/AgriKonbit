import React from 'react';
import BackButton from '../../components/common/BackButton';

const Support = () => {
  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Support & Communauté</h1>
          <BackButton />
        </div>
        <div className="card">
          <div className="font-semibold mb-2">FAQ</div>
          <ul className="list-disc ml-6 text-sm text-gray-700">
            <li>Paiement avec DOLLAR</li>
            <li>Suivi de livraison</li>
            <li>Traçabilité blockchain</li>
          </ul>
        </div>
        <div className="card opacity-80">
          Historique des tickets (à venir) et intégration chat en direct (placeholder).
        </div>
      </div>
    </div>
  );
};

export default Support;
