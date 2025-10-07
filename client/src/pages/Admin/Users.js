import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';

const Users = () => {
  const qc = useQueryClient();
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const { data, isLoading, isError } = useQuery(['admin-users', role, status, page, limit], async () => {
    const res = await api.get(endpoints.admin.users, {
      params: {
        role: role || undefined,
        status: status || undefined,
        page,
        limit
      }
    });
    return res.data.data;
  });

  const updateStatus = useMutation(
    async ({ id, isActive }) => {
      return api.patch(endpoints.admin.updateUserStatus(id), { isActive });
    },
    {
      onSuccess: () => {
        toast.success('Utilisateur mis à jour');
        qc.invalidateQueries(['admin-users']);
      },
      onError: () => toast.error('Action impossible')
    }
  );

  const updateRole = useMutation(
    async ({ id, role }) => {
      return api.patch(endpoints.admin.updateUserRole(id), { role });
    },
    {
      onSuccess: () => {
        toast.success('Rôle mis à jour');
        qc.invalidateQueries(['admin-users']);
      },
      onError: () => toast.error('Changement de rôle impossible')
    }
  );

  if (isLoading) return <div className="max-w-7xl mx-auto p-6">Chargement…</div>;
  if (isError) return <div className="max-w-7xl mx-auto p-6 text-red-600">Échec du chargement.</div>;

  const users = data?.users || [];
  const pagination = data?.pagination || { page, pages: 1 };

  const handleExport = async () => {
    try {
      const response = await api.get(endpoints.reports.exportUsers, {
        params: { format: 'csv' },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users-export-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Export réussi');
    } catch (error) {
      toast.error('Échec de l\'export');
    }
  };

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Utilisateurs</h1>
          <button
            onClick={handleExport}
            className="btn btn-outline btn-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exporter CSV
          </button>
        </div>

        <div className="bg-white border rounded-lg p-4 mb-4 flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Rôle</label>
            <select className="border rounded p-2 text-sm" value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}>
              <option value="">Tous</option>
              <option value="farmer">Agriculteur</option>
              <option value="investor">Investisseur</option>
              <option value="consumer">Consommateur</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Statut</label>
            <select className="border rounded p-2 text-sm" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              <option value="">Tous</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
        </div>

        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-3">Nom</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Rôle</th>
                <th className="text-left p-3">KYC</th>
                <th className="text-left p-3">Actif</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.full_name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <select
                      className="border rounded p-1 text-sm"
                      value={u.role}
                      onChange={(e) => updateRole.mutate({ id: u.id, role: e.target.value })}
                    >
                      <option value="investor">Investisseur</option>
                      <option value="farmer">Agriculteur</option>
                      <option value="consumer">Consommateur</option>
                      <option value="moderator">Modérateur</option>
                    </select>
                  </td>
                  <td className="p-3">{u.kyc_status}</td>
                  <td className="p-3">{u.is_active ? 'Oui' : 'Non'}</td>
                  <td className="p-3">
                    {u.is_active ? (
                      <button className="btn btn-outline btn-sm" onClick={() => updateStatus.mutate({ id: u.id, isActive: false })}>Désactiver</button>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={() => updateStatus.mutate({ id: u.id, isActive: true })}>Activer</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            className="btn btn-outline btn-sm"
            disabled={(pagination.page || page) <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >Précédent</button>
          <div className="text-sm text-gray-600">
            Page {pagination.page || page} / {pagination.pages || 1}
          </div>
          <button
            className="btn btn-outline btn-sm"
            disabled={(pagination.page || page) >= (pagination.pages || 1)}
            onClick={() => setPage((p) => p + 1)}
          >Suivant</button>
        </div>
      </div>
    </div>
  );
};

export default Users;
