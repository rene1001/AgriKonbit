import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import InvestorDashboard from './Dashboard/InvestorDashboard';
import FarmerDashboard from './Dashboard/FarmerDashboard';
import ConsumerDashboard from './Dashboard/ConsumerDashboard';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Veuillez vous connecter</div>
      </div>
    );
  }

  // Render dashboard based on user role
  switch (user.role) {
    case 'investor':
      return <InvestorDashboard />;
    case 'farmer':
      return <FarmerDashboard />;
    case 'consumer':
      return <ConsumerDashboard />;
    case 'admin':
      return <InvestorDashboard />; // Admin can see investor dashboard for now
    default:
      return <ConsumerDashboard />;
  }
};

export default Dashboard;
