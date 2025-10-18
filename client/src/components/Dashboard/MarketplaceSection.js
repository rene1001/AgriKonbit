import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { api, endpoints } from '../../utils/api';

const MarketplaceSection = ({ stats, myProducts }) => {
  const { t } = useTranslation();
  const [orderFilter, setOrderFilter] = useState('all');

  const { data: ordersData } = useQuery(['farmer-orders', orderFilter], async () => {
    const params = { limit: 20 };
    if (orderFilter !== 'all') {
      params.status = orderFilter;
    }
    const res = await api.get(endpoints.farmer.orders, { params });
    return res.data.data;
  });

  return (
    <div className="space-y-6">
      {/* Products Management */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">🛍️ Mes Produits</h2>
          <Link to="/farmer/add-product" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            ➕ Ajouter Produit
          </Link>
        </div>

        {/* Products Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">{t('dashboardComponents.marketplace.active')}</p>
            <p className="text-2xl font-bold text-green-900">{stats?.products?.active_products || 0}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 font-medium">{t('dashboardComponents.marketplace.inactive')}</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.products?.inactive_products || 0}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">{t('dashboardComponents.marketplace.totalStock')}</p>
            <p className="text-2xl font-bold text-blue-900">{stats?.products?.total_stock || 0}</p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myProducts?.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{product.name}</h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.is_active ? 'Actif' : 'Inactif'}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Prix</p>
                  <p className="text-sm font-bold text-green-600">${product.price_usd}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('dashboardComponents.marketplace.stock')}</p>
                  <p className="text-sm font-bold text-gray-900">{product.stock}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('dashboardComponents.marketplace.category')}</p>
                  <p className="text-sm text-gray-700">{product.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Bio</p>
                  <p className="text-sm text-gray-700">{product.organic_certified ? '✅' : '❌'}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link 
                  to={`/marketplace/${product.id}`}
                  className="flex-1 px-3 py-2 bg-green-600 text-white text-sm text-center rounded hover:bg-green-700 transition"
                >
                  Voir
                </Link>
                <Link 
                  to={`/farmer/edit-product/${product.id}`}
                  className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 text-sm text-center rounded hover:bg-gray-300 transition"
                >
                  Modifier
                </Link>
              </div>
            </div>
          ))}

          {(!myProducts || myProducts.length === 0) && (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500 text-lg mb-4">{t('dashboardComponents.marketplace.noProducts')}</p>
              <Link to="/farmer/add-product" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Ajouter votre premier produit
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Orders Management */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">📦 Gestion des Commandes</h2>
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-yellow-600 font-medium">En attente</p>
            <p className="text-2xl font-bold text-yellow-900">{stats?.orders?.pending_orders || 0}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">{t('dashboardComponents.marketplace.paid')}</p>
            <p className="text-2xl font-bold text-blue-900">{stats?.orders?.paid_orders || 0}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-600 font-medium">{t('dashboardComponents.marketplace.shipped')}</p>
            <p className="text-2xl font-bold text-purple-900">{stats?.orders?.shipped_orders || 0}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">{t('dashboardComponents.marketplace.delivered')}</p>
            <p className="text-2xl font-bold text-green-900">{stats?.orders?.delivered_orders || 0}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          <button
            onClick={() => setOrderFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              orderFilter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setOrderFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              orderFilter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            En attente
          </button>
          <button
            onClick={() => setOrderFilter('paid')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              orderFilter === 'paid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Payées
          </button>
          <button
            onClick={() => setOrderFilter('shipped')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              orderFilter === 'shipped' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Expédiées
          </button>
          <button
            onClick={() => setOrderFilter('delivered')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              orderFilter === 'delivered' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Livrées
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {ordersData?.orders?.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
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
                      <p className="text-xs text-gray-500">{t('dashboardComponents.marketplace.customer')}</p>
                      <p className="text-gray-900">{order.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t('dashboardComponents.marketplace.items')}</p>
                      <p className="text-gray-900">{order.item_count} produit(s)</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t('dashboardComponents.marketplace.total')}</p>
                      <p className="text-gray-900 font-semibold">{order.total_gyt} DOLLAR</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <Link 
                  to={`/farmer/orders/${order.id}`}
                  className="ml-4 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                >
                  Gérer
                </Link>
              </div>
            </div>
          ))}

          {(!ordersData?.orders || ordersData.orders.length === 0) && (
            <div className="text-center text-gray-500 py-12">
              Aucune commande pour le moment
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceSection;
