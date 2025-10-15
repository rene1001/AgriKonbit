import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';
import BackButton from '../../components/common/BackButton';

const Notifications = () => {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data, isLoading, isError, error } = useQuery(['notifications-page'], async () => {
    const res = await api.get(endpoints.notifications.list, { params: { page: 1, limit: 20 } });
    return res.data.data;
  });

  const markAllMutation = useMutation(async () => {
    await api.patch(endpoints.notifications.markAllRead);
  }, {
    onSuccess: () => { toast.success(t('notifications.allReadSuccess', 'Toutes les notifications ont été marquées comme lues')); qc.invalidateQueries(['notifications-page']); qc.invalidateQueries(['notifications']); qc.invalidateQueries(['notifications-unread-count']); },
    onError: (e) => toast.error(e?.response?.data?.message || t('common.operationFailed', "Échec de l'opération"))
  });

  const markRead = async (id) => {
    try {
      await api.patch(endpoints.notifications.markRead(id));
      qc.invalidateQueries(['notifications-page']);
      qc.invalidateQueries(['notifications']);
      qc.invalidateQueries(['notifications-unread-count']);
    } catch (e) {
      toast.error(e?.response?.data?.message || t('common.operationFailed', "Échec de l'opération"));
    }
  };

  const deleteOne = async (id) => {
    try {
      await api.delete(endpoints.notifications.delete(id));
      qc.invalidateQueries(['notifications-page']);
      qc.invalidateQueries(['notifications']);
      qc.invalidateQueries(['notifications-unread-count']);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Échec de l\'opération');
    }
  };

  const notifications = data?.notifications || [];
  const unreadCount = data?.unread_count || 0;

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('notifications.title', 'Notifications')}</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{t('notifications.unread', 'Non lues')}: {unreadCount}</span>
            <button className="btn btn-outline" onClick={() => markAllMutation.mutate()} disabled={markAllMutation.isLoading || unreadCount === 0}>{t('notifications.markAll', 'Tout marquer comme lu')}</button>
            <BackButton />
          </div>
        </div>

        {isLoading && <div className="card">{t('common.loadingEllipsis', 'Chargement…')}</div>}
        {isError && <div className="card text-red-700">{error?.message || t('common.error', 'Erreur')}</div>}

        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} className={`p-3 border rounded flex items-start justify-between ${n.is_read ? 'bg-white' : 'bg-gray-50 border-primary-200'}`}>
              <div className="flex items-start gap-3 pr-3">
                <div className={`mt-2 h-2 w-2 rounded-full ${n.is_read ? 'bg-gray-300' : 'bg-primary-500'}`}></div>
                <div>
                  <div className={`font-medium ${n.is_read ? '' : 'text-gray-900'}`}>{n.title || t('notifications.one', 'Notification')}</div>
                  <div className="text-sm text-gray-700">{n.message}</div>
                  <div className="text-xs text-gray-500 mt-1">{new Date(n.created_at).toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!n.is_read && <button className="btn btn-outline btn-sm" onClick={() => markRead(n.id)}>{t('notifications.markRead', 'Marquer comme lue')}</button>}
                <button className="btn btn-outline btn-sm text-red-600 border-red-200" onClick={() => deleteOne(n.id)}>{t('notifications.delete', 'Supprimer')}</button>
              </div>
            </div>
          ))}
          {notifications.length === 0 && !isLoading && (
            <div className="card text-gray-600">{t('notifications.empty', 'Aucune notification.')}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
