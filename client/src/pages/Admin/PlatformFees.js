import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

const PlatformFees = () => {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [withdrawalFeePct, setWithdrawalFeePct] = useState('0');
  const [distributionFeePct, setDistributionFeePct] = useState('0');
  const [projectWithdrawalFeePct, setProjectWithdrawalFeePct] = useState('0');
  const [minWithdrawalAmount, setMinWithdrawalAmount] = useState('10');

  // Fetch current settings
  const { data: settings, isLoading } = useQuery(
    ['platform-fees'],
    async () => {
      const res = await api.get('/admin/settings/fees');
      return res.data.data;
    },
    {
      onSuccess: (data) => {
        setWithdrawalFeePct(data.withdrawalFeePct?.toString() || '0');
        setDistributionFeePct(data.distributionFeePct?.toString() || '0');
        setProjectWithdrawalFeePct(data.projectWithdrawalFeePct?.toString() || '0');
        setMinWithdrawalAmount(data.minWithdrawalAmount?.toString() || '10');
      }
    }
  );

  // Update settings mutation
  const updateMutation = useMutation(
    async (data) => {
      return api.put('/admin/settings/fees', data);
    },
    {
      onSuccess: () => {
        toast.success('Frais de plateforme mis à jour avec succès');
        qc.invalidateQueries(['platform-fees']);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const wFeePct = parseFloat(withdrawalFeePct);
    const dFeePct = parseFloat(distributionFeePct);
    const pFeePct = parseFloat(projectWithdrawalFeePct);
    const minAmount = parseFloat(minWithdrawalAmount);

    if (isNaN(wFeePct) || wFeePct < 0 || wFeePct > 100) {
      return toast.error('Le pourcentage de frais de retrait doit être entre 0 et 100');
    }

    if (isNaN(dFeePct) || dFeePct < 0 || dFeePct > 100) {
      return toast.error('Le pourcentage de frais de distribution doit être entre 0 et 100');
    }

    if (isNaN(pFeePct) || pFeePct < 0 || pFeePct > 100) {
      return toast.error('Le pourcentage de frais de retrait de projet doit être entre 0 et 100');
    }

    if (isNaN(minAmount) || minAmount < 0) {
      return toast.error('Le montant minimum doit être positif');
    }

    updateMutation.mutate({
      withdrawalFeePct: wFeePct,
      distributionFeePct: dFeePct,
      projectWithdrawalFeePct: pFeePct,
      minWithdrawalAmount: minAmount
    });
  };

  const calculateExamples = () => {
    const investorWithdrawal = 1000;
    const investorFee = (investorWithdrawal * parseFloat(withdrawalFeePct || 0)) / 100;
    const investorNet = investorWithdrawal - investorFee;

    const returnAmount = 1500;
    const distributionFee = (returnAmount * parseFloat(distributionFeePct || 0)) / 100;
    const returnNet = returnAmount - distributionFee;

    const projectWithdrawal = 5000;
    const projectFee = (projectWithdrawal * parseFloat(projectWithdrawalFeePct || 0)) / 100;
    const projectNet = projectWithdrawal - projectFee;

    return { investorWithdrawal, investorFee, investorNet, returnAmount, distributionFee, returnNet, projectWithdrawal, projectFee, projectNet };
  };

  const examples = calculateExamples();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
          <Link 
            to="/admin" 
            className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Retour au Dashboard Admin</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">⚙️ Gestion des Frais de Plateforme</h1>
          <p className="text-gray-600 mt-2">Configurez tous les frais et commissions de la plateforme</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Withdrawal Fee Percentage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frais de Retrait Investisseur (%)
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
                      Frais sur les retraits d'investisseurs
                    </p>
                  </div>

                  {/* Distribution Fee Percentage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frais de Distribution des Retours (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={distributionFeePct}
                        onChange={(e) => setDistributionFeePct(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                      <span className="absolute right-4 top-3 text-gray-500">%</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Frais sur la distribution des gains aux investisseurs
                    </p>
                  </div>

                  {/* Project Withdrawal Fee Percentage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frais de Retrait de Projet (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={projectWithdrawalFeePct}
                        onChange={(e) => setProjectWithdrawalFeePct(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                      <span className="absolute right-4 top-3 text-gray-500">%</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Frais sur les retraits de fonds de projet par les agriculteurs
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

            {/* Examples */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Investor Withdrawal Example */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Retrait Investisseur</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Montant</span>
                    <span className="text-xl font-bold">${examples.investorWithdrawal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-blue-100">
                    <span className="text-sm">Frais ({withdrawalFeePct}%)</span>
                    <span className="font-semibold">- ${examples.investorFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-blue-400 pt-3">
                    <div className="flex justify-between items-center">
                      <span>Net reçu</span>
                      <span className="text-2xl font-bold">${examples.investorNet.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Distribution Example */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Distribution Retours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Retour brut</span>
                    <span className="text-xl font-bold">${examples.returnAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-purple-100">
                    <span className="text-sm">Frais ({distributionFeePct}%)</span>
                    <span className="font-semibold">- ${examples.distributionFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-purple-400 pt-3">
                    <div className="flex justify-between items-center">
                      <span>Net investi</span>
                      <span className="text-2xl font-bold">${examples.returnNet.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Withdrawal Example */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-sm p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Retrait Projet</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Montant</span>
                    <span className="text-xl font-bold">${examples.projectWithdrawal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-100">
                    <span className="text-sm">Frais ({projectWithdrawalFeePct}%)</span>
                    <span className="font-semibold">- ${examples.projectFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-emerald-400 pt-3">
                    <div className="flex justify-between items-center">
                      <span>Net agriculteur</span>
                      <span className="text-2xl font-bold">${examples.projectNet.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="text-2xl">ℹ️</div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Informations sur les Frais</h4>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li><strong>Frais de retrait investisseur:</strong> Appliqués lorsqu'un investisseur retire ses fonds</li>
                    <li><strong>Frais de distribution:</strong> Prélevés sur les retours distribués aux investisseurs après la fin d'un projet</li>
                    <li><strong>Frais de retrait de projet:</strong> Appliqués lorsqu'un agriculteur retire les fonds collectés pour son projet</li>
                    <li><strong>Montant minimum:</strong> Empêche les retraits trop petits qui génèrent des frais disproportionnés</li>
                    <li>• Les modifications prennent effet immédiatement pour toutes les nouvelles transactions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Current Settings Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Paramètres Actuels</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Retrait investisseur</p>
                  <p className="text-2xl font-bold text-blue-600">{settings?.withdrawalFeePct}%</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Distribution retours</p>
                  <p className="text-2xl font-bold text-purple-600">{settings?.distributionFeePct}%</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Retrait projet</p>
                  <p className="text-2xl font-bold text-emerald-600">{settings?.projectWithdrawalFeePct}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Montant minimum</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${parseFloat(settings?.minWithdrawalAmount || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Revenue Estimation */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💰</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-900 mb-2">Estimation des Revenus de Plateforme</h4>
                  <p className="text-sm text-amber-800 mb-3">
                    Les frais configurés génèrent des revenus pour la plateforme à chaque transaction.
                    Assurez-vous que les taux sont équitables pour maintenir la confiance des utilisateurs.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-gray-600">Sur $10,000 de retraits investisseurs</p>
                      <p className="text-lg font-bold text-amber-700">
                        ${((10000 * parseFloat(withdrawalFeePct || 0)) / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-gray-600">Sur $50,000 de distributions</p>
                      <p className="text-lg font-bold text-amber-700">
                        ${((50000 * parseFloat(distributionFeePct || 0)) / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-gray-600">Sur $30,000 de retraits projets</p>
                      <p className="text-lg font-bold text-amber-700">
                        ${((30000 * parseFloat(projectWithdrawalFeePct || 0)) / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatformFees;
