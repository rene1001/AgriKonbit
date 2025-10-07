import React from 'react';
import { Link } from 'react-router-dom';

const OverviewSection = ({ stats, myProjects, myProducts, recentOrders }) => {
  return (
    <div className="space-y-6">
      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Projects */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Projets Actifs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.projects?.active_projects || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Total: {stats?.projects?.total_projects || 0}
              </p>
            </div>
            <div className="text-4xl">🌱</div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Produits en Vente</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.products?.active_products || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Stock: {stats?.products?.total_stock || 0} unités
              </p>
            </div>
            <div className="text-4xl">🛒</div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Commandes en Cours</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.orders?.pending_orders || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Total: {stats?.orders?.total_orders || 0}
              </p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Solde GYT</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {parseFloat(stats?.wallet?.gyt_balance || 0).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Gagné: {parseFloat(stats?.wallet?.total_earned_gyt || 0).toFixed(2)} GYT
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>
      </div>

      {/* Funding Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-800">Financement Total</span>
            <span className="text-2xl">💵</span>
          </div>
          <p className="text-2xl font-bold text-green-900">
            {parseFloat(stats?.projects?.total_funded_gyt || 0).toFixed(2)} GYT
          </p>
          <p className="text-xs text-green-700 mt-1">
            ${parseFloat(stats?.projects?.total_funded_usd || 0).toFixed(2)} USD
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">Investisseurs</span>
            <span className="text-2xl">👥</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">
            {stats?.investors?.total_investors || 0}
          </p>
          <p className="text-xs text-blue-700 mt-1">
            {stats?.investors?.total_investments || 0} investissements
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-800">Revenus Marketplace</span>
            <span className="text-2xl">💳</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">
            {parseFloat(stats?.orders?.total_revenue_gyt || 0).toFixed(2)} GYT
          </p>
          <p className="text-xs text-purple-700 mt-1">
            ${parseFloat(stats?.orders?.total_revenue_usd || 0).toFixed(2)} USD
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">📋 Projets Récents</h3>
            <Link to="/farmer/my-projects" className="text-sm text-green-600 hover:text-green-700">
              Voir tous →
            </Link>
          </div>
          <div className="space-y-3">
            {myProjects?.slice(0, 3).map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{project.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-600">
                      {project.budget_gyt} GYT
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-600">
                      {project.funding_percentage || 0}% financé
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'validated' ? 'bg-green-100 text-green-800' :
                  project.status === 'active' ? 'bg-blue-100 text-blue-800' :
                  project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  project.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
              </div>
            ))}
            {(!myProjects || myProjects.length === 0) && (
              <div className="text-center text-gray-500 py-8">
                Aucun projet pour le moment
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">📦 Commandes Récentes</h3>
            <Link to="/farmer/orders" className="text-sm text-green-600 hover:text-green-700">
              Voir toutes →
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders?.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{order.order_number}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-600">
                      {order.customer_name}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-600">
                      {order.total_gyt} GYT
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'paid' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </div>
            ))}
            {(!recentOrders || recentOrders.length === 0) && (
              <div className="text-center text-gray-500 py-8">
                Aucune commande pour le moment
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">🛍️ Mes Produits</h3>
          <Link to="/farmer/my-products" className="text-sm text-green-600 hover:text-green-700">
            Voir tous →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {myProducts?.slice(0, 3).map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900">{product.name}</h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.is_active ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">
                  ${product.price_usd}
                </span>
                <span className="text-sm text-gray-600">
                  Stock: {product.stock}
                </span>
              </div>
            </div>
          ))}
          {(!myProducts || myProducts.length === 0) && (
            <div className="col-span-3 text-center text-gray-500 py-8">
              Aucun produit pour le moment
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;
