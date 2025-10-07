import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { api, endpoints } from '../../utils/api';
import OverviewSection from '../../components/Dashboard/OverviewSection';
import ProjectsSection from '../../components/Dashboard/ProjectsSection';
import MarketplaceSection from '../../components/Dashboard/MarketplaceSection';
import FinancesSection from '../../components/Dashboard/FinancesSection';
import NotificationsSection from '../../components/Dashboard/NotificationsSection';
import ProfileSection from '../../components/Dashboard/ProfileSection';
import MessagingSection from '../../components/Dashboard/MessagingSection';
import ResourcesSection from '../../components/Dashboard/ResourcesSection';

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery(['farmer-stats'], async () => {
    const res = await api.get(endpoints.farmer.dashboardStats);
    return res.data.data;
  });

  const { data: myProjects } = useQuery(['farmer-projects'], async () => {
    const res = await api.get(endpoints.projects.farmerProjects, {
      params: { limit: 10 }
    });
    return res.data.data.projects;
  });

  const { data: myProducts } = useQuery(['farmer-products'], async () => {
    const res = await api.get(endpoints.products.farmerProducts, {
      params: { limit: 20 }
    });
    return res.data.data.products;
  });

  const { data: recentOrders } = useQuery(['farmer-orders-recent'], async () => {
    const res = await api.get(endpoints.farmer.orders, {
      params: { limit: 5 }
    });
    return res.data.data.orders;
  });

  const { data: notifications } = useQuery(['notifications'], async () => {
    const res = await api.get(endpoints.users.notifications, {
      params: { limit: 5, unreadOnly: true }
    });
    return res.data.data.notifications;
  });

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🌾 Tableau de Bord Agriculteur</h1>
              <p className="text-gray-600 mt-1">Gérez vos projets, produits et ventes</p>
            </div>
            <div className="flex gap-3">
              <Link to="/farmer/submit-project" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                ➕ Nouveau Projet
              </Link>
              <Link to="/farmer/add-product" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                🛒 Ajouter Produit
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Vue d'ensemble
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'projects'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🌱 Mes Projets
              </button>
              <button
                onClick={() => setActiveTab('marketplace')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'marketplace'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🛍️ Marketplace
              </button>
              <button
                onClick={() => setActiveTab('finances')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'finances'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                💰 Finances
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition relative whitespace-nowrap ${
                  activeTab === 'notifications'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🔔 Notifications
                {notifications && notifications.length > 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'messages'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                💬 Messages
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'resources'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📚 Ressources
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                👤 Profil
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="pb-8">
          {activeTab === 'overview' && (
            <OverviewSection
              stats={stats}
              myProjects={myProjects}
              myProducts={myProducts}
              recentOrders={recentOrders}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsSection stats={stats} myProjects={myProjects} />
          )}

          {activeTab === 'marketplace' && (
            <MarketplaceSection stats={stats} myProducts={myProducts} />
          )}

          {activeTab === 'finances' && <FinancesSection stats={stats} />}

          {activeTab === 'notifications' && <NotificationsSection />}

          {activeTab === 'messages' && <MessagingSection />}

          {activeTab === 'resources' && <ResourcesSection />}

          {activeTab === 'profile' && <ProfileSection />}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
