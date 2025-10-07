import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';

// Icônes SVG simples
const ChartBarIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const CurrencyDollarIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrendingUpIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const BellIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const ChatBubbleLeftRightIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const Cog6ToothIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const QuestionMarkCircleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ArrowDownTrayIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
  </svg>
);

const EyeIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const FunnelIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const ShareIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const InvestorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [depositAmount, setDepositAmount] = useState(100);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [investModal, setInvestModal] = useState({ open: false, projectId: null, amount: 10 });
  const [withdrawModal, setWithdrawModal] = useState({ open: false, amount: 0, method: 'bank_transfer', destination: '', note: '' });
  const [deliveryModal, setDeliveryModal] = useState({ open: false, investmentId: '', preferredDate: '', address: '', notes: '' });
  const [projectFilters, setProjectFilters] = useState({
    category: '',
    location: '',
    minReturn: '',
    maxReturn: ''
  });
  const [showNotifications, setShowNotifications] = useState(false);

  const { data: me, refetch: refetchMe } = useQuery(['me'], async () => {
    const res = await api.get(endpoints.auth.me);
    return res.data.data.user;
  });

  const { data: stats } = useQuery(['investment-stats'], async () => {
    const res = await api.get(endpoints.investments.stats);
    return res.data.data;
  }, {
    enabled: !!me
  });

  const { data: myInvestments } = useQuery(['my-investments'], async () => {
    const res = await api.get(endpoints.investments.myInvestments);
    return res.data.data.investments || [];
  }, {
    enabled: !!me
  });

  const { data: availableProjects } = useQuery(['available-projects'], async () => {
    const res = await api.get(endpoints.projects.list + '?status=validated');
    return res.data.data.projects || [];
  }, {
    enabled: !!me
  });

  const { data: transactions, refetch: refetchTx } = useQuery(['gyt-transactions'], async () => {
    const res = await api.get(endpoints.blockchain.gytTransactions);
    return res.data.data.transactions || [];
  }, {
    enabled: !!me,
    retry: 1,
    onError: (error) => {
      console.error('Error fetching transactions:', error);
    }
  });

  const { data: notifications } = useQuery(['notifications'], async () => {
    const res = await api.get(endpoints.notifications.list);
    return res.data.data.notifications || [];
  }, {
    enabled: !!me
  });

  const { data: returnsData, refetch: refetchReturns } = useQuery(['returns'], async () => {
    const res = await api.get(endpoints.returns.list);
    return res.data.data.returns || [];
  }, {
    enabled: !!me
  });

  // Derived metrics for returns
  const returnsList = returnsData || [];
  const availableGYT = returnsList
    .filter(r => r.type === 'financial' && r.status === 'available')
    .reduce((sum, r) => sum + Number(r.amount_gyt || 0), 0);
  const inProgressGYT = returnsList
    .filter(r => r.type === 'financial' && (r.status === 'pending'))
    .reduce((sum, r) => sum + Number(r.amount_gyt || 0), 0);
  const totalRelevant = availableGYT + inProgressGYT;
  const inProgressPct = totalRelevant > 0 ? Math.min(Math.round((inProgressGYT / totalRelevant) * 100), 100) : 0;
  // Physical returns aggregation by unit (available)
  const physicalAvailableByUnit = returnsList
    .filter(r => r.type === 'physical' && r.status === 'available')
    .reduce((acc, r) => {
      const unit = (r.unit || '').trim() || 'unités';
      const qty = Number(r.quantity || 0);
      acc[unit] = (acc[unit] || 0) + qty;
      return acc;
    }, {});
  const physicalAvailableSummary = Object.keys(physicalAvailableByUnit).length
    ? Object.entries(physicalAvailableByUnit)
        .map(([unit, qty]) => `${qty} ${unit}`)
        .join(', ')
    : 'Aucun produit physique disponible';

  const afterDeposit = async (amount) => {
    await Promise.all([refetchMe(), refetchTx()]);
    toast.success(`Dépôt de ${amount} GYT effectué`);
  };

  const handleStripeDeposit = async () => {
    try {
      const amount = Number(depositAmount);
      if (amount <= 0) return;
      const intent = await api.post(endpoints.payments.stripe.createIntent, {
        amount,
        currency: 'usd',
        type: 'deposit'
      });
      if (intent.data.success) {
        await api.post(endpoints.payments.stripe.confirm, {
          paymentIntentId: intent.data.data.paymentIntentId,
          amount,
          type: 'deposit'
        });
        await afterDeposit(amount);
      }
    } catch (e) {
      toast.error('Échec du dépôt Stripe');
    }
  };

  const handlePaypalDeposit = async () => {
    try {
      const amount = Number(depositAmount);
      if (amount <= 0) return;
      const order = await api.post(endpoints.payments.paypal.createOrder, {
        amount,
        currency: 'USD',
        type: 'deposit'
      });
      if (order.data.success) {
        await api.post(endpoints.payments.paypal.capture, {
          orderId: order.data.data.orderId,
          amount,
          type: 'deposit'
        });
        await afterDeposit(amount);
      }
    } catch (e) {
      toast.error('Échec du dépôt PayPal');
    }
  };

  const handleMetaMaskDeposit = async () => {
    try {
      const amount = Number(depositAmount);
      if (amount <= 0) return;
      const tx = await api.post(endpoints.payments.metamask.sendTransaction, {
        to: '0x' + 'b'.repeat(40),
        value: amount,
        type: 'deposit'
      });
      if (tx.data.success) {
        await afterDeposit(amount);
      }
    } catch (e) {
      toast.error('Échec du dépôt MetaMask');
    }
  };

  const handleWithdraw = async () => {
    try {
      const amount = Number(withdrawAmount);
      if (amount <= 0 || amount > (me?.gytBalance || 0)) {
        toast.error('Montant invalide');
        return;
      }

      // Ask user for method and destination (simple prompt fallback)
      const method = window.prompt('Méthode (bank_transfer, mobile_money, crypto_wallet):', 'bank_transfer');
      if (!method) return;
      const destination = window.prompt('Destination (IBAN / numéro / adresse):', '');
      if (!destination) return;

      const res = await api.post(endpoints.wallet.withdraw, {
        amount,
        method,
        destination,
        notes: 'Withdrawal requested from investor dashboard'
      });

      if (res.data.success) {
        await refetchMe();
        toast.success(`Retrait de ${amount} GYT effectué`);
        setWithdrawAmount(0);
      }
    } catch (e) {
      toast.error('Échec du retrait');
    }
  };

  const handleInvestInProject = async (projectId, amount) => {
    try {
      const res = await api.post(endpoints.investments.create, {
        projectId,
        amountGyt: amount,
        paymentMethod: 'gyt_wallet',
        returnType: 'financial'
      });

      if (res.data.success) {
        toast.success('Investissement effectué avec succès!');
        await Promise.all([refetchMe(), refetchTx()]);
      }
    } catch (e) {
      toast.error('Échec de l\'investissement');
    }
  };

  const filteredProjects = availableProjects?.filter(project => {
    if (projectFilters.category && project.category !== projectFilters.category) return false;
    if (projectFilters.location && !project.location.toLowerCase().includes(projectFilters.location.toLowerCase())) return false;
    if (projectFilters.minReturn && project.estimated_return_pct < Number(projectFilters.minReturn)) return false;
    if (projectFilters.maxReturn && project.estimated_return_pct > Number(projectFilters.maxReturn)) return false;
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">💰 Dashboard Investisseur</h1>
            <p className="text-gray-600 mt-1">Bienvenue, {me?.full_name}</p>
          </div>

          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <div className="relative">
              <button
                className="p-2 text-gray-400 hover:text-gray-600 relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <BellIcon className="h-6 w-6" />
                {notifications?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}

        {/* Withdraw Gains Modal */}
        {withdrawModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Retirer les gains</h3>
              <div className="space-y-3">
                <label className="block text-sm text-gray-700">Montant (GYT)</label>
                <input
                  type="number"
                  min={1}
                  value={withdrawModal.amount}
                  onChange={(e) => setWithdrawModal({ ...withdrawModal, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <label className="block text-sm text-gray-700">Méthode</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={withdrawModal.method}
                  onChange={(e) => setWithdrawModal({ ...withdrawModal, method: e.target.value })}
                >
                  <option value="bank_transfer">Virement bancaire</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="crypto_wallet">Crypto Wallet</option>
                </select>
                <label className="block text-sm text-gray-700">Destination</label>
                <input
                  type="text"
                  value={withdrawModal.destination}
                  onChange={(e) => setWithdrawModal({ ...withdrawModal, destination: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="IBAN / numéro / adresse"
                />
                <label className="block text-sm text-gray-700">Note (optionnel)</label>
                <input
                  type="text"
                  value={withdrawModal.note}
                  onChange={(e) => setWithdrawModal({ ...withdrawModal, note: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50" onClick={() => setWithdrawModal({ open: false, amount: 0, method: 'bank_transfer', destination: '', note: '' })}>Annuler</button>
                <button
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                  onClick={async () => {
                    try {
                      const amt = Number(withdrawModal.amount);
                      if (!amt || amt <= 0) { toast.error('Montant invalide'); return; }
                      const res = await api.post(endpoints.wallet.withdraw, {
                        amount: amt,
                        method: withdrawModal.method,
                        destination: withdrawModal.destination,
                        notes: withdrawModal.note
                      });
                      if (res.data.success) {
                        toast.success('Demande de retrait envoyée');
                        await Promise.all([refetchMe(), refetchReturns()]);
                        setWithdrawModal({ open: false, amount: 0, method: 'bank_transfer', destination: '', note: '' });
                      }
                    } catch (e) {
                      toast.error('Échec du retrait');
                    }
                  }}
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Delivery Modal */}
        {deliveryModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Planifier une livraison</h3>
              <div className="space-y-3">
                <label className="block text-sm text-gray-700">Investissement</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={deliveryModal.investmentId}
                  onChange={(e) => setDeliveryModal({ ...deliveryModal, investmentId: e.target.value })}
                >
                  <option value="">Sélectionner…</option>
                  {myInvestments?.map(inv => (
                    <option key={inv.id} value={inv.id}>{inv.project_title} (#{inv.id})</option>
                  ))}
                </select>
                <label className="block text-sm text-gray-700">Date préférée</label>
                <input
                  type="date"
                  value={deliveryModal.preferredDate}
                  onChange={(e) => setDeliveryModal({ ...deliveryModal, preferredDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <label className="block text-sm text-gray-700">Adresse</label>
                <input
                  type="text"
                  value={deliveryModal.address}
                  onChange={(e) => setDeliveryModal({ ...deliveryModal, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Adresse complète de livraison"
                />
                <label className="block text-sm text-gray-700">Notes (optionnel)</label>
                <input
                  type="text"
                  value={deliveryModal.notes}
                  onChange={(e) => setDeliveryModal({ ...deliveryModal, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50" onClick={() => setDeliveryModal({ open: false, investmentId: '', preferredDate: '', address: '', notes: '' })}>Annuler</button>
                <button
                  className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700"
                  onClick={async () => {
                    try {
                      if (!deliveryModal.investmentId) { toast.error('Sélectionnez un investissement'); return; }
                      const res = await api.post(endpoints.investments.scheduleDelivery, {
                        investmentId: Number(deliveryModal.investmentId),
                        preferredDate: deliveryModal.preferredDate,
                        address: deliveryModal.address,
                        notes: deliveryModal.notes
                      });
                      if (res.data.success) {
                        toast.success('Demande de livraison envoyée');
                        await refetchReturns();
                        setDeliveryModal({ open: false, investmentId: '', preferredDate: '', address: '', notes: '' });
                      }
                    } catch (e) {
                      toast.error('Impossible de planifier la livraison');
                    }
                  }}
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications?.map((notif, idx) => (
                      <div key={idx} className="p-3 border-b hover:bg-gray-50">
                        <p className="text-sm text-gray-700">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.created_at}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: ChartBarIcon },
              { id: 'investments', label: 'Mes Investissements', icon: TrendingUpIcon },
              { id: 'projects', label: 'Projets Disponibles', icon: PlusIcon },
              { id: 'returns', label: 'Rendements', icon: CurrencyDollarIcon },
              { id: 'communication', label: 'Communication', icon: ChatBubbleLeftRightIcon },
              { id: 'settings', label: 'Paramètres', icon: Cog6ToothIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Portefeuille & Solde */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Solde GYT</p>
                    <p className="text-3xl font-bold">{me?.gytBalance || 0}</p>
                    <p className="text-sm text-green-100">≈ ${me?.gytBalance || 0} USD</p>
                  </div>
                  <CurrencyDollarIcon className="h-12 w-12 text-green-200" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Total Investi</p>
                    <p className="text-2xl font-bold text-gray-900">{Number(stats?.overview?.total_invested_gyt || 0).toFixed(2)}</p>
                    <p className="text-sm text-gray-500">GYT</p>
                  </div>
                  <TrendingUpIcon className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Projets Actifs</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.overview?.active_investments || 0}</p>
                    <p className="text-sm text-green-600">+{stats?.overview?.finished_projects || 0} terminés</p>
                  </div>
                  <ChartBarIcon className="h-8 w-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Rendement Moyen</p>
                    <p className="text-2xl font-bold text-gray-900">8.5%</p>
                    <p className="text-sm text-green-600">Annuel estimé</p>
                  </div>
                  <TrendingUpIcon className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Acheter des GYT
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="Montant en USD"
                      min="1"
                    />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={handleStripeDeposit}
                    >
                      Stripe
                    </button>
                    <button
                      className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                      onClick={handlePaypalDeposit}
                    >
                      PayPal
                    </button>
                    <button
                      className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                      onClick={handleMetaMaskDeposit}
                    >
                      MetaMask
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retirer des GYT
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Montant en GYT"
                      max={me?.gytBalance || 0}
                      min="0"
                    />
                    <button
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      onClick={handleWithdraw}
                      disabled={!withdrawAmount || withdrawAmount > (me?.gytBalance || 0)}
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      Retirer
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Disponible: {me?.gytBalance || 0} GYT
                  </p>
                </div>
              </div>
            </div>

            {/* Historique des transactions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Historique des Transactions</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Montant</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions?.slice(0, 10).map((tx, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(tx.created_at).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            tx.type === 'deposit' ? 'bg-green-100 text-green-800' :
                            tx.type === 'withdrawal' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {tx.type === 'deposit' ? 'Dépôt' :
                             tx.type === 'withdrawal' ? 'Retrait' : 'Investissement'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">
                          {tx.direction === 'in' ? '+' : '-'}{tx.amount} {tx.symbol}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            Confirmé
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'investments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Mes Investissements</h2>
              <div className="flex gap-2">
                <select className="px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Tous les statuts</option>
                  <option value="active">Actifs</option>
                  <option value="completed">Terminés</option>
                  <option value="pending">En attente</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {myInvestments?.map((investment) => (
                <div key={investment.id} className="bg-white rounded-xl p-6 shadow-sm border">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {investment.project_title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      investment.project_status === 'active' ? 'bg-green-100 text-green-800' :
                      investment.project_status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {investment.project_status === 'active' ? 'En cours' :
                       investment.project_status === 'completed' ? 'Terminé' : 'En attente'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Montant investi:</span>
                      <span className="font-medium">{investment.amount_gyt} GYT</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Rendement estimé:</span>
                      <span className="font-medium text-green-600">
                        {investment.estimated_return_pct}%
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Progression:</span>
                      <span className="font-medium">{investment.project_funding_percentage}%</span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(investment.project_funding_percentage, 100)}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Agriculteur: {investment.farmer_name}</span>
                      <span>{investment.project_location}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                      onClick={() => navigate(`/projects/${investment.project_id}`)}
                    >
                      <EyeIcon className="h-4 w-4" />
                      Voir détails
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {(!myInvestments || myInvestments.length === 0) && (
              <div className="text-center py-12">
                <ChartBarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun investissement</h3>
                <p className="text-gray-500 mb-6">Commencez à investir dans des projets agricoles</p>
                <button
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  onClick={() => setActiveTab('projects')}
                >
                  Découvrir les projets
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold">Projets Disponibles</h2>

              <div className="flex flex-wrap gap-2">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  value={projectFilters.category}
                  onChange={(e) => setProjectFilters({...projectFilters, category: e.target.value})}
                >
                  <option value="">Toutes catégories</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="livestock">Élevage</option>
                  <option value="aquaculture">Aquaculture</option>
                </select>

                <input
                  type="text"
                  placeholder="Localisation"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  value={projectFilters.location}
                  onChange={(e) => setProjectFilters({...projectFilters, location: e.target.value})}
                />

                <input
                  type="number"
                  placeholder="Rendement min %"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-32"
                  value={projectFilters.minReturn}
                  onChange={(e) => setProjectFilters({...projectFilters, minReturn: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  {project.images && project.images.length > 0 && (
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                  )}

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {project.title}
                      </h3>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        {project.estimated_return_pct}% ROI
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Budget:</span>
                        <span className="font-medium">{project.budget_gyt} GYT</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Financé:</span>
                        <span className="font-medium">{project.funded_amount_gyt} GYT</span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min((project.funded_amount_gyt / project.budget_gyt) * 100, 100)}%`
                          }}
                        ></div>
                      </div>

                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{project.location}</span>
                        <span>{project.category}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        onClick={() => setInvestModal({ open: true, projectId: project.id, amount: 10 })}
                      >
                        <PlusIcon className="h-4 w-4" />
                        Investir
                      </button>

                      <button
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>

                      <button
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={async () => {
                          const url = `${window.location.origin}/projects/${project.id}`;
                          try {
                            if (navigator.share) {
                              await navigator.share({ title: project.title, text: 'Découvrez ce projet AgriKonbit', url });
                            } else {
                              await navigator.clipboard.writeText(url);
                              toast.success('Lien copié dans le presse-papiers');
                            }
                          } catch (e) {
                            await navigator.clipboard.writeText(url);
                            toast.success('Lien copié');
                          }
                        }}
                      >
                        <ShareIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <FunnelIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</h3>
                <p className="text-gray-500">Essayez de modifier vos filtres de recherche</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'returns' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Suivi des Rendements</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-4">💰 Rendements Disponibles</h3>
                <div className="text-3xl font-bold text-green-600 mb-2">{availableGYT.toFixed(2)} GYT</div>
                <p className="text-sm text-gray-500 mb-4">Prêt à être retiré</p>
                <button
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  onClick={() => setWithdrawModal({ open: true, amount: 0, method: 'bank_transfer', destination: '', note: '' })}
                >
                  Retirer les gains
                </button>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-4">⏳ Rendements en Cours</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">{inProgressGYT.toFixed(2)} GYT</div>
                <p className="text-sm text-gray-500 mb-4">Paiement à venir</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${inProgressPct}%` }}></div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-4">🍯 Produits Physiques</h3>
                <div className="text-lg font-bold text-orange-600 mb-2">{physicalAvailableSummary}</div>
                <p className="text-sm text-gray-500 mb-4">Retours physiques disponibles</p>
                <button
                  className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  onClick={() => setDeliveryModal({ open: true, investmentId: myInvestments?.[0]?.id || '', preferredDate: '', address: '', notes: '' })}
                >
                  Planifier livraison
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">📊 Historique des Rendements</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Projet</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Montant</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Statut</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returnsData && returnsData.length > 0 ? (
                      returnsData.map((ret) => (
                        <tr key={ret.id} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-sm">{ret.project_title}</td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${ret.type === 'financial' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                              {ret.type === 'financial' ? 'Financier' : 'Physique'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm font-medium">
                            {ret.type === 'financial' ? `+${ret.amount_gyt} GYT` : `${ret.quantity} ${ret.unit || ''}`}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{new Date(ret.created_at).toLocaleDateString('fr-FR')}</td>
                          <td className="py-3 px-4 text-sm">
                            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">{ret.status}</span>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <div className="flex gap-2">
                              <button className="text-blue-600 hover:underline" onClick={() => navigate(`/projects/${ret.project_id}`)}>Voir</button>
                              <button
                                className="text-red-600 hover:underline"
                                onClick={async () => {
                                  try {
                                    await api.delete(endpoints.returns.delete(ret.id));
                                    toast.success('Historique supprimé');
                                    await refetchReturns();
                                  } catch (e) {
                                    toast.error('Suppression impossible');
                                  }
                                }}
                              >
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-gray-500 text-sm">Aucun historique de rendements pour le moment.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'communication' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Communication & Engagement</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-4">📨 Messages des Agriculteurs</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">"Récolte excellente cette saison! Merci pour votre soutien. 🌾"</p>
                    <p className="text-xs text-gray-500 mt-1">Jean Dupont - Il y a 2 jours</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">"Photos de la plantation envoyées dans la galerie. 📸"</p>
                    <p className="text-xs text-gray-500 mt-1">Marie Martin - Il y a 5 jours</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">"Les tomates poussent bien grâce à vos investissements! 🍅"</p>
                    <p className="text-xs text-gray-500 mt-1">Pierre Durand - Il y a 1 semaine</p>
                  </div>
                </div>
                <button className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Voir tous les messages
                </button>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-4">🎯 Support & Assistance</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                    Chat en direct
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <QuestionMarkCircleIcon className="h-4 w-4" />
                    FAQ
                  </button>
                  <button className="w-full bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-2">
                    <ShareIcon className="h-4 w-4" />
                    Partager mes investissements
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-4">📰 Newsletters & Témoignages</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Newsletter Septembre 2024</h4>
                  <p className="text-sm text-gray-600 mb-3">Découvrez les dernières nouvelles de nos agriculteurs partenaires...</p>
                  <button className="text-blue-600 text-sm hover:underline">Lire la suite</button>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Témoignage: Culture de Mangues</h4>
                  <p className="text-sm text-gray-600 mb-3">"Grâce aux investisseurs, j'ai pu moderniser mon exploitation..."</p>
                  <button className="text-blue-600 text-sm hover:underline">Voir la vidéo</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Profil & Paramètres</h2>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-4">👤 Informations Personnelles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={me?.full_name || ''} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={me?.email || ''} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={me?.country || ''} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={me?.phone || ''} readOnly />
                </div>
              </div>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Modifier le profil
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-4">🔔 Préférences de Notification</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm text-gray-700">Notifications par email</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm text-gray-700">Notifications push</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" />
                  <span className="text-sm text-gray-700">SMS</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm text-gray-700">Newsletters hebdomadaires</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-4">💳 Moyens de Paiement</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-xs">💳</span>
                    </div>
                    <span className="text-sm">Carte bancaire ****1234</span>
                  </div>
                  <button className="text-blue-600 text-sm hover:underline">Modifier</button>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center">
                      <span className="text-yellow-600 font-bold text-xs">PP</span>
                    </div>
                    <span className="text-sm">PayPal</span>
                  </div>
                  <button className="text-blue-600 text-sm hover:underline">Connecter</button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-4">🌍 Préférences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-2xl leading-tight">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GYT">GYT</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invest Modal */}
        {investModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Confirmer l'investissement</h3>
              <div className="space-y-3">
                <label className="block text-sm text-gray-700">Montant (min 10 GYT)</label>
                <input
                  type="number"
                  min={10}
                  value={investModal.amount}
                  onChange={(e) => setInvestModal({ ...investModal, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="text-sm text-gray-500">Solde disponible: {me?.gytBalance || 0} GYT</div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                  onClick={() => setInvestModal({ open: false, projectId: null, amount: 10 })}
                >
                  Annuler
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                  onClick={async () => {
                    const amt = Number(investModal.amount);
                    if (!investModal.projectId || isNaN(amt) || amt < 10) {
                      toast.error('Montant invalide (minimum 10 GYT)');
                      return;
                    }
                    await handleInvestInProject(investModal.projectId, amt);
                    setInvestModal({ open: false, projectId: null, amount: 10 });
                  }}
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestorDashboard;
