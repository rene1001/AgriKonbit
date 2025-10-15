import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiTrendingUp, FiShoppingBag, FiShield, FiGlobe, FiArrowRight, FiStar } from 'react-icons/fi';
import { useQuery } from 'react-query';
import axios from 'axios';
import { api, endpoints } from '../utils/api';
import ImageWithFallback from '../components/common/ImageWithFallback';
import { resolveImageUrl, parseImagesArray } from '../utils/images';

const Home = () => {
  const { t } = useTranslation();
  const [videoData, setVideoData] = useState({ url: '', title: '' });
  
  useEffect(() => {
    const fetchVideoSettings = async () => {
      try {
        // Utiliser Promise.allSettled pour éviter qu'une erreur sur une requête n'arrête l'autre
        const [urlResponseResult, titleResponseResult] = await Promise.allSettled([
          axios.get('/api/settings/project_video_url'),
          axios.get('/api/settings/project_video_title')
        ]);
        
        // Extraire les réponses réussies
        const urlResponse = urlResponseResult.status === 'fulfilled' ? urlResponseResult.value : null;
        const titleResponse = titleResponseResult.status === 'fulfilled' ? titleResponseResult.value : null;
        
        // Vérifier si les données sont disponibles
        if (urlResponse && urlResponse.data && urlResponse.data.value) {
          const videoUrl = urlResponse.data.value;
          const videoTitle = titleResponse && titleResponse.data && titleResponse.data.value 
            ? titleResponse.data.value 
            : 'Vidéo explicative du projet';
          
          setVideoData({
            url: videoUrl,
            title: videoTitle
          });
        } else {
          // Aucune vidéo n'est définie ou erreur dans la récupération
          setVideoData({
            url: '',
            title: ''
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la vidéo:', error);
        // En cas d'erreur, ne pas afficher de vidéo
        setVideoData({
          url: '',
          title: ''
        });
      }
    };

    fetchVideoSettings();
  }, []);
  
  // Featured data
  const { data: featuredProjects, isLoading: loadingProjects, isError: errorProjects } = useQuery(
    ['home-featured-projects'],
    async () => {
      const res = await api.get(endpoints.projects.list, { params: { status: 'validated', limit: 3 } });
      return res.data?.data?.projects || [];
    },
    { retry: 1 }
  );

  const { data: featuredProducts, isLoading: loadingProductsList, isError: errorProductsList } = useQuery(
    ['home-featured-products'],
    async () => {
      const res = await api.get(endpoints.products.list, { params: { limit: 4 } });
      return res.data?.data?.products || [];
    },
    { retry: 1 }
  );
  return (
    <div className="">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="hero-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-shadow-lg">
                  {t('home.heroTitle')}
                </h1>
                <p className="text-lg text-white/90 mb-8 text-shadow-lg">
                  {t('home.heroSubtitle')}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/projects" className="btn btn-lg bg-white text-primary-700 hover:bg-gray-100">
                    {t('home.exploreProjects')}
                  </Link>
                  <Link to="/marketplace" className="btn btn-lg bg-black/60 text-white hover:bg-black/70 border border-black/40">
                    {t('home.shopMarketplace')}
                  </Link>
                </div>
              </div>
              <div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 shadow-xl">
                  <div className="grid grid-cols-3 gap-4 text-center text-white">
                    <div className="p-4">
                      <div className="text-3xl font-bold">1,240</div>
                      <div className="text-white/80">{t('home.stats.investors')}</div>
                    </div>
                    <div className="p-4">
                      <div className="text-3xl font-bold">$1.8M</div>
                      <div className="text-white/80">{t('home.stats.funded')}</div>
                    </div>
                    <div className="p-4">
                      <div className="text-3xl font-bold">320</div>
                      <div className="text-white/80">{t('home.stats.farmers')}</div>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center mb-2 text-primary-600">
                        <FiTrendingUp className="h-5 w-5 mr-2" />
                        <span className="font-semibold">{t('home.features.token')}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{t('home.features.tokenDesc')}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center mb-2 text-primary-600">
                        <FiShield className="h-5 w-5 mr-2" />
                        <span className="font-semibold">{t('home.features.verified')}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{t('home.features.verifiedDesc')}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center mb-2 text-primary-600">
                        <FiGlobe className="h-5 w-5 mr-2" />
                        <span className="font-semibold">{t('home.features.traceability')}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{t('home.features.traceabilityDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to actions */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/projects" className="card hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mr-4">
                  <FiTrendingUp className="text-primary-600 h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t('home.ctas.invest')}</h3>
                  <p className="text-gray-600 text-sm">{t('home.cards.investDesc')}</p>
                </div>
              </div>
            </Link>
            <Link to="/marketplace" className="card hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-secondary-100 flex items-center justify-center mr-4">
                  <FiShoppingBag className="text-secondary-600 h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t('home.ctas.buy')}</h3>
                  <p className="text-gray-600 text-sm">{t('home.cards.buyDesc')}</p>
                </div>
              </div>
            </Link>
            <Link to="/projects" className="card hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center mr-4">
                  <FiArrowRight className="text-accent-600 h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t('home.ctas.submit')}</h3>
                  <p className="text-gray-600 text-sm">{t('home.cards.submitDesc')}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Video Section - Enhanced Design */}
      {videoData.url && (
        <section className="py-16 bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Text content */}
              <div className="space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-primary-100">
                  <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Regardez notre histoire</span>
                </div>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {videoData.title}
                </h2>

                {/* Description */}
                <p className="text-lg text-gray-600 leading-relaxed">
                  Découvrez comment AgriKonbit révolutionne l'agriculture en Haïti en connectant agriculteurs, investisseurs et consommateurs sur une plateforme transparente et sécurisée.
                </p>

                {/* Stats or features */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">100% Transparent</div>
                      <div className="text-sm text-gray-500">Blockchain vérifié</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">100% Sécurisé</div>
                      <div className="text-sm text-gray-500">Paiements protégés</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Video */}
              <div className="relative group">
                {/* Video container with enhanced styling */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-3xl">
                  {/* Border gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  
                  {/* Video iframe with proper aspect ratio */}
                  <div className="relative bg-black" style={{ paddingBottom: '56.25%' }}>
                    <iframe 
                      src={videoData.url}
                      title={videoData.title}
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-secondary-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t('home.featuredProjects')}</h2>
            <Link to="/projects" className="text-primary-600 hover:text-primary-700 text-sm font-medium">{t('home.viewAll')}</Link>
          </div>
          {loadingProjects ? (
            <div>{t('home.loadingProjects')}</div>
          ) : errorProjects ? (
            <div className="text-sm text-red-600">{t('home.errorProjects')}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((p) => {
                const images = parseImagesArray(p.images);
                const mainImage = resolveImageUrl(images[0], '/api/placeholder/600/300');
                return (
                  <div key={p.id} className="card">
                    <div className="h-36 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                      <ImageWithFallback
                        src={mainImage}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        fallbackSrc="/api/placeholder/600/300"
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>{t('home.project.budget', { amount: p.budget_gyt })}</div>
                      <div>{t('home.project.estimatedReturn', { percent: p.estimated_return_pct })}</div>
                      <div>{t('home.project.duration', { days: p.duration_days })}</div>
                    </div>
                    <Link to={`/projects/${p.id}`} className="btn btn-primary mt-4">{t('home.project.details')}</Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t('home.featuredProducts')}</h2>
            <Link to="/marketplace" className="text-primary-600 hover:text-primary-700 text-sm font-medium">{t('home.viewAll')}</Link>
          </div>
          {loadingProductsList ? (
            <div>{t('home.loadingProducts')}</div>
          ) : errorProductsList ? (
            <div className="text-sm text-red-600">{t('home.errorProducts')}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p) => {
                const images = parseImagesArray(p.images);
                const mainImage = resolveImageUrl(images[0], '/api/placeholder/400/200');
                return (
                  <div key={p.id} className="card">
                    <div className="h-32 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                      <ImageWithFallback
                        src={mainImage}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        fallbackSrc="/api/placeholder/400/200"
                      />
                    </div>
                    <h3 className="font-semibold">{p.name}</h3>
                    <div className="text-gray-700 mt-1">${Number(p.price_usd).toFixed(2)}</div>
                    <Link to={`/marketplace/${p.id}`} className="btn btn-outline mt-3">{t('home.product.view')}</Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials (Avis) */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t('home.testimonials')}</h2>
            <div className="hidden sm:flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="h-5 w-5" />
              ))}
              <span className="ml-2 text-sm text-gray-600">4.9/5</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Michaëlle — 🇭🇹',
                role: 'Agricultrice à Kenscoff',
                photo: 'https://images.unsplash.com/photo-1542831371-d531d36971e6?q=80&w=400&auto=format&fit=crop',
                quote: 'Grâce à AgriKonbit, j’ai pu financer des serres pour mes légumes. Les investisseurs suivent nos progrès en temps réel.'
              },
              {
                name: 'Jean-Paul — 🇭🇹',
                role: 'Investisseur diaspora (Montréal)',
                photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
                quote: 'J’investis directement dans des projets haïtiens fiables. La traçabilité et les rendements en DOLLAR sont clairs.'
              },
              {
                name: 'Roseline — 🇭🇹',
                role: 'Consommatrice à Pétion-Ville',
                photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop',
                quote: 'J’achète du miel local sur la marketplace et je vérifie l’authenticité avec le QR code. Expérience au top.'
              },
              {
                name: 'Jacques — 🇭🇹',
                role: 'Investisseur au Cap-Haïtien',
                photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
                quote: 'Content de soutenir des coopératives de café. Les rendements en DOLLAR sont transparents et les mises à jour régulières.'
              },
              {
                name: 'Marise — 🇭🇹',
                role: 'Productrice de cacao à Dame-Marie',
                photo: 'https://images.unsplash.com/photo-1525130413817-d45c1d127c42?q=80&w=400&auto=format&fit=crop',
                quote: 'Avec le financement, nous avons modernisé la fermentation. La qualité a augmenté et les revenus aussi.'
              },
              {
                name: 'Pierre — 🇭🇹',
                role: 'Restaurateur à Jacmel',
                photo: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=400&auto=format&fit=crop',
                quote: 'Je privilégie des produits traçables via AgriKonbit pour mon restaurant. Mes clients apprécient l’origine garantie.'
              }
            ].map((t, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center gap-4">
                  <ImageWithFallback
                    src={t.photo}
                    alt={t.name}
                    className="h-14 w-14 rounded-full object-cover"
                    fallbackSrc="/api/placeholder/80/80"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="h-4 w-4" />
                    ))}
                  </div>
                  <p className="italic text-gray-700 mt-3">“{t.quote}”</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
