import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api, endpoints } from '../../utils/api';
import toast from 'react-hot-toast';

const MessagingSection = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newMessageRecipient, setNewMessageRecipient] = useState('');
  const [newMessageSubject, setNewMessageSubject] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');
  const [messageContent, setMessageContent] = useState('');
  
  const queryClient = useQueryClient();

  // Fetch conversations
  const { data: conversationsData } = useQuery(['conversations'], async () => {
    const res = await api.get(endpoints.messages.conversations);
    return res.data.data;
  });

  // Fetch messages for selected conversation
  const { data: messagesData } = useQuery(
    ['conversation-messages', selectedConversation],
    async () => {
      if (!selectedConversation) return null;
      const res = await api.get(endpoints.messages.conversationMessages(selectedConversation));
      return res.data.data;
    },
    { enabled: !!selectedConversation }
  );

  // Fetch investors list
  const { data: investorsData } = useQuery(['investors-list'], async () => {
    const res = await api.get(endpoints.messages.investorsList);
    return res.data.data;
  });

  // Fetch admins list
  const { data: adminsData } = useQuery(['admins-list'], async () => {
    const res = await api.get(endpoints.messages.admins);
    return res.data.data;
  });

  // Send message mutation
  const sendMessageMutation = useMutation(
    async (data) => {
      const res = await api.post(endpoints.messages.send, data);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['conversations']);
        queryClient.invalidateQueries(['conversation-messages']);
        setMessageContent('');
        setNewMessageContent('');
        setNewMessageSubject('');
        setShowNewMessage(false);
        toast.success('Message envoyé avec succès !');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Erreur lors de l'envoi du message");
      }
    }
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageContent.trim() || !selectedConversation) return;

    const conversation = conversationsData?.conversations?.find(c => c.id === selectedConversation);
    if (!conversation) return;

    sendMessageMutation.mutate({
      receiver_id: conversation.other_user_id,
      content: messageContent
    });
  };

  const handleNewMessage = (e) => {
    e.preventDefault();
    if (!newMessageRecipient || !newMessageContent.trim()) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    sendMessageMutation.mutate({
      receiver_id: parseInt(newMessageRecipient),
      subject: newMessageSubject,
      content: newMessageContent
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="h-[calc(100vh-250px)] flex gap-6">
      {/* Conversations List */}
      <div className="w-1/3 bg-white rounded-lg shadow-sm flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">💬 Messages</h2>
            <button
              onClick={() => setShowNewMessage(true)}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
            >
              ✉️ Nouveau
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversationsData?.conversations?.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 border-b cursor-pointer transition ${
                selectedConversation === conversation.id
                  ? 'bg-green-50 border-l-4 border-l-green-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 truncate">
                      {conversation.other_user_name}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      conversation.other_user_role === 'investor' 
                        ? 'bg-blue-100 text-blue-700'
                        : conversation.other_user_role === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {conversation.other_user_role}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conversation.last_message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(conversation.last_message_at)}
                  </p>
                </div>
                {conversation.unread_count > 0 && (
                  <span className="ml-2 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                    {conversation.unread_count}
                  </span>
                )}
              </div>
            </div>
          ))}

          {(!conversationsData?.conversations || conversationsData.conversations.length === 0) && (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg mb-2">📭</p>
              <p>Aucune conversation</p>
              <button
                onClick={() => setShowNewMessage(true)}
                className="mt-4 text-green-600 hover:underline text-sm"
              >
                Envoyer votre premier message
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col">
        {selectedConversation ? (
          <>
            {/* Messages Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">
                    {conversationsData?.conversations?.find(c => c.id === selectedConversation)?.other_user_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {conversationsData?.conversations?.find(c => c.id === selectedConversation)?.other_user_role}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messagesData?.messages?.map((message) => {
                const isOwn = message.sender_id === parseInt(localStorage.getItem('userId'));
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${
                      isOwn
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    } rounded-lg p-3`}>
                      {message.subject && (
                        <p className={`font-semibold mb-1 text-sm ${
                          isOwn ? 'text-green-50' : 'text-gray-700'
                        }`}>
                          {message.subject}
                        </p>
                      )}
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        isOwn ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {formatDate(message.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Send Message Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Tapez votre message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!messageContent.trim() || sendMessageMutation.isLoading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  📤 Envoyer
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-4xl mb-4">💬</p>
              <p className="text-lg">Sélectionnez une conversation</p>
              <p className="text-sm mt-2">ou créez-en une nouvelle</p>
            </div>
          </div>
        )}
      </div>

      {/* New Message Modal */}
      {showNewMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">✉️ Nouveau Message</h3>
            
            <form onSubmit={handleNewMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destinataire *
                </label>
                <select
                  value={newMessageRecipient}
                  onChange={(e) => setNewMessageRecipient(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner...</option>
                  <optgroup label="📊 Mes Investisseurs">
                    {investorsData?.investors?.map((investor) => (
                      <option key={`investor-${investor.id}`} value={investor.id}>
                        {investor.full_name} - {investor.total_invested_gyt} GYT investis
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🛡️ Administrateurs">
                    {adminsData?.admins?.map((admin) => (
                      <option key={`admin-${admin.id}`} value={admin.id}>
                        {admin.full_name} (Support)
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  value={newMessageSubject}
                  onChange={(e) => setNewMessageSubject(e.target.value)}
                  placeholder="Ex: Mise à jour de mon projet"
                  maxLength={200}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  value={newMessageContent}
                  onChange={(e) => setNewMessageContent(e.target.value)}
                  placeholder="Votre message..."
                  rows={6}
                  maxLength={2000}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {newMessageContent.length} / 2000 caractères
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewMessage(false);
                    setNewMessageRecipient('');
                    setNewMessageSubject('');
                    setNewMessageContent('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!newMessageRecipient || !newMessageContent.trim() || sendMessageMutation.isLoading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  📤 Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingSection;
