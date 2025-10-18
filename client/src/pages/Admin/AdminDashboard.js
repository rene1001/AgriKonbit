import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';
import { 
  RolesDistributionChart, 
  ProjectsStatusChart, 
  RevenueComparisonChart,
  GrowthSummaryCards 
} from '../../components/admin/AnalyticsCharts';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [activeSection, setActiveSection] = useState('overview');
  const [projPage, setProjPage] = useState(1);
  const [projLimit] = useState(10);
  const [notesById, setNotesById] = useState({});
  // Admin broadcast form state
  const [broadcastType, setBroadcastType] = useState('private'); // 'private' | 'announcement'
  const [scope, setScope] = useState('all'); // 'all' | 'role' | 'users'
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [userIdsText, setUserIdsText] = useState('');
  const [includeAdmins, setIncludeAdmins] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  const { data: dashboard } = useQuery(['admin-dashboard'], async () => {
    const res = await api.get(endpoints.admin.dashboard);
    return res.data.data;
  });

  const { data: pendingData } = useQuery(['pending-projects', projPage, projLimit], async () => {
    const res = await api.get(endpoints.admin.pendingProjects, {
      params: { page: projPage, limit: projLimit }
    });
    return res.data.data;
  });

  const validateMutation = useMutation(
    async ({ id, action, notes }) => {
      return api.patch(endpoints.admin.validateProject(id), { action, notes });
    },
    {
      onSuccess: () => {
        toast.success(t('dashboard.admin.projectUpdated'));
        qc.invalidateQueries(['pending-projects']);
      },
      onError: () => toast.error(t('dashboard.admin.actionFailed'))
    }
  );

  // Broadcast mutations
  const broadcastPrivate = useMutation(
    async (payload) => {
      return api.post(endpoints.messages.adminBroadcastPrivate, payload);
    },
    {
      onSuccess: () => {
        toast.success(t('dashboard.admin.privateMessagesSent'));
        setSubject('');
        setContent('');
      },
      onError: () => toast.error(t('dashboard.admin.sendPrivateMessagesFailed'))
    }
  );

  const broadcastAnnouncement = useMutation(
    async (payload) => {
      return api.post(endpoints.messages.adminBroadcastNotification, payload);
    },
    {
      onSuccess: () => {
        toast.success(t('dashboard.admin.announcementSent'));
        setTitle('');
        setContent('');
      },
      onError: () => toast.error(t('dashboard.admin.sendAnnouncementFailed'))
    }
  );

  const handleBroadcastSubmit = (e) => {
    e.preventDefault();
    const payload = {
      scope,
      includeAdmins,
    };
    if (scope === 'role') payload.roles = selectedRoles;
    if (scope === 'users') payload.userIds = userIdsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(Number);

    if (broadcastType === 'private') {
      if (!content.trim()) return toast.error(t('dashboard.admin.contentRequired'));
      broadcastPrivate.mutate({ ...payload, subject: subject || null, content });
    } else {
      if (!content.trim()) return toast.error(t('dashboard.admin.messageRequired'));
      broadcastAnnouncement.mutate({ ...payload, title: title || t('dashboard.admin.announcement'), message: content });
    }
  };

  const handleExport = async (type) => {
    try {
      let endpoint;
      let filename;
      
      switch(type) {
        case 'users':
          endpoint = endpoints.reports.exportUsers;
          filename = 'users';
          break;
        case 'investments':
          endpoint = endpoints.reports.exportInvestments;
          filename = 'investments';
          break;
        case 'orders':
          endpoint = endpoints.reports.exportOrders;
          filename = 'orders';
          break;
        case 'projects':
          endpoint = endpoints.reports.exportProjects;
          filename = 'projects';
          break;
        default:
          return;
      }

      const response = await api.get(endpoint, {
        params: { format: 'csv' },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}-export-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success(t('dashboard.admin.exportSuccess'));
    } catch (error) {
      toast.error(t('dashboard.admin.exportFailed'));
    }
  };

  const sections = [
    { id: 'overview', icon: '📊', label: t('dashboard.admin.sections.overview') },
    { id: 'treasury', icon: '💰', label: t('dashboard.admin.sections.treasury') },
    { id: 'funds', icon: '💵', label: t('dashboard.admin.sections.funds') },
    { id: 'communication', icon: '📢', label: t('dashboard.admin.sections.communication') },
    { id: 'reports', icon: '📈', label: t('dashboard.admin.sections.reports') },
    { id: 'analytics', icon: '📊', label: t('dashboard.admin.sections.analytics') },
    { id: 'config', icon: '⚙️', label: t('dashboard.admin.sections.config') },
    { id: 'validation', icon: '✅', label: t('dashboard.admin.sections.validation') },
    { id: 'activity', icon: '🕒', label: t('dashboard.admin.sections.activity') },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">{t('dashboard.admin.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('dashboard.admin.subtitle')}</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                activeSection === section.id
                  ? 'bg-emerald-50 text-emerald-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{section.icon}</span>
              <span className="text-sm">{section.label}</span>
            </button>
          ))}
        </nav>

        {/* Quick Links */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Link to="/admin/users" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition">
            <span>👥</span>
            <span>{t('dashboard.admin.quickLinks.users')}</span>
          </Link>
          <Link to="/admin/products" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition">
            <span>🛒</span>
            <span>{t('dashboard.admin.quickLinks.products')}</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 text-white">
          <div className="px-8 py-6">
            <h2 className="text-2xl font-bold">{sections.find(s => s.id === activeSection)?.label}</h2>
            <p className="text-emerald-100 mt-1">Gérez et supervisez cette section</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {/* Section: Vue d'ensemble */}
          {activeSection === 'overview' && (
          <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Vue d'ensemble</h2>
          
          {/* KPI cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">{t('dashboard.admin.users')}</div>
                  <div className="mt-1 text-3xl font-semibold">{dashboard?.stats?.total_users || 0}</div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">👤</div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">{t('dashboard.admin.projects')}</div>
                  <div className="mt-1 text-3xl font-semibold">{dashboard?.stats?.total_projects || 0}</div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">📁</div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">{t('dashboard.admin.orders')}</div>
                  <div className="mt-1 text-3xl font-semibold">{dashboard?.stats?.total_orders || 0}</div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">🧾</div>
              </div>
            </div>
          </div>
          
          {/* KPI secondaires */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="text-sm text-gray-500">{t('dashboard.admin.validatedProjects')}</div>
              <div className="text-2xl font-bold mt-1">{dashboard?.stats?.validated_projects || 0}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="text-sm text-gray-500">{t('dashboard.admin.totalInvestedUSD')}</div>
              <div className="text-2xl font-bold mt-1">{Number(dashboard?.stats?.total_invested_usd || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="text-sm text-gray-500">{t('dashboard.admin.revenueMarketplaceUSD')}</div>
              <div className="text-2xl font-bold mt-1">{Number(dashboard?.stats?.total_revenue_usd || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>
          </div>
          </div>
          )}

          {/* Section: Trésorerie Plateforme */}
          {activeSection === 'treasury' && (
          <div>
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl p-8 mb-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-2">💰 Trésorerie de la Plateforme</h2>
              <p className="text-emerald-100">Consultez et gérez les fonds collectés via les frais de la plateforme</p>
              <Link 
                to="/admin/treasury" 
                className="inline-block mt-4 bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition"
              >
                Accéder à la Trésorerie →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="text-sm text-gray-600 mb-2">Fonctionnalités</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Voir le solde actuel</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Historique des frais collectés</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Retirer des fonds</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Statistiques détaillées</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="text-sm text-gray-600 mb-2">Sources de Revenus</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span>💰</span>
                    <span>Frais retraits agriculteurs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>📊</span>
                    <span>Frais distribution retours</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>⚙️</span>
                    <span>Frais retraits projets</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="text-sm text-gray-600 mb-2">Sécurité</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">🔒</span>
                    <span>Accès admin uniquement</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">📝</span>
                    <span>Toutes actions tracées</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">✓</span>
                    <span>Historique complet</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          )}

          {/* Section: Gestion des Fonds */}
          {activeSection === 'funds' && (
          <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/admin/withdrawal-requests" className="group bg-white border-2 border-gray-200 hover:border-emerald-500 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-4 mb-3">
                <div className="h-14 w-14 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl group-hover:scale-110 transition">💰</div>
                <div className="font-semibold text-lg text-gray-900">Retraits Agriculteurs</div>
              </div>
              <p className="text-sm text-gray-600">Gérer les demandes de retrait des fonds de projets</p>
            </Link>
            
            <Link to="/admin/distribute-returns" className="group bg-white border-2 border-gray-200 hover:border-purple-500 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-4 mb-3">
                <div className="h-14 w-14 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-3xl group-hover:scale-110 transition">📊</div>
                <div className="font-semibold text-lg text-gray-900">Distribution Retours</div>
              </div>
              <p className="text-sm text-gray-600">Distribuer les retours sur investissement</p>
            </Link>
            
            <Link to="/admin/platform-fees" className="group bg-white border-2 border-gray-200 hover:border-amber-500 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-4 mb-3">
                <div className="h-14 w-14 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-3xl group-hover:scale-110 transition">⚙️</div>
                <div className="font-semibold text-lg text-gray-900">Frais Plateforme</div>
              </div>
              <p className="text-sm text-gray-600">Configurer les pourcentages de frais</p>
            </Link>
          </div>
          </div>
          )}

          {/* Section: Communication */}
          {activeSection === 'communication' && (
          <div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <form onSubmit={handleBroadcastSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">{t('dashboard.admin.type')}</label>
                <select className="border rounded p-2 text-sm w-full" value={broadcastType} onChange={(e) => setBroadcastType(e.target.value)}>
                  <option value="private">{t('dashboard.admin.privateMessage')}</option>
                  <option value="announcement">{t('dashboard.admin.announcement')}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">{t('dashboard.admin.scope')}</label>
                <select className="border rounded p-2 text-sm w-full" value={scope} onChange={(e) => setScope(e.target.value)}>
                  <option value="all">{t('dashboard.admin.allUsers')}</option>
                  <option value="role">{t('dashboard.admin.byRole')}</option>
                  <option value="users">{t('dashboard.admin.byUserIds')}</option>
                </select>
              </div>
              <div className="flex items-center gap-2 mt-6 md:mt-6">
                <input id="includeAdmins" type="checkbox" className="h-4 w-4" checked={includeAdmins} onChange={(e) => setIncludeAdmins(e.target.checked)} />
                <label htmlFor="includeAdmins" className="text-sm text-gray-700">{t('dashboard.admin.includeAdmins')}</label>
              </div>
            </div>

            {scope === 'role' && (
              <div>
                <label className="block text-xs text-gray-600 mb-1">{t('dashboard.admin.targetRoles')}</label>
                <div className="flex flex-wrap gap-2">
                  {['investor','farmer','consumer','moderator','admin'].map(r => (
                    <button type="button" key={r} onClick={() => setSelectedRoles(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])} className={`px-3 py-1 rounded border text-sm ${selectedRoles.includes(r) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-gray-300 hover:bg-gray-50'}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {scope === 'users' && (
              <div>
                <label className="block text-xs text-gray-600 mb-1">{t('dashboard.admin.targetUserIds')}</label>
                <input type="text" className="border rounded p-2 text-sm w-full" placeholder="ex: 12, 45, 78" value={userIdsText} onChange={(e) => setUserIdsText(e.target.value)} />
              </div>
            )}

            {broadcastType === 'private' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-xs text-gray-600 mb-1">{t('dashboard.admin.subject')}</label>
                  <input type="text" className="border rounded p-2 text-sm w-full" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Sujet du message" />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs text-gray-600 mb-1">{t('dashboard.admin.content')}</label>
                  <textarea className="border rounded p-2 text-sm w-full" rows={3} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Votre message..." />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-xs text-gray-600 mb-1">{t('dashboard.admin.messageTitle')}</label>
                  <input type="text" className="border rounded p-2 text-sm w-full" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre de l'annonce" />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs text-gray-600 mb-1">{t('dashboard.admin.message')}</label>
                  <textarea className="border rounded p-2 text-sm w-full" rows={3} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Votre annonce..." />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button type="submit" className="inline-flex items-center justify-center px-4 py-2 rounded-md text-white bg-emerald-600 hover:bg-emerald-700 text-sm disabled:opacity-60" disabled={broadcastPrivate.isLoading || broadcastAnnouncement.isLoading}>
                {broadcastType === 'private' ? (broadcastPrivate.isLoading ? t('dashboard.admin.sending') : t('dashboard.admin.sendPrivateMessage')) : (broadcastAnnouncement.isLoading ? t('dashboard.admin.sending') : t('dashboard.admin.publishAnnouncement'))}
              </button>
              <button type="button" onClick={() => { setSubject(''); setTitle(''); setContent(''); setSelectedRoles([]); setUserIdsText(''); }} className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-sm">{t('dashboard.admin.reset')}</button>
            </div>
          </form>
          </div>
          </div>
          )}

          {/* Section: Rapports & Exports */}
          {activeSection === 'reports' && (
          <div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">{t('dashboard.admin.downloadDataCSV')}</p>
              </div>
            </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button onClick={() => handleExport('users')} className="group flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <span className="h-9 w-9 rounded-md bg-blue-50 text-blue-600 grid place-items-center group-hover:scale-105 transition">👥</span>
              <div className="text-left">
                <div className="font-medium text-sm">{t('dashboard.admin.users')}</div>
                <div className="text-xs text-gray-500">CSV</div>
              </div>
            </button>
            <button onClick={() => handleExport('projects')} className="group flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <span className="h-9 w-9 rounded-md bg-green-50 text-green-600 grid place-items-center group-hover:scale-105 transition">📁</span>
              <div className="text-left">
                <div className="font-medium text-sm">{t('dashboard.admin.projects')}</div>
                <div className="text-xs text-gray-500">CSV</div>
              </div>
            </button>
            <button onClick={() => handleExport('investments')} className="group flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <span className="h-9 w-9 rounded-md bg-purple-50 text-purple-600 grid place-items-center group-hover:scale-105 transition">💹</span>
              <div className="text-left">
                <div className="font-medium text-sm">{t('dashboard.admin.investments')}</div>
                <div className="text-xs text-gray-500">CSV</div>
              </div>
            </button>
            <button onClick={() => handleExport('orders')} className="group flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <span className="h-9 w-9 rounded-md bg-amber-50 text-amber-600 grid place-items-center group-hover:scale-105 transition">🧾</span>
              <div className="text-left">
                <div className="font-medium text-sm">{t('dashboard.admin.orders')}</div>
                <div className="text-xs text-gray-500">CSV</div>
              </div>
            </button>
          </div>
          </div>
          </div>
          )}

          {/* Section: Analytiques */}
          {activeSection === 'analytics' && (
          <div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <GrowthSummaryCards stats={dashboard?.stats} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">👥 {t('dashboard.admin.usersDistribution')}</h3>
              <RolesDistributionChart stats={dashboard?.stats} />
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">📊 {t('dashboard.admin.projectsStatus')}</h3>
              <ProjectsStatusChart stats={dashboard?.stats} />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mt-6">
            <RevenueComparisonChart stats={dashboard?.stats} />
          </div>
          </div>
          )}

          {/* Section: Configuration */}
          {activeSection === 'config' && (
          <div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4">🎬 {t('dashboard.admin.videoSection')}</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="videoTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('dashboard.admin.videoTitle')}
                </label>
                <input
                  type="text"
                  id="videoTitle"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder={t('dashboard.admin.videoPlaceholder')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('dashboard.admin.videoUrl')}
                </label>
                <input
                  type="text"
                  id="videoUrl"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder={t('dashboard.admin.videoUrlPlaceholder')}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={async () => {
                  if (!title || !content) {
                    toast.error(t('dashboard.admin.fillAllFields'));
                    return;
                  }
                  
                  try {
                    await api.put('/api/settings', {
                      project_video_url: content,
                      project_video_title: title
                    });
                    toast.success(t('dashboard.admin.videoUpdated'));
                    // Réinitialiser les champs après la mise à jour
                    setContent('');
                    setTitle('');
                  } catch (error) {
                    toast.error(t('dashboard.admin.videoUpdateFailed'));
                    console.error(error);
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                {t('dashboard.admin.saveVideo')}
              </button>
            </div>
          </div>
          </div>
          </div>
          )}

          {/* Section: Validation de Projets */}
          {activeSection === 'validation' && (
          <div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="space-y-4">
            {pendingData?.projects?.length ? pendingData.projects.map((p) => (
              <div key={p.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                <div className="font-medium text-gray-900">{p.title}</div>
                <div className="text-sm text-gray-600">{p.description?.slice(0,120)}...</div>
                <textarea
                  className="mt-3 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder={t('dashboard.admin.notesPlaceholder')}
                  value={notesById[p.id] || ''}
                  onChange={(e) => setNotesById({ ...notesById, [p.id]: e.target.value })}
                />
                <div className="flex gap-2 mt-3">
                  <button
                    className="inline-flex items-center justify-center px-3 py-2 rounded-md text-white bg-emerald-600 hover:bg-emerald-700 text-sm"
                    onClick={() => validateMutation.mutate({ id: p.id, action: 'approve', notes: notesById[p.id] })}
                  >{t('dashboard.admin.approve')}</button>
                  <button
                    className="inline-flex items-center justify-center px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-sm"
                    onClick={() => validateMutation.mutate({ id: p.id, action: 'reject', notes: notesById[p.id] })}
                  >{t('dashboard.admin.reject')}</button>
                </div>
              </div>
            )) : (
              <div className="text-gray-500 text-sm">{t('dashboard.admin.noProjects')}</div>
            )}
          </div>
          <div className="flex items-center justify-between mt-4">
            <button
              className="inline-flex items-center justify-center px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-sm"
              disabled={projPage <= 1}
              onClick={() => setProjPage((p) => Math.max(1, p - 1))}
            >{t('dashboard.admin.previous')}</button>
            <div className="text-sm text-gray-600">
              {t('dashboard.admin.page')} {pendingData?.pagination?.page || projPage} / {pendingData?.pagination?.pages || 1}
            </div>
            <button
              className="inline-flex items-center justify-center px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-sm"
              disabled={pendingData?.pagination?.page >= pendingData?.pagination?.pages}
              onClick={() => setProjPage((p) => p + 1)}
            >{t('dashboard.admin.next')}</button>
          </div>
          </div>
          </div>
          )}

          {/* Section: Activité Récente */}
          {activeSection === 'activity' && (
          <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">📋 {t('dashboard.admin.recentActivityProjects')}</h3>
            <div className="space-y-3">
              {dashboard?.recentProjects?.length ? dashboard.recentProjects.map((rp) => (
                <div key={rp.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{rp.title}</div>
                    <div className="text-xs text-gray-500">{rp.farmer_name} • {new Date(rp.created_at).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    rp.status === 'validated' ? 'bg-green-100 text-green-700' :
                    rp.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    rp.status === 'active' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>{rp.status}</span>
                </div>
              )) : (
                <div className="text-gray-500 text-sm">{t('dashboard.admin.noRecentActivity')}</div>
              )}
            </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">💰 {t('dashboard.admin.recentActivityInvestments')}</h3>
            <div className="space-y-3">
              {dashboard?.recentInvestments?.length ? dashboard.recentInvestments.map((ri, idx) => (
                <div key={idx} className="flex items-center justify-between border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{ri.project_title}</div>
                    <div className="text-xs text-gray-500">{ri.investor_name} • {new Date(ri.created_at).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <div className="text-sm font-semibold text-green-600">${Number(ri.amount_usd).toFixed(2)}</div>
                </div>
              )) : (
                <div className="text-gray-500 text-sm">{t('dashboard.admin.noRecentActivity')}</div>
              )}
            </div>
            </div>
          </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
