import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      app: {
        name: 'AgriKonbit'
      },
      nav: {
        projects: 'Projets',
        marketplace: 'Marketplace',
        login: 'Connexion',
        register: 'Créer un compte',
        dashboard: 'Tableau de bord',
        profile: 'Profil',
        admin: 'Administration',
        logout: 'Déconnexion',
        cart: 'Panier',
        about: 'À propos'
      },
      home: {
        heroTitle: 'Investissez pour Haïti. Soutenez les agriculteurs haïtiens. Récoltons ensemble les fruits d’un développement durable.',
        heroSubtitle: 'AgriKonbit connecte investisseurs et agriculteurs avec transparence et traçabilité via la blockchain.',
        exploreProjects: 'Découvrir les projets',
        shopMarketplace: 'Accéder au marché',
        featuredProjects: 'Projets à la une',
        featuredProducts: 'Produits à la une',
        ctas: {
          invest: 'Investir',
          buy: 'Acheter',
          submit: 'Soumettre un projet'
        },
        testimonials: 'Témoignages'
      }
    }
  },
  en: {
    translation: {
      app: { name: 'AgriKonbit' },
      nav: {
        projects: 'Projects', marketplace: 'Marketplace', login: 'Login', register: 'Register', dashboard: 'Dashboard', profile: 'Profile', admin: 'Admin', logout: 'Logout', cart: 'Cart', about: 'About'
      },
      home: {
        heroTitle: 'Invest in agriculture. Empower farmers. Earn sustainable returns.',
        heroSubtitle: 'AgriKonbit connects investors with farmers through blockchain transparency and traceability.',
        exploreProjects: 'Explore Projects', shopMarketplace: 'Shop Marketplace', featuredProjects: 'Featured Projects', featuredProducts: 'Featured Products',
        ctas: { invest: 'Invest', buy: 'Buy', submit: 'Submit Project' }, testimonials: 'Testimonials'
      }
    }
  },
  es: {
    translation: {
      app: { name: 'AgriKonbit' },
      nav: {
        projects: 'Proyectos', marketplace: 'Mercado', login: 'Iniciar sesión', register: 'Crear cuenta', dashboard: 'Panel', profile: 'Perfil', admin: 'Administración', logout: 'Salir', cart: 'Carrito', about: 'Acerca de'
      },
      home: {
        heroTitle: 'Invierta en agricultura. Empodere a los agricultores. Rendimientos sostenibles.',
        heroSubtitle: 'AgriKonbit conecta inversores y agricultores con transparencia y trazabilidad en blockchain.',
        exploreProjects: 'Explorar Proyectos', shopMarketplace: 'Ir al Mercado', featuredProjects: 'Proyectos destacados', featuredProducts: 'Productos destacados',
        ctas: { invest: 'Invertir', buy: 'Comprar', submit: 'Enviar proyecto' }, testimonials: 'Testimonios'
      }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'fr',
  fallbackLng: 'fr',
  interpolation: { escapeValue: false }
});

export default i18n;
