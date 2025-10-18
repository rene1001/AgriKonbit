import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';
import BackButton from '../../components/common/BackButton';

const ManageOrder = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(endpoints.farmer.orderDetail(id));
        setOrder(res.data?.data || null);
      } catch (e) {
        toast.error(t('orders.loadError', 'Impossible de charger la commande'));
      }
    })();
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      setLoading(true);
      await api.patch(endpoints.farmer.updateOrderStatus(id), { status: newStatus });
      setOrder(prev => ({ ...prev, status: newStatus }));
      toast.success(t('orders.statusUpdated', 'Statut mis à jour'));
    } catch (e) {
      toast.error(e.response?.data?.message || t('orders.updateFailed', 'Échec de la mise à jour'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return t('orders.status.pending', 'En attente');
      case 'paid': return t('orders.status.paid', 'Payée');
      case 'shipped': return t('orders.status.shipped', 'Expédiée');
      case 'delivered': return t('orders.status.delivered', 'Livrée');
      case 'cancelled': return t('orders.status.cancelled', 'Annulée');
      default: return status;
    }
  };

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('orders.manageTitle', 'Gérer la commande')}</h1>
          <BackButton />
        </div>

        {!order ? (
          <div className="bg-white p-6 rounded shadow">{t('common.loadingEllipsis', 'Chargement…')}</div>
        ) : (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="bg-white p-6 rounded shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">{t('orders.fields.orderNumber', 'Numéro de commande')}</p>
                  <p className="font-semibold">{order.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('orders.fields.status', 'Statut')}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('orders.fields.customer', 'Client')}</p>
                  <p className="font-semibold">{order.customer_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('orders.fields.total', 'Total')}</p>
                  <p className="font-semibold">{Number(order.total_gyt || 0).toFixed(2)} DOLLAR (${Number(order.total_usd || 0).toFixed(2)})</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('orders.fields.orderDate', 'Date de commande')}</p>
                  <p className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('orders.fields.paymentMethod', 'Méthode de paiement')}</p>
                  <p className="font-semibold">{order.payment_method}</p>
                </div>
              </div>

              {/* Shipping Address */}
              {order.shipping_address && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">{t('orders.fields.shippingAddress', 'Adresse de livraison')}</p>
                  <div className="text-sm">
                    {(() => {
                      try {
                        const addr = typeof order.shipping_address === 'string' 
                          ? JSON.parse(order.shipping_address) 
                          : order.shipping_address;
                        return `${addr.line1 || ''}, ${addr.city || ''}, ${addr.country || ''}`;
                      } catch {
                        return String(order.shipping_address);
                      }
                    })()}
                  </div>
                </div>
              )}

              {order.notes && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">{t('orders.fields.notes', 'Notes')}</p>
                  <p className="text-sm">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">{t('orders.items.title', 'Articles commandés')}</h3>
              <div className="space-y-3">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-gray-600">{t('orders.items.qty', 'Quantité')}: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{Number(item.total_gyt || 0).toFixed(2)} DOLLAR</p>
                      <p className="text-sm text-gray-600">${Number(item.total_usd || 0).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Management */}
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">{t('orders.status.manage', 'Gestion du statut')}</h3>
              
              {/* Current Status Info */}
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">{t('orders.status.current', 'Statut actuel')}: <span className="font-semibold">{getStatusLabel(order.status)}</span></p>
                <p className="text-xs text-gray-500 mt-1">
                  {order.status === 'pending' && t('orders.status.pendingHint', 'En attente de paiement')}
                  {order.status === 'paid' && t('orders.status.paidHint', 'Commande payée, prête à être expédiée')}
                  {order.status === 'shipped' && t('orders.status.shippedHint', 'Commande expédiée, en attente de confirmation de livraison')}
                  {order.status === 'delivered' && t('orders.status.deliveredHint', 'Commande livrée et finalisée')}
                  {order.status === 'cancelled' && t('orders.status.cancelledHint', 'Commande annulée')}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {order.status === 'paid' && (
                  <button
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    onClick={() => updateStatus('shipped')}
                    disabled={loading}
                  >
                    {t('orders.actions.markShipped', 'Marquer comme expédiée')}
                  </button>
                )}
                {order.status === 'shipped' && (
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => updateStatus('delivered')}
                    disabled={loading}
                  >
                    {t('orders.actions.markDelivered', 'Marquer comme livrée')}
                  </button>
                )}
                {(order.status === 'pending' || order.status === 'paid') && (
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => updateStatus('cancelled')}
                    disabled={loading}
                  >
                    {t('orders.actions.cancelOrder', 'Annuler la commande')}
                  </button>
                )}
                {(order.status === 'delivered' || order.status === 'cancelled') && (
                  <div className="text-sm text-gray-500 italic">
                    {t('orders.actions.noneAvailable', 'Aucune action disponible pour ce statut')}
                  </div>
                )}
              </div>
              {loading && <p className="text-sm text-gray-500 mt-2">{t('common.updatingEllipsis', 'Mise à jour en cours…')}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrder;
