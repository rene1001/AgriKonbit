import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api, endpoints } from '../../utils/api';

const NotificationsSection = () => {
  const queryClient = useQueryClient();

  const { data: notificationsData } = useQuery(['notifications-all'], async () => {
    const res = await api.get(endpoints.users.notifications, {
      params: { limit: 50 }
    });
    return res.data.data;
  });

  const markAsReadMutation = useMutation(
    async (notificationId) => {
      await api.patch(endpoints.users.markNotificationRead(notificationId));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications']);
        queryClient.invalidateQueries(['notifications-all']);
      }
    }
  );

  const markAllAsReadMutation = useMutation(
    async () => {
      await api.patch(endpoints.users.markAllNotificationsRead);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications']);
        queryClient.invalidateQueries(['notifications-all']);
      }
    }
  );

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'project_validated':
      case 'project_active':
        return '✅';
      case 'project_rejected':
        return '❌';
      case 'new_investment':
        return '💰';
      case 'order_received':
        return '📦';
      case 'order_update':
        return '🔄';
      case 'payment_received':
        return '💵';
      default:
        return '🔔';
    }
  };

  const unreadCount = notificationsData?.notifications?.filter(n => !n.is_read).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">🔔 Notifications</h2>
            <p className="text-sm text-gray-600 mt-1">
              {unreadCount > 0 ? `${unreadCount} notification(s) non lue(s)` : 'Toutes les notifications sont lues'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsReadMutation.mutate()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Tout marquer comme lu
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        {notificationsData?.notifications?.map((notification) => (
          <div
            key={notification.id}
            className={`p-6 hover:bg-gray-50 transition ${
              !notification.is_read ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.created_at).toLocaleString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <button
                      onClick={() => markAsReadMutation.mutate(notification.id)}
                      className="px-3 py-1 text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      Marquer comme lu
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {(!notificationsData?.notifications || notificationsData.notifications.length === 0) && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔕</div>
            <p className="text-gray-500 text-lg">Aucune notification pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsSection;
