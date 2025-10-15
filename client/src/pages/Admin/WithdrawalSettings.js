import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

const WithdrawalSettings = () => {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [withdrawalFeePct, setWithdrawalFeePct] = useState('0');
  const [minWithdrawalAmount, setMinWithdrawalAmount] = useState('10');

  // Fetch current settings
  const { data: settings, isLoading } = useQuery(
    ['withdrawal-settings'],
    async () => {
      const res = await api.get('/admin/settings/withdrawal-fee');
      return res.data.data;
    },
    {
      onSuccess: (data) => {
        setWithdrawalFeePct(data.withdrawalFeePct.toString());
        setMinWithdrawalAmount(data.minWithdrawalAmount.toString());
      }
    }
  );

  // Update settings mutation
  const updateMutation = useMutation(
    async (data) => {
      return api.put('/admin/settings/withdrawal-fee', data);
    },
    {
      onSuccess: () => {
        toast.success('Paramètres mis à jour avec succès');
        qc.invalidateQueries(['withdrawal-settings']);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const feePct = parseFloat(withdrawalFeePct);
    const minAmount = parseFloat(minWithdrawalAmount);

    if (isNaN(feePct) || feePct < 0 || feePct > 100) {
      return toast.error('Le pourcentage de frais doit être entre 0 et 100');
    }

    if (isNaN(minAmount) || minAmount < 0) {
      return toast.error('Le montant minimum doit être positif');
    }

    updateMutation.mutate({
      withdrawalFeePct: feePct,
      minWithdrawalAmount: minAmount
    });
  };

  const calculateExample = () => {
    const amount = 1000;
    const fee = (amount * parseFloat(withdrawalFeePct || 0)) / 100;
    const net = amount - fee;
    return { amount, fee, net };
  };

  const example = calculateExample();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Paramètres de Retrait</h1>
          <p className="text-gray-600 mt-2">Configurez les frais et limites de retrait</p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Settings Form */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Configuration des Frais</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Withdrawal Fee Percentage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pourcentage de Frais de Retrait (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={withdrawalFeePct}
                      onChange={(e) => setWithdrawalFeePct(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                    <span className="absolute right-4 top-3 text-gray-500">%</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Frais appliqués sur chaque retrait (0-100%)
                  </p>
                </div>

                {/* Minimum Withdrawal Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant Minimum de Retrait ($)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={minWithdrawalAmount}
                      onChange={(e) => setMinWithdrawalAmount(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="10.00"
                    />
                    <span className="absolute right-4 top-3 text-gray-500">$</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Montant minimum requis pour effectuer un retrait
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={updateMutation.isLoading}
                  className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateMutation.isLoading ? 'Enregistrement...' : 'Enregistrer les Paramètres'}
                </button>
              </form>
            </div>

            {/* Example Calculation */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Exemple de Calcul</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Montant du retrait</span>
                  <span className="text-2xl font-bold">${example.amount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-emerald-100">
                  <span>Frais ({withdrawalFeePct}%)</span>
                  <span className="text-xl font-semibold">- ${example.fee.toFixed(2)}</span>
                </div>

                <div className="border-t border-emerald-400 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Montant net reçu</span>
                    <span className="text-3xl font-bold">${example.net.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="text-2xl">ℹ️</div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Informations Importantes</h4>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>• Les frais sont appliqués automatiquement lors de chaque retrait</li>
                    <li>• Les utilisateurs verront le montant net avant de confirmer le retrait</li>
                    <li>• Le montant minimum empêche les retraits trop petits</li>
                    <li>• Les modifications prennent effet immédiatement</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Current Settings Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Paramètres Actuels</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Frais de retrait</p>
                  <p className="text-2xl font-bold text-emerald-600">{settings?.withdrawalFeePct}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Montant minimum</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    ${parseFloat(settings?.minWithdrawalAmount || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalSettings;
