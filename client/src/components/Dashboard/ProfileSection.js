import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';

const ProfileSection = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    country: '',
    city: '',
    address: ''
  });

  const { data: profile } = useQuery(['profile'], async () => {
    const res = await api.get(endpoints.users.profile);
    return res.data.data;
  }, {
    onSuccess: (data) => {
      setFormData({
        fullName: data.full_name || '',
        phone: data.phone || '',
        country: data.country || '',
        city: data.city || '',
        address: data.address || ''
      });
    }
  });

  const updateProfileMutation = useMutation(
    async (data) => {
      const res = await api.put(endpoints.users.updateProfile, data);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['profile']);
        queryClient.invalidateQueries(['me']);
        setIsEditing(false);
        toast.success('Profil mis à jour avec succès !');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">👤 Mon Profil</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              ✏️ Modifier
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pays
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={updateProfileMutation.isLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                {updateProfileMutation.isLoading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Nom complet</p>
              <p className="text-base font-medium text-gray-900">{profile?.full_name || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base font-medium text-gray-900">{profile?.email || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              <p className="text-base font-medium text-gray-900">{profile?.phone || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Rôle</p>
              <p className="text-base font-medium text-gray-900">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {profile?.role || 'farmer'}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pays</p>
              <p className="text-base font-medium text-gray-900">{profile?.country || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ville</p>
              <p className="text-base font-medium text-gray-900">{profile?.city || '-'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Adresse</p>
              <p className="text-base font-medium text-gray-900">{profile?.address || '-'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💼 Informations du Compte</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Statut KYC</p>
            <p className="text-base font-medium">
              <span className={`px-3 py-1 rounded-full text-sm ${
                profile?.kyc_status === 'verified' ? 'bg-green-100 text-green-800' :
                profile?.kyc_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {profile?.kyc_status || 'not_verified'}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Solde GYT</p>
            <p className="text-base font-bold text-green-600">
              {parseFloat(profile?.gyt_balance || 0).toFixed(2)} GYT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
