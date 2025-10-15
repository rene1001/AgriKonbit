import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { api, endpoints } from '../utils/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { t } = useTranslation();
  const { items, clearCart, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // GYT-only payments
  const paymentMethod = 'gyt_wallet';
  const [gytBalance, setGytBalance] = useState(null);

  const totalGyt = items.reduce((sum, i) => {
    const unitGyt = Number(i.price_gyt ?? i.priceUsdToGyt ?? 0);
    return sum + unitGyt * Number(i.quantity || 1);
  }, 0);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await api.get(endpoints.blockchain.gytBalance);
        setGytBalance(Number(res.data?.data?.balance || 0));
      } catch (e) {
        setGytBalance(0);
      }
    })();
  }, []);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      // Step 1: Create order on server
      const orderPayload = {
        items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
        paymentMethod,
        shippingAddress: { line1: '123 Demo St', city: 'City', country: 'US' }
      };
      const orderRes = await api.post(endpoints.orders.create, orderPayload);
      if (!orderRes.data.success) throw new Error(t('checkoutPage.createFailed'));

      clearCart();
      toast.success(t('checkoutPage.success'));
      navigate('/dashboard');
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message || t('checkoutPage.failed'));
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-6">{t('checkoutPage.empty')}</div>
    );
  }

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">{t('checkoutPage.title')}</h1>
        <div className="bg-white p-4 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex justify-between">
              <div>{t('checkoutPage.totalsUSD')}</div>
              <div className="font-semibold">${getTotalPrice('usd').toFixed(2)}</div>
            </div>
            <div className="flex justify-between">
              <div>{t('checkoutPage.totalsGYT')}</div>
              <div className="font-semibold">{Number(totalGyt).toFixed(2)} DOLLAR</div>
            </div>
            <div className="flex justify-between">
              <div>{t('checkoutPage.yourBalance')}</div>
              <div className="font-semibold">{gytBalance === null ? '...' : `${Number(gytBalance).toFixed(2)} DOLLAR`}</div>
            </div>
          </div>
          {gytBalance !== null && gytBalance < totalGyt && (
            <div className="mt-3 text-sm text-red-600">{t('checkoutPage.insufficient')}</div>
          )}
          <button className={`btn btn-primary mt-4 w-full ${gytBalance !== null && gytBalance < totalGyt ? 'opacity-60 pointer-events-none' : ''}`} onClick={handleCheckout} disabled={loading || (gytBalance !== null && gytBalance < totalGyt)}>
            {loading ? t('checkoutPage.processing') : t('checkoutPage.payButton')}
          </button>
          <div className="text-xs text-gray-500 mt-2">{t('checkoutPage.tip')}</div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
