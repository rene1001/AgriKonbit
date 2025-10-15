import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

const OrderTrackingDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Fetch order tracking
  const { data: tracking, isLoading } = useQuery(
    ['order-tracking', orderId],
    async () => {
      const res = await api.get(`/api/orders/${orderId}/tracking`);
      return res.data.data;
    }
  );

  // Confirm delivery mutation
  const confirmDeliveryMutation = useMutation(
    async (notes) => {
      return api.post(`/api/orders/${orderId}/confirm-delivery`, { notes });
    },
    {
      onSuccess: () => {
        toast.success('Livraison confirmée avec succès');
        qc.invalidateQueries(['order-tracking', orderId]);
        setShowConfirmModal(false);
        setDeliveryNotes('');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erreur lors de la confirmation');
      }
    }
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status) => {
    const statusConfig = {
      pending: {
        label: 'En attente',
        color: 'yellow',
        icon: '⏳',
        description: 'Votre commande est en cours de traitement'
      },
      paid: {
        label: 'Payée',
        color: 'blue',
        icon: '💳',
        description: 'Paiement reçu, préparation en cours'
      },
      processing: {
        label: 'En préparation',
        color: 'indigo',
        icon: '📦',
        description: 'Votre commande est en cours de préparation'
      },
      shipped: {
        label: 'Expédiée',
        color: 'purple',
        icon: '🚚',
        description: 'Votre commande est en route'
      },
      delivered: {
        label: 'Livrée',
        color: 'green',
        icon: '✅',
        description: 'Commande livrée avec succès'
      },
      cancelled: {
        label: 'Annulée',
        color: 'red',
        icon: '❌',
        description: 'Commande annulée'
      }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const handleConfirmDelivery = () => {
    confirmDeliveryMutation.mutate(deliveryNotes);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!tracking || !tracking.order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Commande non trouvée</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  const { order, items, statusHistory } = tracking;
  const currentStatus = getStatusInfo(order.status);
  const canConfirmDelivery = order.status === 'shipped';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-emerald-600 hover:text-emerald-700 mb-4 flex items-center gap-2"
          >
            ← Retour
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Suivi de commande</h1>
          <p className="text-gray-600 mt-2">Commande #{order.order_number}</p>
        </div>

        {/* Current Status */}
        <div className={`bg-gradient-to-r from-${currentStatus.color}-500 to-${currentStatus.color}-600 rounded-xl shadow-lg p-6 text-white mb-6`}>
          <div className="flex items-center gap-4">
            <div className="text-5xl">{currentStatus.icon}</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{currentStatus.label}</h2>
              <p className="text-white/90">{currentStatus.description}</p>
            </div>
          </div>
        </div>

        {/* Confirm Delivery Button */}
        {canConfirmDelivery && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Avez-vous reçu votre commande ?</h3>
                <p className="text-gray-600">Confirmez la réception pour clôturer la commande</p>
              </div>
              <button
                onClick={() => setShowConfirmModal(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                Confirmer la livraison
              </button>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Articles commandés</h3>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                {item.product_images && JSON.parse(item.product_images)[0] && (
                  <img
                    src={JSON.parse(item.product_images)[0]}
                    alt={item.product_name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-medium">{item.product_name}</h4>
                  <p className="text-sm text-gray-600">Agriculteur: {item.farmer_name}</p>
                  <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600">
                    {parseFloat(item.total_gyt).toLocaleString()} GYT
                  </p>
                  <p className="text-sm text-gray-600">
                    {parseFloat(item.price_gyt).toLocaleString()} GYT / unité
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span className="text-emerald-600">
                {parseFloat(order.total_gyt).toLocaleString()} GYT
              </span>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-6">Historique de la commande</h3>
          <div className="space-y-4">
            {statusHistory.map((history, index) => {
              const statusInfo = getStatusInfo(history.status);
              const isLast = index === statusHistory.length - 1;

              return (
                <div key={history.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full bg-${statusInfo.color}-100 text-${statusInfo.color}-600 flex items-center justify-center text-xl`}>
                      {statusInfo.icon}
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 h-full bg-${statusInfo.color}-200 mt-2`} />
                    )}
                  </div>

                  <div className="flex-1 pb-8">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold">{statusInfo.label}</h4>
                      <span className="text-sm text-gray-500">
                        {formatDate(history.created_at)}
                      </span>
                    </div>
                    {history.notes && (
                      <p className="text-gray-600 text-sm">{history.notes}</p>
                    )}
                    {history.changed_by_name && (
                      <p className="text-gray-500 text-xs mt-1">
                        Par {history.changed_by_name}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Adresse de livraison</h3>
          {order.shipping_address && (
            <div className="text-gray-700">
              {JSON.parse(order.shipping_address).street && (
                <p>{JSON.parse(order.shipping_address).street}</p>
              )}
              {JSON.parse(order.shipping_address).city && (
                <p>
                  {JSON.parse(order.shipping_address).city}
                  {JSON.parse(order.shipping_address).postalCode &&
                    `, ${JSON.parse(order.shipping_address).postalCode}`}
                </p>
              )}
              {JSON.parse(order.shipping_address).country && (
                <p>{JSON.parse(order.shipping_address).country}</p>
              )}
            </div>
          )}
        </div>

        {/* Confirm Delivery Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold mb-4">Confirmer la livraison</h3>

              <p className="text-gray-600 mb-4">
                Confirmez-vous avoir reçu votre commande en bon état ?
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optionnel)
                </label>
                <textarea
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="Commentaires sur la livraison..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  rows="3"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleConfirmDelivery}
                  disabled={confirmDeliveryMutation.isLoading}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
                >
                  {confirmDeliveryMutation.isLoading
                    ? 'Confirmation...'
                    : 'Confirmer la réception'}
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={confirmDeliveryMutation.isLoading}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingDetail;
