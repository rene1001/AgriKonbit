import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const ResourcesSection = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('guides');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const guides = [
    {
      id: 1,
      title: '🌱 Guide du Démarrage - Créer son Premier Projet',
      category: 'Débutant',
      description: 'Apprenez à créer votre premier projet agricole sur AgriKonbit et à attirer des investisseurs.',
      duration: '10 min',
      topics: ['Création de projet', 'Budget', 'Description', 'Photos']
    },
    {
      id: 2,
      title: '💰 Maximiser vos Chances de Financement',
      category: 'Financement',
      description: 'Stratégies pour rendre votre projet attractif et obtenir un financement complet.',
      duration: '15 min',
      topics: ['Présentation', 'ROI', 'Transparence', 'Communication']
    },
    {
      id: 3,
      title: '🛒 Vendre sur la Marketplace AgriKonbit',
      category: 'Marketplace',
      description: 'Comment mettre en vente vos produits et gérer vos commandes efficacement.',
      duration: '12 min',
      topics: ['Photos produits', 'Prix', 'Stock', 'Livraison']
    },
    {
      id: 4,
      title: '🌾 Bonnes Pratiques Agricoles',
      category: 'Agriculture',
      description: 'Techniques modernes et durables pour améliorer votre rendement.',
      duration: '20 min',
      topics: ['Sol', 'Irrigation', 'Fertilisation', 'Rotation']
    },
    {
      id: 5,
      title: '🐄 Guide de l\'Élevage Durable',
      category: 'Élevage',
      description: 'Pratiques recommandées pour un élevage rentable et respectueux.',
      duration: '18 min',
      topics: ['Nutrition', 'Santé', 'Reproduction', 'Bien-être animal']
    },
    {
      id: 6,
      title: '📊 Gérer vos Finances',
      category: 'Finances',
      description: 'Comprendre votre portefeuille DOLLAR et optimiser vos retraits.',
      duration: '8 min',
      topics: ['Portefeuille', 'Retraits', 'Transactions', 'Sécurité']
    }
  ];

  const faqs = [
    {
      id: 1,
      question: 'Comment créer mon premier projet ?',
      answer: 'Cliquez sur "Nouveau Projet" dans l\'onglet Projets, remplissez le formulaire avec les détails de votre projet (titre, description, budget, durée, localisation), ajoutez des photos, puis soumettez. Votre projet sera examiné par notre équipe avant validation.'
    },
    {
      id: 2,
      question: 'Combien de temps pour la validation d\'un projet ?',
      answer: 'La validation prend généralement 2-3 jours ouvrables. Notre équipe vérifie la qualité des informations et s\'assure que le projet respecte nos critères. Vous recevrez une notification dès que la décision est prise.'
    },
    {
      id: 3,
      question: 'Comment retirer mes gains ?',
      answer: 'Allez dans l\'onglet Finances, cliquez sur "Retirer", choisissez votre méthode (virement bancaire, mobile money, ou crypto), entrez le montant et votre destination. Les retraits sont traités sous 3-5 jours ouvrables.'
    },
    {
      id: 4,
      question: 'Quels sont les frais de la plateforme ?',
      answer: 'AgriKonbit prélève 5% sur les financements réussis et 3% sur les ventes marketplace. Il n\'y a pas de frais pour créer un projet ou lister des produits. Les frais de retrait varient selon la méthode choisie.'
    },
    {
      id: 5,
      question: 'Comment communiquer avec mes investisseurs ?',
      answer: 'Vous pouvez envoyer des messages directs via l\'onglet Messages, ou publier des mises à jour de projet que tous vos investisseurs recevront. Nous recommandons de communiquer régulièrement l\'avancement de votre projet.'
    },
    {
      id: 6,
      question: 'Que faire si mon projet n\'atteint pas son objectif ?',
      answer: 'Si le financement n\'atteint pas 100% à la fin de la durée, les fonds collectés sont retournés aux investisseurs. Vous pouvez alors modifier votre projet (budget, description) et le resoumettre après validation.'
    },
    {
      id: 7,
      question: 'Comment gérer les commandes sur la Marketplace ?',
      answer: 'Allez dans Marketplace > Commandes. Vous verrez toutes les commandes reçues. Cliquez sur "Gérer" pour mettre à jour le statut (en préparation → expédié → livré). Pensez à ajouter un numéro de suivi pour les expéditions.'
    },
    {
      id: 8,
      question: 'Puis-je modifier un projet déjà validé ?',
      answer: 'Une fois validé, seules certaines informations peuvent être modifiées (mises à jour, photos additionnelles). Le budget et la durée ne peuvent pas être changés. Pour des modifications importantes, contactez le support.'
    }
  ];

  const support = [
    {
      icon: '💬',
      title: 'Chat en Direct',
      description: 'Discutez avec notre équipe en temps réel',
      action: 'Démarrer le chat',
      available: false
    },
    {
      icon: '✉️',
      title: 'Contacter le Support',
      description: 'Envoyez-nous un message via la messagerie',
      action: 'Envoyer un message',
      link: '/dashboard?tab=messages'
    },
    {
      icon: '📞',
      title: 'Assistance Téléphonique',
      description: 'Lun-Ven: 8h-18h (GMT-5)',
      action: '+509 1234-5678',
      link: 'tel:+50912345678'
    },
    {
      icon: '📧',
      title: 'Email',
      description: 'Réponse sous 24h',
      action: 'support@agrikonbit.com',
      link: 'mailto:support@agrikonbit.com'
    }
  ];

  const videos = [
    {
      id: 1,
      title: '🎥 Tutoriel: Créer votre premier projet',
      thumbnail: '🎬',
      duration: '5:30',
      views: '1.2k'
    },
    {
      id: 2,
      title: '🎥 Comment attirer des investisseurs',
      thumbnail: '🎬',
      duration: '8:15',
      views: '856'
    },
    {
      id: 3,
      title: '🎥 Vendre efficacement sur la Marketplace',
      thumbnail: '🎬',
      duration: '6:45',
      views: '2.1k'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">{t('dashboard.resources.header')}</h1>
        <p className="text-green-50">
          Guides, tutoriels et support pour vous aider à réussir sur AgriKonbit
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('guides')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                activeTab === 'guides'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('dashboard.resources.tabs.guides')}
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                activeTab === 'videos'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('dashboard.resources.tabs.videos')}
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                activeTab === 'faq'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('dashboard.resources.tabs.faq')}
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                activeTab === 'support'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('dashboard.resources.tabs.support')}
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Guides Tab */}
          {activeTab === 'guides' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guides.map((guide) => (
                <div key={guide.id} className="border rounded-lg p-6 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      {guide.category}
                    </span>
                    <span className="text-sm text-gray-500">⏱️ {guide.duration}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{guide.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {guide.topics.map((topic, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {topic}
                      </span>
                    ))}
                  </div>
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                    📖 Lire le guide
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Videos Tab */}
          {activeTab === 'videos' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="border rounded-lg overflow-hidden hover:shadow-md transition">
                  <div className="h-40 bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-6xl">
                    {video.thumbnail}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>⏱️ {video.duration}</span>
                      <span>👁️ {video.views} vues</span>
                    </div>
                    <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      ▶️ Regarder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="border rounded-lg">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    <span className="text-gray-400 text-xl">
                      {expandedFaq === faq.id ? '−' : '+'}
                    </span>
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-4 pb-4 text-gray-600 border-t">
                      <p className="pt-4">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Support Tab */}
          {activeTab === 'support' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {support.map((item, idx) => (
                  <div key={idx} className="border rounded-lg p-6 hover:shadow-md transition">
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                    {item.link ? (
                      <Link
                        to={item.link}
                        className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        {item.action}
                      </Link>
                    ) : (
                      <button
                        disabled={item.available === false}
                        className={`px-4 py-2 rounded-lg transition ${
                          item.available === false
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {item.action}
                        {item.available === false && ' (Bientôt disponible)'}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Help */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-2">{t('dashboard.resources.quickHelp.title')}</h3>
                <p className="text-blue-700 mb-4">
                  Consultez d'abord notre FAQ, la plupart des réponses s'y trouvent !
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveTab('faq')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {t('dashboard.resources.quickHelp.faq')}
                  </button>
                  <Link
                    to="/dashboard?tab=messages"
                    className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                  >
                    {t('dashboard.resources.quickHelp.contact')}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourcesSection;
