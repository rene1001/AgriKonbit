import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { api, endpoints } from '../../utils/api';

const ConsumerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: me } = useQuery(['me'], async () => {
    const res = await api.get(endpoints.auth.me);
    return res.data.data.user;
  });

  const { data: ordersData } = useQuery(['my-orders-dashboard'], async () => {
    const res = await api.get(endpoints.orders.list, { params: { limit: 5 } });
    return res.data.data;
  });

  const myOrders = ordersData?.orders || [];
  const orderStats = {
    total: myOrders.length || 0,
    pending: myOrders.filter(o => o.status === 'pending').length || 0,
    shipped: myOrders.filter(o => o.status === 'shipped').length || 0,
    delivered: myOrders.filter(o => o.status === 'delivered').length || 0
  };

  const { data: notifData } = useQuery(['notifications', { unread_only: true }], async () => {
    const res = await api.get(endpoints.notifications.list, { params: { unread_only: true, limit: 1 } });
    return res.data.data;
  });
  const unread = notifData?.unread_count || 0;

  // Mini dropdown notifications
  const { data: recentNotifs } = useQuery(['notifications-recent'], async () => {
    const res = await api.get(endpoints.notifications.list, { params: { page: 1, limit: 5 } });
    return res.data.data;
  });
  const [openNotif, setOpenNotif] = useState(false);
  const onMarkAll = async () => {
    try {
      await api.patch(endpoints.notifications.markAllRead);
      setOpenNotif(false);
    } catch (e) {
      // ignore
    }
  };
  const onMarkOne = async (id) => {
    try {
      await api.patch(endpoints.notifications.markRead(id));
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🛍️ Tableau de bord Consommateur</h1>
            <p className="text-gray-600 mt-1">Achats, traçabilité et livraisons</p>
          </div>
          <div className="flex items-center gap-3 relative">
            <button type="button" onClick={() => setOpenNotif(v => !v)} className="relative inline-flex items-center px-3 py-2 bg-white border rounded-lg hover:shadow">
              <span className="mr-2">🔔</span>
              <span className="text-sm">Notifications</span>
              {unread > 0 && (
                <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full bg-red-600 text-white text-xs">{unread}</span>
              )}
            </button>
            {openNotif && (
              <div className="absolute right-0 top-12 w-80 bg-white border rounded-lg shadow-lg z-20">
                <div className="flex items-center justify-between p-2 border-b">
                  <div className="font-semibold text-sm">Notifications</div>
                  <button className="text-xs text-primary-600 hover:underline" onClick={onMarkAll}>Tout lire</button>
                </div>
                <div className="max-h-80 overflow-auto">
                  {(recentNotifs?.notifications || []).map(n => (
                    <div key={n.id} className={`px-3 py-2 text-sm border-b flex items-start gap-2 ${n.is_read ? 'bg-white' : 'bg-gray-50'}`}>
                      <div className={`mt-1 h-2 w-2 rounded-full ${n.is_read ? 'bg-gray-300' : 'bg-primary-500'}`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{n.title || 'Notification'}</div>
                        <div className="text-gray-600 truncate">{n.message}</div>
                        <div className="text-xs text-gray-500">{new Date(n.created_at).toLocaleString()}</div>
                      </div>
                      {!n.is_read && (
                        <button className="text-xs text-primary-600 hover:underline" onClick={() => onMarkOne(n.id)}>Lu</button>
                      )}
                    </div>
                  ))}
                  {(recentNotifs?.notifications || []).length === 0 && (
                    <div className="px-3 py-4 text-sm text-gray-500">Aucune notification</div>
                  )}
                </div>
                <div className="p-2 border-t text-right">
                  <Link to="/notifications" className="text-sm text-primary-600 hover:underline" onClick={() => setOpenNotif(false)}>Voir tout</Link>
                </div>
              </div>
            )}
            <Link to="/marketplace" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
              Parcourir le Marketplace
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              {[
                { key: 'overview', label: '📊 Vue d\'ensemble' },
                { key: 'orders', label: '🧾 Mes commandes', to: '/orders' },
                { key: 'deliveries', label: '🚚 Livraisons', to: '/deliveries' },
                { key: 'wallet', label: '💰 Portefeuille', to: '/wallet' },
                { key: 'favorites', label: '⭐ Favoris', to: '/favorites' },
                { key: 'subscriptions', label: '🔁 Abonnements', to: '/subscriptions' },
                { key: 'profile', label: '👤 Profil', to: '/profile' },
                { key: 'support', label: '🆘 Support', to: '/support' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab content */}
        <div className="pb-8 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Link to="/wallet" className="card hover:shadow">
                  <div className="text-sm text-gray-500">Solde GYT</div>
                  <div className="text-3xl font-bold">{me?.gytBalance || 0} GYT</div>
                </Link>
                <Link to="/orders" className="card hover:shadow">
                  <div className="text-sm text-gray-500">Total Commandes</div>
                  <div className="text-3xl font-bold">{orderStats.total}</div>
                </Link>
                <Link to="/deliveries" className="card hover:shadow">
                  <div className="text-sm text-gray-500">En cours</div>
                  <div className="text-3xl font-bold text-yellow-600">{orderStats.pending}</div>
                </Link>
                <Link to="/orders" className="card hover:shadow">
                  <div className="text-sm text-gray-500">Livrées</div>
                  <div className="text-3xl font-bold text-green-600">{orderStats.delivered}</div>
                </Link>
              </div>

              {/* Recent Orders */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Mes Commandes Récentes</h2>
                  <Link to="/orders" className="text-primary-600 text-sm">Voir toutes</Link>
                </div>
                <div className="space-y-3">
                  {myOrders?.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">Commande #{order.order_number}</div>
                        <div className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()} • ${Number(order.total_usd || 0).toFixed(2)}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  ))}
                  {(!myOrders || myOrders.length === 0) && (
                    <div className="text-center text-gray-500 py-8">Aucune commande pour le moment</div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/marketplace" className="card hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🛒</div>
                    <div className="font-semibold">Marketplace</div>
                    <div className="text-sm text-gray-600">Acheter des produits</div>
                  </div>
                </Link>
                <Link to="/deliveries" className="card hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🚚</div>
                    <div className="font-semibold">Suivi des livraisons</div>
                    <div className="text-sm text-gray-600">Suivre vos colis</div>
                  </div>
                </Link>
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Mes commandes</div>
                  <div className="text-sm text-gray-600">Consulter et télécharger vos factures</div>
                </div>
                <Link to="/orders" className="btn btn-primary">Ouvrir</Link>
              </div>
            </div>
          )}

          {activeTab === 'deliveries' && (
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Suivi des livraisons</div>
                  <div className="text-sm text-gray-600">Tracking en temps réel</div>
                </div>
                <Link to="/deliveries" className="btn btn-primary">Ouvrir</Link>
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Portefeuille GYT</div>
                  <div className="text-sm text-gray-600">Solde et historique</div>
                </div>
                <Link to="/wallet" className="btn btn-primary">Ouvrir</Link>
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Favoris</div>
                  <div className="text-sm text-gray-600">Produits et producteurs</div>
                </div>
                <Link to="/favorites" className="btn btn-primary">Ouvrir</Link>
              </div>
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Abonnements</div>
                  <div className="text-sm text-gray-600">Commandes récurrentes</div>
                </div>
                <Link to="/subscriptions" className="btn btn-primary">Ouvrir</Link>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Profil & Paramètres</div>
                  <div className="text-sm text-gray-600">Adresse, paiement, préférences</div>
                </div>
                <Link to="/profile" className="btn btn-primary">Ouvrir</Link>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Support & Communauté</div>
                  <div className="text-sm text-gray-600">FAQ, tickets, chat</div>
                </div>
                <Link to="/support" className="btn btn-primary">Ouvrir</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsumerDashboard;
