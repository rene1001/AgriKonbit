import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';
import { exportToCSV, exportToPrintableHTML } from '../../utils/export';

const FinancesSection = ({ stats }) => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bank_transfer');
  const [withdrawDestination, setWithdrawDestination] = useState('');
  const [withdrawNotes, setWithdrawNotes] = useState('');
  const [depositAmount, setDepositAmount] = useState('100');
  
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  // Fetch transactions
  const { data: transactionsData } = useQuery(['farmer-transactions'], async () => {
    const res = await api.get(endpoints.farmer.transactions, {
      params: { limit: 20 }
    });
    return res.data.data;
  });

  // Fetch investors
  const { data: investorsData } = useQuery(['farmer-investors'], async () => {
    const res = await api.get(endpoints.farmer.investors, {
      params: { limit: 10 }
    });
    return res.data.data;
  });

  // Withdraw mutation
  const withdrawMutation = useMutation(
    async (data) => {
      const res = await api.post(endpoints.farmer.withdraw, data);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['farmer-stats']);
        queryClient.invalidateQueries(['farmer-transactions']);
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        setWithdrawDestination('');
        setWithdrawNotes('');
        toast.success(t('dashboard.finances.transactions.title')); // keep success toast generic for now
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erreur lors du retrait');
      }
    }
  );

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error(t('dashboard.finances.modal.amount'));
      return;
    }
    if (!withdrawDestination) {
      toast.error(t('dashboard.finances.modal.destination'));
      return;
    }

    withdrawMutation.mutate({
      amount: parseFloat(withdrawAmount),
      method: withdrawMethod,
      destination: withdrawDestination,
      notes: withdrawNotes
    });
  };

  // Deposit functions (similar to InvestorDashboard)
  const afterDeposit = async (amount) => {
    await queryClient.invalidateQueries(['farmer-stats']);
    await queryClient.invalidateQueries(['farmer-transactions']);
    toast.success(`${t('dashboard.finances.deposit.title')} ✓`);
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
      toast.error('Stripe error');
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
      toast.error('PayPal error');
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
      toast.error('MetaMask error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">{t('dashboard.finances.wallet.available')}</span>
            <span className="text-3xl">💰</span>
          </div>
          <p className="text-4xl font-bold mb-1">
            {parseFloat(stats?.wallet?.gyt_balance || 0).toFixed(2)}
          </p>
          <p className="text-sm opacity-75">{t('dashboard.finances.wallet.unit')}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">{t('dashboard.finances.wallet.earned')}</span>
            <span className="text-3xl">📈</span>
          </div>
          <p className="text-4xl font-bold mb-1">
            {parseFloat(stats?.wallet?.total_earned_gyt || 0).toFixed(2)}
          </p>
          <p className="text-sm opacity-75">DOLLAR</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-90">{t('dashboard.finances.wallet.withdrawn')}</span>
            <span className="text-3xl">💸</span>
          </div>
          <p className="text-4xl font-bold mb-1">
            {parseFloat(stats?.wallet?.total_withdrawn_gyt || 0).toFixed(2)}
          </p>
          <p className="text-sm opacity-75">DOLLAR</p>
        </div>
      </div>

      {/* Deposit and Withdraw */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deposit Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.finances.deposit.title')}</h3>
            <p className="text-sm text-gray-600 mt-1">{t('dashboard.finances.deposit.desc')}</p>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('dashboard.finances.deposit.amountLabel')}
              </label>
              <input
                type="number"
                min="1"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="100"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">{t('dashboard.finances.deposit.rate')}</p>
            </div>
            <div className="flex gap-2">
              <button 
                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                onClick={handleStripeDeposit}
                disabled={!depositAmount || parseFloat(depositAmount) <= 0}
              >
                {t('dashboard.finances.deposit.stripe')}
              </button>
              <button 
                className="flex-1 px-3 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition"
                onClick={handlePaypalDeposit}
                disabled={!depositAmount || parseFloat(depositAmount) <= 0}
              >
                {t('dashboard.finances.deposit.paypal')}
              </button>
              <button 
                className="flex-1 px-3 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition"
                onClick={handleMetaMaskDeposit}
                disabled={!depositAmount || parseFloat(depositAmount) <= 0}
              >
                {t('dashboard.finances.deposit.metamask')}
              </button>
            </div>
          </div>
        </div>

        {/* Withdraw Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.finances.withdraw.title')}</h3>
            <p className="text-sm text-gray-600 mt-1">{t('dashboard.finances.withdraw.desc')}</p>
          </div>
          <div className="flex items-center justify-center h-20">
            <button
              onClick={() => setShowWithdrawModal(true)}
              disabled={!stats?.wallet?.gyt_balance || parseFloat(stats.wallet.gyt_balance) <= 0}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                stats?.wallet?.gyt_balance && parseFloat(stats.wallet.gyt_balance) > 0
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t('dashboard.finances.withdraw.cta')}
            </button>
          </div>
        </div>
      </div>

      {/* Revenue Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.finances.revenue.title')}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">{t('dashboard.finances.revenue.projects')}</p>
                <p className="text-2xl font-bold text-green-900">
                  {parseFloat(stats?.projects?.total_funded_gyt || 0).toFixed(2)} DOLLAR
                </p>
              </div>
              <span className="text-3xl">🌱</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">{t('dashboard.finances.revenue.marketplace')}</p>
                <p className="text-2xl font-bold text-blue-900">
                  {parseFloat(stats?.orders?.total_revenue_gyt || 0).toFixed(2)} DOLLAR
                </p>
              </div>
              <span className="text-3xl">🛒</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.finances.investors.title')}</h3>
          <div className="space-y-3">
            {investorsData?.investors?.slice(0, 5).map((investor) => (
              <div key={investor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{investor.full_name}</p>
                  <p className="text-xs text-gray-600">{investor.country}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{investor.total_invested_gyt} {t('dashboard.finances.investors.investedUnit')}</p>
                  <p className="text-xs text-gray-600">{investor.investment_count} {t('dashboard.finances.investors.count')}</p>
                </div>
              </div>
            ))}
            {(!investorsData?.investors || investorsData.investors.length === 0) && (
              <div className="text-center text-gray-500 py-4">
                {t('dashboard.finances.investors.none')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transactions History */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.finances.transactions.title')}</h3>
          <div className="flex gap-2">
            <button
              type="button"
              className="px-3 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200"
              title={t('dashboard.finances.transactions.exportCsv')}
              onClick={() => {
                const rows = (transactionsData?.transactions || []).map(t => ({
                  id: t.id,
                  type: t.type,
                  description: t.description,
                  amount_gyt: t.amount_gyt,
                  status: t.status,
                  created_at: t.created_at
                }));
                if (!rows.length) return toast.error(t('dashboard.finances.transactions.csvEmpty'));
                exportToCSV('transactions', rows);
              }}
            >
              {t('dashboard.finances.transactions.exportCsv')}
            </button>
            <button
              type="button"
              className="px-3 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200"
              title={t('dashboard.finances.transactions.exportPdf')}
              onClick={() => {
                const rows = (transactionsData?.transactions || []);
                if (!rows.length) return toast.error(t('dashboard.finances.transactions.csvEmpty'));
                const html = `
                  <h1>${t('dashboard.finances.transactions.title')}</h1>
                  <table>
                    <thead><tr>
                      <th>ID</th><th>${t('dashboard.finances.transactions.table.type')}</th><th>${t('dashboard.finances.transactions.table.description')}</th><th>${t('dashboard.finances.transactions.table.amount')} (${t('dashboard.finances.wallet.unit')})</th><th>${t('dashboard.finances.transactions.table.status')}</th><th>${t('dashboard.finances.transactions.table.date')}</th>
                    </tr></thead>
                    <tbody>
                      ${rows.map(t => `
                        <tr>
                          <td>${t.id}</td>
                          <td>${t.type}</td>
                          <td>${t.description || ''}</td>
                          <td>${t.amount_gyt}</td>
                          <td>${t.status}</td>
                          <td>${new Date(t.created_at).toLocaleString()}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>`;
                exportToPrintableHTML(t('dashboard.finances.transactions.title'), html);
              }}
            >
              {t('dashboard.finances.transactions.exportPdf')}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('dashboard.finances.transactions.table.type')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('dashboard.finances.transactions.table.description')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('dashboard.finances.transactions.table.amount')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('dashboard.finances.transactions.table.status')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('dashboard.finances.transactions.table.date')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactionsData?.transactions?.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      transaction.type === 'deposit' ? 'bg-green-100 text-green-800' :
                      transaction.type === 'withdrawal' ? 'bg-red-100 text-red-800' :
                      transaction.type === 'payment' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{transaction.description}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {transaction.amount_gyt} DOLLAR
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      transaction.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!transactionsData?.transactions || transactionsData.transactions.length === 0) && (
            <div className="text-center text-gray-500 py-8">
              {t('dashboard.finances.transactions.none')}
            </div>
          )}
      </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{t('dashboard.finances.modal.withdrawTitle')}</h3>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('dashboard.finances.modal.amount')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={stats?.wallet?.gyt_balance || 0}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t('dashboard.finances.modal.available')}: {parseFloat(stats?.wallet?.gyt_balance || 0).toFixed(2)} {t('dashboard.finances.wallet.unit')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('dashboard.finances.modal.method')}</label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="bank_transfer">{t('dashboard.finances.modal.methods.bank')}</option>
                  <option value="mobile_money">{t('dashboard.finances.modal.methods.mobile')}</option>
                  <option value="crypto_wallet">{t('dashboard.finances.modal.methods.crypto')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('dashboard.finances.modal.destination')}</label>
                <input
                  type="text"
                  value={withdrawDestination}
                  onChange={(e) => setWithdrawDestination(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 0x123... / 12345678"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('dashboard.finances.modal.notes')}</label>
                <textarea
                  value={withdrawNotes}
                  onChange={(e) => setWithdrawNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="3"
                  placeholder={t('dashboard.finances.modal.notesPh')}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  {t('dashboard.finances.modal.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={withdrawMutation.isLoading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                >
                  {withdrawMutation.isLoading ? t('dashboard.finances.modal.processing') : t('dashboard.finances.modal.confirm')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancesSection;
