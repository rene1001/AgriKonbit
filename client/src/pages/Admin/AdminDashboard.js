import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';
import { 
  RolesDistributionChart, 
  ProjectsStatusChart, 
  RevenueComparisonChart,
  GrowthSummaryCards 
} from '../../components/admin/AnalyticsCharts';

  const AdminDashboard = () => {
  const qc = useQueryClient();
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
        toast.success('Projet mis à jour');
        qc.invalidateQueries(['pending-projects']);
      },
      onError: () => toast.error('Action échouée')
    }
  );

  // Broadcast mutations
  const broadcastPrivate = useMutation(
    async (payload) => {
      return api.post(endpoints.messages.adminBroadcastPrivate, payload);
    },
    {
      onSuccess: () => {
        toast.success('Messages privés envoyés');
        setSubject('');
        setContent('');
      },
      onError: () => toast.error('Échec de l\'envoi des messages privés')
    }
  );

  const broadcastAnnouncement = useMutation(
    async (payload) => {
      return api.post(endpoints.messages.adminBroadcastNotification, payload);
    },
    {
      onSuccess: () => {
        toast.success('Annonce envoyée');
        setTitle('');
        setContent('');
      },
      onError: () => toast.error('Échec de l\'envoi de l\'annonce')
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
      if (!content.trim()) return toast.error('Contenu requis');
      broadcastPrivate.mutate({ ...payload, subject: subject || null, content });
    } else {
      if (!content.trim()) return toast.error('Message requis');
      broadcastAnnouncement.mutate({ ...payload, title: title || 'Annonce', message: content });
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
      
      toast.success('Export réussi');
    } catch (error) {
      toast.error('Échec de l\'export');
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero header */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-emerald-100 mt-1">Vue d’ensemble, actions rapides et analytics de la plateforme</p>
            </div>
            <div className="flex gap-2">
              <Link to="/admin/users" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition">
                <span>👥</span>
                <span>Utilisateurs</span>
              </Link>
              <Link to="/admin/products" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition">
                <span>🛒</span>
                <span>Produits</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500">Utilisateurs</div>
                <div className="mt-1 text-3xl font-semibold">{dashboard?.stats?.total_users || 0}</div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">👤</div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500">Projets</div>
                <div className="mt-1 text-3xl font-semibold">{dashboard?.stats?.total_projects || 0}</div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">📁</div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500">Commandes</div>
                <div className="mt-1 text-3xl font-semibold">{dashboard?.stats?.total_orders || 0}</div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">🧾</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="text-sm text-gray-500">Projets validés</div>
            <div className="text-2xl font-bold mt-1">{dashboard?.stats?.validated_projects || 0}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="text-sm text-gray-500">Total investi (USD)</div>
            <div className="text-2xl font-bold mt-1">{Number(dashboard?.stats?.total_invested_usd || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="text-sm text-gray-500">Revenus marketplace (USD)</div>
            <div className="text-2xl font-bold mt-1">{Number(dashboard?.stats?.total_revenue_usd || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          </div>
        </div>

        {/* Broadcast messaging (Admin) */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4">🗣️ Communication Globale</h2>
          <form onSubmit={handleBroadcastSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Type</label>
                <select className="border rounded p-2 text-sm w-full" value={broadcastType} onChange={(e) => setBroadcastType(e.target.value)}>
                  <option value="private">Message privé (inbox)</option>
                  <option value="announcement">Annonce (notification)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Portée</label>
                <select className="border rounded p-2 text-sm w-full" value={scope} onChange={(e) => setScope(e.target.value)}>
                  <option value="all">Tous les utilisateurs</option>
                  <option value="role">Par rôle</option>
                  <option value="users">Par IDs utilisateurs</option>
                </select>
              </div>
              <div className="flex items-center gap-2 mt-6 md:mt-6">
                <input id="includeAdmins" type="checkbox" className="h-4 w-4" checked={includeAdmins} onChange={(e) => setIncludeAdmins(e.target.checked)} />
                <label htmlFor="includeAdmins" className="text-sm text-gray-700">Inclure les admins</label>
              </div>
            </div>

            {scope === 'role' && (
              <div>
                <label className="block text-xs text-gray-600 mb-1">Rôles cibles</label>
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
                <label className="block text-xs text-gray-600 mb-1">IDs utilisateurs (séparés par des virgules)</label>
                <input type="text" className="border rounded p-2 text-sm w-full" placeholder="ex: 12, 45, 78" value={userIdsText} onChange={(e) => setUserIdsText(e.target.value)} />
              </div>
            )}

            {broadcastType === 'private' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-xs text-gray-600 mb-1">Sujet (optionnel)</label>
                  <input type="text" className="border rounded p-2 text-sm w-full" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Sujet du message" />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs text-gray-600 mb-1">Contenu</label>
                  <textarea className="border rounded p-2 text-sm w-full" rows={3} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Votre message..." />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-xs text-gray-600 mb-1">Titre (optionnel)</label>
                  <input type="text" className="border rounded p-2 text-sm w-full" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre de l'annonce" />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs text-gray-600 mb-1">Message</label>
                  <textarea className="border rounded p-2 text-sm w-full" rows={3} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Votre annonce..." />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button type="submit" className="inline-flex items-center justify-center px-4 py-2 rounded-md text-white bg-emerald-600 hover:bg-emerald-700 text-sm disabled:opacity-60" disabled={broadcastPrivate.isLoading || broadcastAnnouncement.isLoading}>
                {broadcastType === 'private' ? (broadcastPrivate.isLoading ? 'Envoi...' : 'Envoyer message privé') : (broadcastAnnouncement.isLoading ? 'Envoi...' : 'Publier l\'annonce')}
              </button>
              <button type="button" onClick={() => { setSubject(''); setTitle(''); setContent(''); setSelectedRoles([]); setUserIdsText(''); }} className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-sm">Réinitialiser</button>
            </div>
          </form>
        </div>

        {/* Exports & Reports */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold">📊 Exports & Rapports</h2>
              <p className="text-sm text-gray-600">Téléchargez les données en format CSV pour analyse</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button onClick={() => handleExport('users')} className="group flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <span className="h-9 w-9 rounded-md bg-blue-50 text-blue-600 grid place-items-center group-hover:scale-105 transition">👥</span>
              <div className="text-left">
                <div className="font-medium text-sm">Utilisateurs</div>
                <div className="text-xs text-gray-500">CSV</div>
              </div>
            </button>
            <button onClick={() => handleExport('projects')} className="group flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <span className="h-9 w-9 rounded-md bg-green-50 text-green-600 grid place-items-center group-hover:scale-105 transition">📁</span>
              <div className="text-left">
                <div className="font-medium text-sm">Projets</div>
                <div className="text-xs text-gray-500">CSV</div>
              </div>
            </button>
            <button onClick={() => handleExport('investments')} className="group flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <span className="h-9 w-9 rounded-md bg-purple-50 text-purple-600 grid place-items-center group-hover:scale-105 transition">💹</span>
              <div className="text-left">
                <div className="font-medium text-sm">Investissements</div>
                <div className="text-xs text-gray-500">CSV</div>
              </div>
            </button>
            <button onClick={() => handleExport('orders')} className="group flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <span className="h-9 w-9 rounded-md bg-amber-50 text-amber-600 grid place-items-center group-hover:scale-105 transition">🧾</span>
              <div className="text-left">
                <div className="font-medium text-sm">Commandes</div>
                <div className="text-xs text-gray-500">CSV</div>
              </div>
            </button>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4">📈 Analytics & Métriques Clés</h2>
          <GrowthSummaryCards stats={dashboard?.stats} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">👥 Répartition des Utilisateurs</h2>
            <RolesDistributionChart stats={dashboard?.stats} />
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">📊 Statut des Projets</h2>
            <ProjectsStatusChart stats={dashboard?.stats} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4">💰 Comparaison Investissements vs Revenus</h2>
          <RevenueComparisonChart stats={dashboard?.stats} />
        </div>

        {/* Pending projects */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Projets en attente</h2>
          <div className="space-y-4">
            {pendingData?.projects?.length ? pendingData.projects.map((p) => (
              <div key={p.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                <div className="font-medium text-gray-900">{p.title}</div>
                <div className="text-sm text-gray-600">{p.description?.slice(0,120)}...</div>
                <textarea
                  className="mt-3 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Notes de validation (optionnel)"
                  value={notesById[p.id] || ''}
                  onChange={(e) => setNotesById({ ...notesById, [p.id]: e.target.value })}
                />
                <div className="flex gap-2 mt-3">
                  <button
                    className="inline-flex items-center justify-center px-3 py-2 rounded-md text-white bg-emerald-600 hover:bg-emerald-700 text-sm"
                    onClick={() => validateMutation.mutate({ id: p.id, action: 'approve', notes: notesById[p.id] })}
                  >Approuver</button>
                  <button
                    className="inline-flex items-center justify-center px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-sm"
                    onClick={() => validateMutation.mutate({ id: p.id, action: 'reject', notes: notesById[p.id] })}
                  >Rejeter</button>
                </div>
              </div>
            )) : (
              <div className="text-gray-500 text-sm">Aucun projet en attente.</div>
            )}
          </div>
          <div className="flex items-center justify-between mt-4">
            <button
              className="inline-flex items-center justify-center px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-sm"
              disabled={projPage <= 1}
              onClick={() => setProjPage((p) => Math.max(1, p - 1))}
            >Précédent</button>
            <div className="text-sm text-gray-600">
              Page {pendingData?.pagination?.page || projPage} / {pendingData?.pagination?.pages || 1}
            </div>
            <button
              className="inline-flex items-center justify-center px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-sm"
              disabled={pendingData?.pagination?.page >= pendingData?.pagination?.pages}
              onClick={() => setProjPage((p) => p + 1)}
            >Suivant</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">📋 Activité récente – Projets</h2>
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
                <div className="text-gray-500 text-sm">Aucune activité récente.</div>
              )}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">💰 Activité récente – Investissements</h2>
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
                <div className="text-gray-500 text-sm">Aucune activité récente.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
