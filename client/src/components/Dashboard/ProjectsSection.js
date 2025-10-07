import React from 'react';
import { Link } from 'react-router-dom';

const ProjectsSection = ({ stats, myProjects }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">🌱 Gestion des Projets</h2>
        <Link to="/farmer/submit-project" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
          ➕ Nouveau Projet
        </Link>
      </div>
      
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium">Total</p>
          <p className="text-2xl font-bold text-blue-900">{stats?.projects?.total_projects || 0}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-sm text-yellow-600 font-medium">En attente</p>
          <p className="text-2xl font-bold text-yellow-900">{stats?.projects?.pending_projects || 0}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium">Validés</p>
          <p className="text-2xl font-bold text-green-900">{stats?.projects?.validated_projects || 0}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-purple-600 font-medium">Actifs</p>
          <p className="text-2xl font-bold text-purple-900">{stats?.projects?.active_projects || 0}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 font-medium">Terminés</p>
          <p className="text-2xl font-bold text-gray-900">{stats?.projects?.completed_projects || 0}</p>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {myProjects?.map((project) => (
          <div key={project.id} className="border rounded-lg p-6 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'validated' ? 'bg-green-100 text-green-800' :
                    project.status === 'active' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    project.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    project.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="text-sm font-semibold text-gray-900">{project.budget_gyt} GYT</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Financé</p>
                    <p className="text-sm font-semibold text-gray-900">{project.funding_percentage || 0}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Investisseurs</p>
                    <p className="text-sm font-semibold text-gray-900">{project.investor_count || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Retour estimé</p>
                    <p className="text-sm font-semibold text-gray-900">{project.estimated_return_pct || 0}%</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(project.funding_percentage || 0, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 ml-4">
                <Link 
                  to={`/projects/${project.id}`} 
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition text-center"
                >
                  Voir détails
                </Link>
                {project.status === 'pending' && (
                  <Link 
                    to={`/farmer/edit-project/${project.id}`} 
                    className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition text-center"
                  >
                    Modifier
                  </Link>
                )}
                {(project.status === 'active' || project.status === 'completed') && (
                  <Link 
                    to={`/farmer/project-updates/${project.id}`} 
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition text-center"
                  >
                    Ajouter MAJ
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}

        {(!myProjects || myProjects.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Aucun projet pour le moment</p>
            <Link to="/farmer/submit-project" className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              Créer votre premier projet
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsSection;
