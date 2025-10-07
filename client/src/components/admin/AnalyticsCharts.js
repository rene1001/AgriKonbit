import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Colors palette
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

// User Roles Distribution Pie Chart
export const RolesDistributionChart = ({ stats }) => {
  const data = [
    { name: 'Agriculteurs', value: stats?.total_farmers || 0, color: '#10B981' },
    { name: 'Investisseurs', value: stats?.total_investors || 0, color: '#3B82F6' },
    { name: 'Consommateurs', value: stats?.total_consumers || 0, color: '#F59E0B' }
  ].filter(item => item.value > 0);

  if (data.length === 0) {
    return <div className="text-gray-500 text-sm text-center">Aucune donnée disponible</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Projects Status Bar Chart
export const ProjectsStatusChart = ({ stats }) => {
  const data = [
    { name: 'Validés', count: stats?.validated_projects || 0, color: '#10B981' },
    { name: 'Actifs', count: stats?.active_projects || 0, color: '#3B82F6' },
    { name: 'Terminés', count: stats?.completed_projects || 0, color: '#8B5CF6' }
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#3B82F6">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

// Revenue Comparison Bar Chart
export const RevenueComparisonChart = ({ stats }) => {
  const totalInvestedUsd = Number(stats?.total_invested_usd || 0);
  const totalRevenueUsd = Number(stats?.total_revenue_usd || 0);

  const data = [
    { name: 'Investissements', amount: totalInvestedUsd, color: '#3B82F6' },
    { name: 'Revenus Marketplace', amount: totalRevenueUsd, color: '#10B981' }
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
        <Bar dataKey="amount" fill="#3B82F6">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

// Platform Growth Summary Cards
export const GrowthSummaryCards = ({ stats }) => {
  const metrics = [
    {
      label: 'Taux de validation',
      value: stats?.total_projects > 0 
        ? `${((stats.validated_projects / stats.total_projects) * 100).toFixed(1)}%`
        : '0%',
      icon: '✅',
      color: 'text-green-600'
    },
    {
      label: 'Taux de complétion',
      value: stats?.total_projects > 0
        ? `${((stats.completed_projects / stats.total_projects) * 100).toFixed(1)}%`
        : '0%',
      icon: '🎯',
      color: 'text-blue-600'
    },
    {
      label: 'Revenus moyens/commande',
      value: stats?.total_orders > 0
        ? `$${(stats.total_revenue_usd / stats.total_orders).toFixed(2)}`
        : '$0',
      icon: '💵',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 mb-1">{metric.label}</div>
              <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
            </div>
            <div className="text-3xl">{metric.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default {
  RolesDistributionChart,
  ProjectsStatusChart,
  RevenueComparisonChart,
  GrowthSummaryCards
};
