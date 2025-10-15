import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { api, endpoints } from '../utils/api';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { t } = useTranslation();
  const { theme, changeTheme } = useTheme();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ 
    fullName: '', 
    phone: '', 
    country: '', 
    city: '', 
    address: '',
    bio: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get(endpoints.users.profile);
      const u = res.data.data;
      setProfile(u);
      setForm({
        fullName: u.full_name || '',
        phone: u.phone || '',
        country: u.country || '',
        city: u.city || '',
        address: u.address || '',
        bio: u.bio || ''
      });
    } catch (error) {
      toast.error(t('profile.loadError', 'Erreur lors du chargement du profil'));
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put(endpoints.users.updateProfile, {
        fullName: form.fullName,
        phone: form.phone,
        country: form.country,
        city: form.city,
        address: form.address,
        bio: form.bio
      });
      toast.success(t('profile.updateSuccess', 'Profil mis à jour avec succès!'));
      setIsEditing(false);
      loadProfile();
    } catch (e) {
      toast.error(t('profile.updateError', 'Erreur lors de la mise à jour'));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('\n═══════════════════════════════════════════');
    console.log('📸 UPLOAD PHOTO - DEBUG FRONTEND');
    console.log('═══════════════════════════════════════════');
    console.log('Fichier sélectionné:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: new Date(file.lastModified).toISOString()
    });

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      console.error('❌ Fichier trop volumineux:', file.size, 'bytes');
      toast.error(t('profile.photo.tooLarge', "L'image ne doit pas dépasser 5 Mo"));
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('❌ Type de fichier invalide:', file.type);
      toast.error(t('profile.photo.invalidType', 'Le fichier doit être une image'));
      return;
    }

    console.log('✅ Validations passées');

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('profileImage', file);
      
      console.log('FormData créé avec champ "profileImage"');
      console.log('URL cible:', endpoints.users.uploadProfileImage);
      console.log('Token présent:', !!localStorage.getItem('token'));
      
      console.log('\n🚀 Envoi de la requête...\n');

      const res = await api.post(endpoints.users.uploadProfileImage, formData);
      
      console.log('✅ SUCCÈS - Réponse:', res.data);
      
      if (res.data.success) {
        // Mettre à jour immédiatement l'image dans l'état local
        setProfile(prev => ({
          ...prev,
          profile_image: res.data.data.profile_image
        }));
        toast.success(res.data.message || t('profile.photo.updated', 'Photo de profil mise à jour!'));
      }
    } catch (error) {
      console.error('\n❌ ERREUR UPLOAD');
      console.error('Status:', error.response?.status);
      console.error('Status Text:', error.response?.statusText);
      console.error('Data:', error.response?.data);
      console.error('Headers:', error.response?.headers);
      console.error('Erreur complète:', error);
      console.log('═══════════════════════════════════════════\n');
      
      const errorMsg = error.response?.data?.message || t('profile.photo.uploadError', "Erreur lors de l'upload de l'image");
      toast.error(errorMsg);
    } finally {
      setUploading(false);
      // Reset input pour permettre de ré-uploader la même image
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteImage = async () => {
    if (!window.confirm(t('profile.photo.confirmDelete', 'Voulez-vous vraiment supprimer votre photo de profil?'))) {
      return;
    }

    try {
      const res = await api.delete(endpoints.users.deleteProfileImage);
      if (res.data.success) {
        // Mettre à jour immédiatement l'image dans l'état local
        setProfile(prev => ({
          ...prev,
          profile_image: null
        }));
        toast.success(res.data.message || t('profile.photo.deleted', 'Photo de profil supprimée'));
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || t('profile.photo.deleteError', 'Erreur lors de la suppression');
      toast.error(errorMsg);
    }
  };

  const handleThemeChange = async (newTheme) => {
    try {
      await changeTheme(newTheme);
      toast.success(t('profile.theme.changed', 'Thème changé: {{theme}}', { theme: newTheme === 'light' ? t('profile.theme.light', 'Clair') : newTheme === 'dark' ? t('profile.theme.dark', 'Sombre') : t('profile.theme.auto', 'Auto') }));
    } catch (error) {
      toast.error(t('profile.theme.error', 'Erreur lors du changement de thème'));
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error(t('profile.password.mismatch', 'Les mots de passe ne correspondent pas'));
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error(t('profile.password.tooShort', 'Le mot de passe doit contenir au moins 6 caractères'));
      return;
    }

    try {
      await api.put(endpoints.users.changePassword, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success(t('profile.password.changed', 'Mot de passe changé avec succès!'));
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || t('profile.password.changeError', 'Erreur lors du changement de mot de passe'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('profile.loading', 'Chargement du profil...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t('profile.title', 'Mon Profil')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Image & Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Image Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mx-auto mb-4">
                    {profile?.profile_image ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:3001'}${profile.profile_image}?t=${Date.now()}`}
                        alt={t('profile.photo.alt', 'Profil')}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Image load error:', e);
                          e.target.onerror = null;
                          e.target.src = '';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                        👤
                      </div>
                    )}
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {profile?.full_name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{profile?.email}</p>
                <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-sm font-medium">
                  {profile?.role}
                </span>

                <div className="mt-6 space-y-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {uploading ? t('profile.photo.uploading', 'Upload...') : t('profile.photo.change', '📷 Changer la photo')}
                  </button>
                  {profile?.profile_image && (
                    <button
                      onClick={handleDeleteImage}
                      className="w-full px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition"
                    >
                      {t('profile.photo.delete', '🗑️ Supprimer la photo')}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Theme Selector Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('profile.theme.title', '🎨 Thème')}</h3>
              <div className="space-y-2">
                {[{ value: 'light', label: t('profile.theme.lightLabel', 'Clair ☀️'), icon: '☀️' },
                  { value: 'dark', label: t('profile.theme.darkLabel', 'Sombre 🌙'), icon: '🌙' },
                  { value: 'auto', label: t('profile.theme.autoLabel', 'Auto 🔄'), icon: '🔄' }].map((themeOption) => (
                  <button
                    key={themeOption.value}
                    onClick={() => handleThemeChange(themeOption.value)}
                    className={`w-full px-4 py-3 rounded-lg text-left transition ${
                      theme === themeOption.value
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {themeOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('profile.account.title', '💼 Compte')}</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.account.kycStatus', 'Statut KYC')}</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    profile?.kyc_status === 'verified' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                    profile?.kyc_status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {profile?.kyc_status || t('profile.account.kycUnknown', 'non vérifié')}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.account.balance', 'Solde DOLLAR')}</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {parseFloat(profile?.gyt_balance || 0).toFixed(2)} DOLLAR
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('profile.info.title', '📋 Informations Personnelles')}</h2>
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
                <form onSubmit={updateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('profile.info.fullName', 'Nom complet *')}
                      </label>
                      <input
                        type="text"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('profile.info.phone', 'Téléphone')}
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('profile.info.country', 'Pays')}
                      </label>
                      <input
                        type="text"
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('profile.info.city', 'Ville')}
                      </label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('profile.info.address', 'Adresse')}
                      </label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('profile.info.bio', 'Bio / Description (max 500 caractères)')}
                      </label>
                      <textarea
                        value={form.bio}
                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                        rows="4"
                        maxLength="500"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder={t('profile.info.bioPlaceholder', 'Parlez-nous de vous...')}
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t('profile.info.bioCount', '{{count}}/500 caractères', { count: form.bio.length })}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        // Reset form
                        setForm({
                          fullName: profile?.full_name || '',
                          phone: profile?.phone || '',
                          country: profile?.country || '',
                          city: profile?.city || '',
                          address: profile?.address || '',
                          bio: profile?.bio || ''
                        });
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      {t('common.cancel', 'Annuler')}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      {t('common.save', '💾 Enregistrer')}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.info.fullNameShort', 'Nom complet')}</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">{profile?.full_name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.info.email', 'Email')}</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">{profile?.email || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.info.phone', 'Téléphone')}</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">{profile?.phone || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.info.country', 'Pays')}</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">{profile?.country || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.info.city', 'Ville')}</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">{profile?.city || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.info.address', 'Adresse')}</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">{profile?.address || '-'}</p>
                    </div>
                  </div>
                  {profile?.bio && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('profile.info.bioShort', 'Bio')}</p>
                      <p className="text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{profile.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Security Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('profile.security.title', '🔐 Sécurité')}</h2>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                {t('profile.security.changePassword', 'Changer le mot de passe')}
              </button>
            </div>
          </div>
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('profile.security.changePassword', 'Changer le mot de passe')}</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('profile.security.currentPassword', 'Mot de passe actuel')}
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('profile.security.newPassword', 'Nouveau mot de passe')}
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                    minLength="6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('profile.security.confirmPassword', 'Confirmer le mot de passe')}
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    {t('common.save', 'Enregistrer')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
