import React from 'react';
import { useQuery } from 'react-query';
import { api, endpoints } from '../../utils/api';

const MyProjects = () => {
  const { data, isLoading, isError } = useQuery(['farmer-projects'], async () => {
    const res = await api.get(endpoints.projects.farmerProjects);
    return res.data.data;
  });

  if (isLoading) return <div className="max-w-5xl mx-auto p-6">Chargement…</div>;
  if (isError) return <div className="max-w-5xl mx-auto p-6 text-red-600">Échec du chargement.</div>;

  const projects = data?.projects || [];

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Mes projets</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.id} className="card">
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-gray-600">Statut: {p.status}</div>
              <div className="text-sm text-gray-600">Collecté: {p.funded_amount_gyt} / {p.budget_gyt} DOLLAR</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProjects;
