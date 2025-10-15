import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { api, endpoints } from '../../utils/api';
import BackButton from '../../components/common/BackButton';

const FarmerOrders = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery(['farmer-orders-page'], async () => {
    const res = await api.get(endpoints.farmer.orders, { params: { limit: 50 } });
    return res.data?.data || { orders: [], pagination: {} };
  });

  const orders = data?.orders || [];

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('farmerOrders.title')}</h1>
          <BackButton />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          {isLoading ? (
            <div>{t('farmerOrders.loading')}</div>
          ) : orders.length === 0 ? (
            <div className="text-gray-500 text-center py-12">{t('farmerOrders.empty')}</div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{order.order_number}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">{t('farmerOrders.client')}</p>
                        <p className="text-gray-900">{order.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{t('farmerOrders.items')}</p>
                        <p className="text-gray-900">{t('farmerOrders.itemsCount', { count: order.item_count })}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{t('farmerOrders.total')}</p>
                        <p className="text-gray-900 font-semibold">{order.total_gyt} DOLLAR</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{t('farmerOrders.date')}</p>
                        <p className="text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerOrders;
