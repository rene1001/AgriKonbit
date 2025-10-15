import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app: {
        name: 'AgriKonbit'
      },
      footer: {
        companyDescription: "Connecting farmers to investors for a sustainable agricultural future through blockchain.",
        platform: 'Platform',
        support: 'Support',
        company: 'Company',
        howItWorks: 'How it works',
        forFarmers: 'For farmers',
        forInvestors: 'For investors',
        marketplace: 'Marketplace',
        helpCenter: "Help center",
        contactUs: 'Contact us',
        terms: "Terms of use",
        privacy: 'Privacy policy',
        aboutUs: 'About us',
        careers: 'Careers',
        press: 'Press',
        blog: 'Blog',
        poweredBy: 'Powered by',
        rights: 'All rights reserved.'
      },
      cart: {
        title: 'Your cart',
        empty: 'Your cart is empty',
        subtotal: 'Subtotal',
        checkout: 'Checkout'
      },
      nav: {
        projects: 'Projects',
        marketplace: 'Marketplace',
        login: 'Login',
        register: 'Create account',
        dashboard: 'Dashboard',
        profile: 'Profile',
        admin: 'Administration',
        logout: 'Logout',
        cart: 'Cart',
        about: 'About'
      },
      dashboard: {
        consumer: {
          title: '🛍️ Consumer Dashboard',
          subtitle: 'Purchases, traceability and deliveries',
          notifications: 'Notifications',
          markAll: 'Mark all as read',
          viewAll: 'View all',
          none: 'No notifications',
          tabs: {
            overview: "📊 Overview",
            orders: '🧾 My orders',
            deliveries: '🚚 Deliveries',
            wallet: '💰 Wallet',
            favorites: '⭐ Favorites',
            subscriptions: '🔁 Subscriptions',
            profile: '👤 Profile',
            support: '🆘 Support'
          },
          stats: {
            balance: 'DOLLAR Balance',
            totalOrders: 'Total Orders',
            inProgress: 'In progress',
            delivered: 'Delivered'
          },
          recentOrders: 'My Recent Orders',
          noOrders: 'No orders yet',
          marketplaceCard: {
            title: 'Marketplace',
            desc: 'Buy products'
          },
          deliveriesCard: {
            title: 'Track deliveries',
            desc: 'Track your packages'
          },
          open: 'Open'
        },
        overview: {
          stats: {
            projectsActive: 'Active Projects',
            projectsTotal: 'Total',
            productsOnSale: 'Products on Sale',
            stock: 'Stock',
            units: 'units',
            ordersPending: 'Pending Orders',
            ordersTotal: 'Total',
            walletBalance: 'DOLLAR Balance',
            earned: 'Earned'
          }
        }
      },
      profilePage: {
        header: '👤 My Profile',
        edit: '✏️ Edit',
        save: 'Save',
        saving: 'Saving...',
        cancel: 'Cancel',
        fields: {
          fullName: 'Full Name',
          email: 'Email',
          phone: 'Phone',
          role: 'Role',
          country: 'Country',
          city: 'City',
          address: 'Address'
        },
        accountInfo: '💼 Account Information',
        kycStatus: 'KYC Status',
        kyc: {
          verified: 'verified',
          pending: 'pending',
          notVerified: 'not_verified'
        },
        balance: 'DOLLAR Balance'
      },
      home: {
        hero: {
          title: 'Sustainable Agriculture through Blockchain',
          subtitle: 'Connecting farmers with investors for a better future',
          cta: 'Get Started',
          ctaAlt: 'Learn More'
        }
      }
    }
  },
  es: {
    translation: {
      app: {
        name: 'AgriKonbit'
      },
      footer: {
        companyDescription: "Conectando agricultores con inversores para un futuro agrícola sostenible a través de blockchain.",
        platform: 'Plataforma',
        support: 'Soporte',
        company: 'Empresa',
        howItWorks: '¿Cómo funciona?',
        forFarmers: 'Para agricultores',
        forInvestors: 'Para inversores',
        marketplace: 'Mercado',
        helpCenter: "Centro de ayuda",
        contactUs: 'Contáctenos',
        terms: "Términos de uso",
        privacy: 'Política de privacidad',
        aboutUs: 'Sobre nosotros',
        careers: 'Carreras',
        press: 'Prensa',
        blog: 'Blog',
        poweredBy: 'Desarrollado por',
        rights: 'Todos los derechos reservados.'
      },
      nav: {
        projects: 'Proyectos',
        marketplace: 'Mercado',
        login: 'Iniciar sesión',
        register: 'Crear cuenta',
        dashboard: 'Panel',
        profile: 'Perfil',
        admin: 'Administración',
        logout: 'Cerrar sesión',
        cart: 'Carrito',
        about: 'Acerca de'
      },
      profilePage: {
        header: '👤 Mi Perfil',
        edit: '✏️ Editar',
        save: 'Guardar',
        saving: 'Guardando...',
        cancel: 'Cancelar',
        fields: {
          fullName: 'Nombre completo',
          email: 'Correo electrónico',
          phone: 'Teléfono',
          role: 'Rol',
          country: 'País',
          city: 'Ciudad',
          address: 'Dirección'
        },
        accountInfo: '💼 Información de la cuenta',
        kycStatus: 'Estado KYC',
        kyc: {
          verified: 'verificado',
          pending: 'pendiente',
          notVerified: 'no_verificado'
        },
        balance: 'Saldo DOLLAR'
      }
    }
  },
  fr: {
    translation: {
      app: {
        name: 'AgriKonbit'
      },
      footer: {
        companyDescription: "Connecter les agriculteurs aux investisseurs pour un avenir agricole durable grâce à la blockchain.",
        platform: 'Plateforme',
        support: 'Support',
        company: 'Entreprise',
        howItWorks: 'Comment ça marche',
        forFarmers: 'Pour les agriculteurs',
        forInvestors: 'Pour les investisseurs',
        marketplace: 'Marketplace',
        helpCenter: "Centre d'aide",
        contactUs: 'Nous contacter',
        terms: "Conditions d'utilisation",
        privacy: 'Politique de confidentialité',
        aboutUs: 'À propos',
        careers: 'Carrières',
        press: 'Presse',
        blog: 'Blog',
        poweredBy: 'Propulsé par',
        rights: 'Tous droits réservés.'
      },
      cart: {
        title: 'Votre panier',
        empty: 'Votre panier est vide',
        subtotal: 'Sous-total',
        checkout: 'Procéder au paiement'
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
      dashboard: {
        consumer: {
          title: '🛍️ Tableau de bord Consommateur',
          subtitle: 'Achats, traçabilité et livraisons',
          notifications: 'Notifications',
          markAll: 'Tout lire',
          viewAll: 'Voir tout',
          none: 'Aucune notification',
          tabs: {
            overview: "📊 Vue d'ensemble",
            orders: '🧾 Mes commandes',
            deliveries: '🚚 Livraisons',
            wallet: '💰 Portefeuille',
            favorites: '⭐ Favoris',
            subscriptions: '🔁 Abonnements',
            profile: '👤 Profil',
            support: '🆘 Support'
          },
          stats: {
            balance: 'Solde DOLLAR',
            totalOrders: 'Total Commandes',
            inProgress: 'En cours',
            delivered: 'Livrées'
          },
          recentOrders: 'Mes Commandes Récentes',
          noOrders: 'Aucune commande pour le moment',
          marketplaceCard: {
            title: 'Marketplace',
            desc: 'Acheter des produits'
          },
          deliveriesCard: {
            title: 'Suivi des livraisons',
            desc: 'Suivre vos colis'
          },
          open: 'Ouvrir'
        },
        overview: {
          stats: {
            projectsActive: 'Projets Actifs',
            projectsTotal: 'Total',
            productsOnSale: 'Produits en Vente',
            stock: 'Stock',
            units: 'unités',
            ordersPending: 'Commandes en Cours',
            ordersTotal: 'Total',
            walletBalance: 'Solde DOLLAR',
            earned: 'Gagné'
          },
          funding: {
            totalFunding: 'Financement Total',
            investors: 'Investisseurs',
            investments: 'investissements',
            marketplaceRevenue: 'Revenus Marketplace'
          },
          recentProjects: {
            title: '📋 Projets Récents',
            viewAll: 'Voir tous →',
            none: 'Aucun projet pour le moment',
            fundedPct: '{{pct}}% financé'
          },
          recentOrders: {
            title: '📦 Commandes Récentes',
            viewAll: 'Voir toutes →',
            none: 'Aucune commande pour le moment'
          },
          products: {
            title: '🛍️ Mes Produits',
            viewAll: 'Voir tous →',
            active: 'Actif',
            inactive: 'Inactif'
          }
        },
        finances: {
          wallet: {
            available: 'Solde Disponible',
            earned: 'Total Gagné',
            withdrawn: 'Total Retiré',
            unit: 'DOLLAR'
          },
          deposit: {
            title: '💰 Déposer des DOLLAR',
            desc: 'Achetez des DOLLAR pour vos achats ou investissements',
            amountLabel: 'Montant (USD → DOLLAR)',
            rate: 'Taux: 1 USD = 1 DOLLAR',
            stripe: 'Stripe',
            paypal: 'PayPal',
            metamask: 'MetaMask'
          },
          withdraw: {
            title: '💸 Retirer des Fonds',
            desc: 'Transférez vos gains vers votre compte bancaire ou portefeuille',
            cta: '💸 Retirer'
          },
          revenue: {
            title: '💵 Sources de Revenus',
            projects: 'Financement de Projets',
            marketplace: 'Ventes Marketplace'
          },
          investors: {
            title: '👥 Mes Investisseurs',
            investedUnit: 'DOLLAR',
            count: 'investissements',
            none: "Aucun investisseur pour le moment"
          },
          transactions: {
            title: '📊 Historique des Transactions',
            exportCsv: 'Export CSV',
            exportPdf: 'Export PDF',
            csvEmpty: 'Aucune donnée à exporter',
            table: {
              type: 'Type',
              description: 'Description',
              amount: 'Montant',
              status: 'Statut',
              date: 'Date'
            },
            none: 'Aucune transaction pour le moment'
          },
          modal: {
            withdrawTitle: '💸 Retirer des Fonds',
            amount: 'Montant (DOLLAR)',
            available: 'Disponible',
            method: 'Méthode de retrait',
            methods: {
              bank: 'Virement bancaire',
              mobile: 'Mobile Money',
              crypto: 'Portefeuille crypto'
            },
            destination: 'Destination (numéro de compte/wallet)',
            notes: 'Notes (optionnel)',
            notesPh: 'Informations supplémentaires...',
            cancel: 'Annuler',
            confirm: 'Confirmer',
            processing: 'Traitement...'
          }
        },
        projects: {
          header: '🌱 Gestion des Projets',
          newProject: '➕ Nouveau Projet',
          stats: {
            total: 'Total',
            pending: 'En attente',
            validated: 'Validés',
            active: 'Actifs',
            completed: 'Terminés'
          },
          buttons: {
            details: 'Voir détails',
            edit: 'Modifier',
            addUpdate: 'Ajouter MAJ'
          }
        },
        messaging: {
          header: '💬 Messages',
          new: '✉️ Nouveau',
          none: 'Aucune conversation',
          send: '📤 Envoyer',
          selectPrompt: 'Sélectionnez une conversation',
          orCreate: 'ou créez-en une nouvelle',
          modal: {
            title: '✉️ Nouveau Message',
            recipient: 'Destinataire *',
            investorsGroup: '📊 Mes Investisseurs',
            adminsGroup: '🛡️ Administrateurs',
            subject: 'Sujet',
            subjectPh: 'Ex: Mise à jour de mon projet',
            message: 'Message *',
            messagePh: 'Votre message...',
            cancel: 'Annuler',
            send: '📤 Envoyer'
          }
        },
        resources: {
          header: '📚 Centre de Ressources',
          tabs: {
            guides: '📖 Guides',
            videos: '🎥 Vidéos',
            faq: '❓ FAQ',
            support: '🛟 Support'
          },
          quickHelp: {
            title: '💡 Besoin d\'aide rapide ?',
            faq: 'Voir la FAQ',
            contact: 'Contacter le Support'
          }
        }
      },
      projectsPage: {
        title: 'Projets agricoles',
        total: '{{count}} projets',
        loading: 'Chargement des projets...',
        error: 'Échec du chargement des projets.',
        unknownError: 'Erreur inconnue',
        budget: 'Budget: {{amount}} DOLLAR',
        return: 'Rendement: {{percent}}% annuel',
        duration: 'Durée: {{days}} jours',
        details: 'Détails'
      },
      projectDetail: {
        loading: 'Chargement du projet...',
        loadError: 'Échec du chargement du projet.',
        back: '← Retour',
        cards: {
          budget: 'Budget',
          return: 'Rendement',
          returnYearly: '{{percent}}% annuel',
          duration: 'Durée',
          durationDays: '{{days}} jours',
          progress: 'Progression'
        },
        updates: 'Mises à jour du projet',
        noUpdates: 'Aucune mise à jour pour le moment.',
        amountLabel: 'Montant (DOLLAR)',
        investBtn: 'Investir avec le Portefeuille DOLLAR',
        processing: 'Traitement...',
        minInfo: 'Minimum 10 DOLLAR. Vous pouvez aussi déposer des DOLLAR via Paiements.',
        goDashboard: 'Aller au tableau de bord',
        minError: 'Le montant minimum est 10 DOLLAR',
        investOk: 'Investissement réussi',
        investFail: "Échec de l'investissement"
      },
      checkoutPage: {
        title: 'Checkout',
        empty: 'Votre panier est vide.',
        totalsUSD: 'Total (USD)',
        totalsGYT: 'Total (DOLLAR)',
        yourBalance: 'Votre solde DOLLAR',
        insufficient: 'Solde insuffisant. Veuillez déposer des DOLLAR avant de poursuivre.',
        payButton: 'Payer avec DOLLAR Wallet',
        processing: 'Traitement…',
        tip: 'Astuce: Déposez des DOLLAR sur votre Tableau de bord.',
        success: 'Commande passée avec succès',
        createFailed: "La création de la commande a échoué",
        failed: 'Échec du paiement'
      },
      walletPage: {
        title: 'Portefeuille Dollar',
        topup: 'Recharger',
        balanceAvailable: 'Solde disponible',
        approx: '≈ ${{usd}} USD @ {{rate}} USD/$',
        topupCardTitle: 'Recharger en Dollar',
        topupCardDesc: 'Stripe ou PayPal (démo)',
        openForm: 'Ouvrir le formulaire',
        infoTitle: 'Informations',
        infoDesc: 'Taux indicatif • Pas de frais réels • Transactions de test',
        historyTitle: 'Historique',
        historySubtitle: 'Dernières opérations',
        noTransactions: 'Aucune transaction.',
        prev: 'Précédent',
        next: 'Suivant',
        pageXofY: 'Page {{page}} / {{pages}}',
        modalTitle: 'Recharger le portefeuille',
        amountLabel: 'Montant (DOLLAR)',
        amountPh: 'Ex: 50',
        providerLabel: 'Fournisseur de paiement',
        stripe: 'Stripe',
        paypal: 'PayPal',
        cancel: 'Annuler',
        continue: 'Continuer',
        demoNote: 'Démo: pas de frais réels, transactions simulées.',
        summaryAmount: 'Montant',
        summaryFees: 'Frais (simulés)',
        summaryTotal: 'Total débité',
        summaryApprox: '≈ ${{usd}} USD • Fournisseur: {{provider}}',
        edit: 'Modifier',
        confirm: 'Confirmer',
        confirming: 'Traitement…',
        toastInvalid: 'Montant invalide',
        toastTopupOk: 'Rechargement effectué',
        toastTopupFail: 'Échec du rechargement'
      },
      farmerOrders: {
        title: 'Mes Commandes',
        loading: 'Chargement…',
        empty: 'Aucune commande',
        client: 'Client',
        items: 'Articles',
        itemsCount: '{{count}} produit(s)',
        total: 'Total',
        date: 'Date'
      },
      addProduct: {
        title: 'Ajouter un produit',
        nameLabel: 'Nom du produit',
        namePh: "Ex: Tomates bio, Miel artisanal...",
        descLabel: 'Description',
        descPh: "Décrivez votre produit, ses caractéristiques, son mode de production...",
        priceLabel: 'Prix (DOLLAR)',
        pricePh: '0.00',
        stockLabel: 'Stock',
        stockPh: 'Quantité disponible',
        unitLabel: 'Unité',
        unit: {
          kg: 'Kilogrammes (kg)',
          g: 'Grammes (g)',
          l: 'Litres (l)',
          ml: 'Millilitres (ml)',
          piece: 'Pièce(s)',
          box: 'Boîte(s)',
          bottle: 'Bouteille(s)'
        },
        categoryLabel: 'Catégorie',
        category: {
          crops: 'Cultures',
          livestock: 'Élevage',
          dairy: 'Produits laitiers',
          honey: 'Miel',
          fruits: 'Fruits',
          vegetables: 'Légumes',
          grains: 'Céréales',
          other: 'Autre'
        },
        locationLabel: 'Localisation',
        locationPh: 'Ex: Port-au-Prince, Cap-Haïtien...',
        imagesLabel: 'Images du produit',
        imagesPh: "https://... ou URL d'image",
        addImage: 'Ajouter',
        removeImage: 'Supprimer',
        submit: 'Ajouter le produit',
        submitting: 'Ajout en cours...',
        toastName: 'Le nom du produit est requis (minimum 3 caractères)',
        toastDesc: 'La description doit contenir au moins 10 caractères',
        toastPrice: 'Le prix doit être supérieur à 0',
        toastStock: 'Le stock doit être un entier positif ou nul',
        toastLocation: 'La localisation doit contenir au moins 3 caractères',
        toastSuccess: 'Produit ajouté avec succès',
        toastFail: "Échec de l'ajout du produit"
      },
      profilePage: {
        header: '👤 Mon Profil',
        edit: '✏️ Modifier',
        save: 'Enregistrer',
        saving: 'Enregistrement...',
        cancel: 'Annuler',
        fields: {
          fullName: 'Nom complet',
          email: 'Email',
          phone: 'Téléphone',
          role: 'Rôle',
          country: 'Pays',
          city: 'Ville',
          address: 'Adresse'
        },
        accountInfo: '💼 Informations du Compte',
        kycStatus: 'Statut KYC',
        kyc: {
          verified: 'verified',
          pending: 'pending',
          notVerified: 'not_verified'
        },
        balance: 'Solde DOLLAR'
      },
      home: {
        heroTitle: 'Investissez pour Haïti. Soutenez les agriculteurs haïtiens. Récoltons ensemble les fruits d\'un développement durable.',
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
        testimonials: 'Témoignages',
        viewAll: 'Voir tout',
        loadingProjects: 'Chargement des projets...',
        errorProjects: 'Impossible de charger les projets.',
        loadingProducts: 'Chargement des produits...',
        errorProducts: 'Impossible de charger les produits.',
        cards: {
          investDesc: 'Trouvez et financez des projets agricoles.',
          buyDesc: 'Achetez des produits traçables et certifiés.',
          submitDesc: 'Publiez votre projet et obtenez des fonds.'
        },
        stats: {
          investors: 'Investisseurs',
          funded: 'Financés',
          farmers: 'Agriculteurs'
        },
        features: {
          token: 'Dollar',
          tokenDesc: 'Rendement 5–10%/an ou produits physiques.',
          verified: 'Projets vérifiés',
          verifiedDesc: 'Revue par des experts et mises à jour régulières.',
          traceability: 'Traçabilité',
          traceabilityDesc: 'Authenticité via NFT de lot.'
        },
        project: {
          budget: 'Budget: {{amount}} DOLLAR',
          estimatedReturn: 'Rendement estimé: {{percent}}% annuel',
          duration: 'Durée: {{days}} jours',
          details: 'Détails'
        },
        product: {
          view: 'Voir'
        }
      }
    }
  },
  en: {
    translation: {
      app: { name: 'AgriKonbit' },
      footer: {
        companyDescription: 'Connecting farmers with investors to build a sustainable agricultural future through blockchain technology.',
        platform: 'Platform',
        support: 'Support',
        company: 'Company',
        howItWorks: 'How it Works',
        forFarmers: 'For Farmers',
        forInvestors: 'For Investors',
        marketplace: 'Marketplace',
        helpCenter: 'Help Center',
        contactUs: 'Contact Us',
        terms: 'Terms of Service',
        privacy: 'Privacy Policy',
        aboutUs: 'About Us',
        careers: 'Careers',
        press: 'Press',
        blog: 'Blog',
        poweredBy: 'Powered by',
        rights: 'All rights reserved.'
      },
      cart: {
        title: 'Your Cart',
        empty: 'Your cart is empty',
        subtotal: 'Subtotal',
        checkout: 'Proceed to Checkout'
      },
      nav: {
        projects: 'Projects',
        marketplace: 'Marketplace',
        login: 'Login',
        register: 'Register',
        dashboard: 'Dashboard',
        profile: 'Profile',
        admin: 'Admin',
        logout: 'Logout',
        cart: 'Cart',
        about: 'About'
      },
      dashboard: {
        consumer: {
          title: '🛍️ Consumer Dashboard',
          subtitle: 'Purchases, traceability and deliveries',
          notifications: 'Notifications',
          markAll: 'Mark all read',
          viewAll: 'View all',
          none: 'No notifications',
          tabs: {
            overview: '📊 Overview',
            orders: '🧾 My Orders',
            deliveries: '🚚 Deliveries',
            wallet: '💰 Wallet',
            favorites: '⭐ Favorites',
            subscriptions: '🔁 Subscriptions',
            profile: '👤 Profile',
            support: '🆘 Support'
          },
          stats: {
            balance: 'DOLLAR Balance',
            totalOrders: 'Total Orders',
            inProgress: 'In progress',
            delivered: 'Delivered'
          },
          recentOrders: 'My Recent Orders',
          noOrders: 'No orders yet',
          marketplaceCard: { title: 'Marketplace', desc: 'Buy products' },
          deliveriesCard: { title: 'Delivery tracking', desc: 'Track your packages' },
          open: 'Open'
        }
      },
      profilePage: {
        header: '👤 My Profile',
        edit: '✏️ Edit',
        save: 'Save',
        saving: 'Saving...',
        cancel: 'Cancel',
        fields: {
          fullName: 'Full name',
          email: 'Email',
          phone: 'Phone',
          role: 'Role',
          country: 'Country',
          city: 'City',
          address: 'Address'
        },
        accountInfo: '💼 Account Information',
        kycStatus: 'KYC Status',
        kyc: {
          verified: 'verified',
          pending: 'pending',
          notVerified: 'not_verified'
        },
        balance: 'DOLLAR Balance'
      },
      home: {
        heroTitle: 'Invest in agriculture. Empower farmers. Earn sustainable returns.',
        heroSubtitle: 'AgriKonbit connects investors with farmers through blockchain transparency and traceability.',
        exploreProjects: 'Explore Projects',
        shopMarketplace: 'Shop Marketplace',
        featuredProjects: 'Featured Projects',
        featuredProducts: 'Featured Products',
        ctas: {
          invest: 'Invest',
          buy: 'Buy',
          submit: 'Submit Project'
        },
        testimonials: 'Testimonials',
        viewAll: 'View all',
        loadingProjects: 'Loading projects...',
        errorProjects: 'Failed to load projects.',
        loadingProducts: 'Loading products...',
        errorProducts: 'Failed to load products.',
        cards: {
          investDesc: 'Find and fund agricultural projects.',
          buyDesc: 'Buy traceable and certified products.',
          submitDesc: 'Publish your project and get funding.'
        },
        stats: {
          investors: 'Investors',
          funded: 'Funded',
          farmers: 'Farmers'
        },
        features: {
          token: 'Dollar',
          tokenDesc: 'Return 5–10%/year or physical products.',
          verified: 'Verified projects',
          verifiedDesc: 'Expert review and regular updates.',
          traceability: 'Traceability',
          traceabilityDesc: 'Authenticity via batch NFT.'
        },
        project: {
          budget: 'Budget: {{amount}} DOLLAR',
          estimatedReturn: 'Estimated return: {{percent}}% yearly',
          duration: 'Duration: {{days}} days',
          details: 'Details'
        },
        product: {
          view: 'View'
        }
      },
      checkoutPage: {
        title: 'Checkout',
        empty: 'Your cart is empty.',
        totalsUSD: 'Total (USD)',
        totalsGYT: 'Total (DOLLAR)',
        yourBalance: 'Your DOLLAR balance',
        insufficient: 'Insufficient balance. Please deposit DOLLAR before continuing.',
        payButton: 'Pay with DOLLAR Wallet',
        processing: 'Processing…',
        tip: 'Tip: Deposit DOLLAR from your Dashboard.',
        success: 'Order placed successfully',
        createFailed: 'Order creation failed',
        failed: 'Checkout failed'
      },
      walletPage: {
        title: 'DOLLAR Wallet',
        topup: 'Top up',
        balanceAvailable: 'Available balance',
        approx: '≈ ${{usd}} USD @ {{rate}} USD/$',
        topupCardTitle: 'Top up DOLLAR',
        topupCardDesc: 'Stripe or PayPal (demo)',
        openForm: 'Open form',
        infoTitle: 'Information',
        infoDesc: 'Indicative rate • No real fees • Test transactions',
        historyTitle: 'History',
        historySubtitle: 'Latest operations',
        noTransactions: 'No transactions.',
        prev: 'Previous',
        next: 'Next',
        pageXofY: 'Page {{page}} / {{pages}}',
        modalTitle: 'Top up wallet',
        amountLabel: 'Amount (DOLLAR)',
        amountPh: 'Ex: 50',
        providerLabel: 'Payment provider',
        stripe: 'Stripe',
        paypal: 'PayPal',
        cancel: 'Cancel',
        continue: 'Continue',
        demoNote: 'Demo: no real fees, simulated transactions.',
        summaryAmount: 'Amount',
        summaryFees: 'Fees (simulated)',
        summaryTotal: 'Total charged',
        summaryApprox: '≈ ${{usd}} USD • Provider: {{provider}}',
        edit: 'Edit',
        confirm: 'Confirm',
        confirming: 'Processing…',
        toastInvalid: 'Invalid amount',
        toastTopupOk: 'Top up completed',
        toastTopupFail: 'Top up failed'
      },
      projectsPage: {
        title: 'Agricultural Projects',
        total: '{{count}} projects',
        loading: 'Loading projects...',
        error: 'Failed to load projects.',
        unknownError: 'Unknown error',
        budget: 'Budget: {{amount}} DOLLAR',
        return: 'Return: {{percent}}% yearly',
        duration: 'Duration: {{days}} days',
        details: 'Details'
      }
    }
  },
  es: {
    translation: {
      app: { name: 'AgriKonbit' },
      footer: {
        companyDescription: 'Conectamos agricultores e inversores para un futuro agrícola sostenible mediante tecnología blockchain.',
        platform: 'Plataforma',
        support: 'Soporte',
        company: 'Compañía',
        howItWorks: 'Cómo funciona',
        forFarmers: 'Para agricultores',
        forInvestors: 'Para inversores',
        marketplace: 'Mercado',
        helpCenter: 'Centro de ayuda',
        contactUs: 'Contáctanos',
        terms: 'Términos del servicio',
        privacy: 'Política de privacidad',
        aboutUs: 'Acerca de nosotros',
        careers: 'Carreras',
        press: 'Prensa',
        blog: 'Blog',
        poweredBy: 'Impulsado por',
        rights: 'Todos los derechos reservados.'
      },
      cart: {
        title: 'Tu carrito',
        empty: 'Tu carrito está vacío',
        subtotal: 'Subtotal',
        checkout: 'Proceder al pago'
      },
      nav: {
        projects: 'Proyectos',
        marketplace: 'Mercado',
        login: 'Iniciar sesión',
        register: 'Crear cuenta',
        dashboard: 'Panel',
        profile: 'Perfil',
        admin: 'Administración',
        logout: 'Salir',
        cart: 'Carrito',
        about: 'Acerca de'
      },
      dashboard: {
        consumer: {
          title: '🛍️ Panel del Consumidor',
          subtitle: 'Compras, trazabilidad y entregas',
          notifications: 'Notificaciones',
          markAll: 'Marcar todo como leído',
          viewAll: 'Ver todo',
          none: 'Sin notificaciones',
          tabs: {
            overview: '📊 Resumen',
            orders: '🧾 Mis pedidos',
            deliveries: '🚚 Entregas',
            wallet: '💰 Billetera',
            favorites: '⭐ Favoritos',
            subscriptions: '🔁 Suscripciones',
            profile: '👤 Perfil',
            support: '🆘 Soporte'
          },
          stats: {
            balance: 'Saldo DOLLAR',
            totalOrders: 'Pedidos totales',
            inProgress: 'En curso',
            delivered: 'Entregados'
          },
          recentOrders: 'Mis pedidos recientes',
          noOrders: 'Aún no hay pedidos',
          marketplaceCard: { title: 'Mercado', desc: 'Comprar productos' },
          deliveriesCard: { title: 'Seguimiento de entregas', desc: 'Rastrea tus paquetes' },
          open: 'Abrir'
        }
      },
      profilePage: {
        header: '👤 Mi Perfil',
        edit: '✏️ Editar',
        save: 'Guardar',
        saving: 'Guardando...',
        cancel: 'Cancelar',
        fields: {
          fullName: 'Nombre completo',
          email: 'Correo',
          phone: 'Teléfono',
          role: 'Rol',
          country: 'País',
          city: 'Ciudad',
          address: 'Dirección'
        },
        accountInfo: '💼 Información de la cuenta',
        kycStatus: 'Estado KYC',
        kyc: {
          verified: 'verified',
          pending: 'pending',
          notVerified: 'not_verified'
        },
        balance: 'Saldo DOLLAR'
      },
      home: {
        heroTitle: 'Invierta en agricultura. Empodere a los agricultores. Rendimientos sostenibles.',
        heroSubtitle: 'AgriKonbit conecta inversores y agricultores con transparencia y trazabilidad en blockchain.',
        exploreProjects: 'Explorar Proyectos',
        shopMarketplace: 'Ir al Mercado',
        featuredProjects: 'Proyectos destacados',
        featuredProducts: 'Productos destacados',
        ctas: {
          invest: 'Invertir',
          buy: 'Comprar',
          submit: 'Enviar proyecto'
        },
        testimonials: 'Testimonios',
        viewAll: 'Ver todo',
        loadingProjects: 'Cargando proyectos...',
        errorProjects: 'No se pudieron cargar los proyectos.',
        loadingProducts: 'Cargando productos...',
        errorProducts: 'No se pudieron cargar los productos.',
        cards: {
          investDesc: 'Encuentre y financie proyectos agrícolas.',
          buyDesc: 'Compre productos trazables y certificados.',
          submitDesc: 'Publique su proyecto y obtenga financiación.'
        },
        stats: {
          investors: 'Inversores',
          funded: 'Financiados',
          farmers: 'Agricultores'
        },
        features: {
          token: 'Dólar',
          tokenDesc: 'Rendimiento 5–10%/año o productos físicos.',
          verified: 'Proyectos verificados',
          verifiedDesc: 'Revisión experta y actualizaciones regulares.',
          traceability: 'Trazabilidad',
          traceabilityDesc: 'Autenticidad mediante NFT de lote.'
        },
        project: {
          budget: 'Presupuesto: {{amount}} DOLLAR',
          estimatedReturn: 'Rendimiento estimado: {{percent}}% anual',
          duration: 'Duración: {{days}} días',
          details: 'Detalles'
        },
        product: {
          view: 'Ver'
        }
      },
      checkoutPage: {
        title: 'Pagar',
        empty: 'Tu carrito está vacío.',
        totalsUSD: 'Total (USD)',
        totalsGYT: 'Total (DOLLAR)',
        yourBalance: 'Tu saldo DOLLAR',
        insufficient: 'Saldo insuficiente. Deposita DOLLAR antes de continuar.',
        payButton: 'Pagar con Billetera DOLLAR',
        processing: 'Procesando…',
        tip: 'Consejo: Deposita DOLLAR desde tu Panel.',
        success: 'Pedido realizado con éxito',
        createFailed: 'Falló la creación del pedido',
        failed: 'Pago fallido'
      },
      walletPage: {
        title: 'Billetera DOLLAR',
        topup: 'Recargar',
        balanceAvailable: 'Saldo disponible',
        approx: '≈ ${{usd}} USD @ {{rate}} USD/$',
        topupCardTitle: 'Recargar DOLLAR',
        topupCardDesc: 'Stripe o PayPal (demo)',
        openForm: 'Abrir formulario',
        infoTitle: 'Información',
        infoDesc: 'Tasa indicativa • Sin tarifas reales • Transacciones de prueba',
        historyTitle: 'Historial',
        historySubtitle: 'Últimas operaciones',
        noTransactions: 'Sin transacciones.',
        prev: 'Anterior',
        next: 'Siguiente',
        pageXofY: 'Página {{page}} / {{pages}}',
        modalTitle: 'Recargar billetera',
        amountLabel: 'Monto (DOLLAR)',
        amountPh: 'Ej: 50',
        providerLabel: 'Proveedor de pago',
        stripe: 'Stripe',
        paypal: 'PayPal',
        cancel: 'Cancelar',
        continue: 'Continuar',
        demoNote: 'Demo: sin tarifas reales, transacciones simuladas.',
        summaryAmount: 'Monto',
        summaryFees: 'Tarifas (simuladas)',
        summaryTotal: 'Total cobrado',
        summaryApprox: '≈ ${{usd}} USD • Proveedor: {{provider}}',
        edit: 'Editar',
        confirm: 'Confirmar',
        confirming: 'Procesando…',
        toastInvalid: 'Monto inválido',
        toastTopupOk: 'Recarga completada',
        toastTopupFail: 'Fallo la recarga'
      },
      projectsPage: {
        title: 'Proyectos agrícolas',
        total: '{{count}} proyectos',
        loading: 'Cargando proyectos...',
        error: 'No se pudieron cargar los proyectos.',
        unknownError: 'Error desconocido',
        budget: 'Presupuesto: {{amount}} DOLLAR',
        return: 'Rendimiento: {{percent}}% anual',
        duration: 'Duración: {{days}} días',
        details: 'Detalles'
      }
    }
  }
};

// Determine initial language: saved in localStorage, else browser, else FR
let initialLng = 'fr';
try {
  const saved = typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('i18n_lng') : null;
  if (saved) initialLng = saved;
  else if (typeof navigator !== 'undefined' && navigator.language) {
    initialLng = navigator.language.slice(0, 2);
  }
} catch (_) {
  // ignore
}

i18n.use(initReactI18next).init({
  resources,
  lng: initialLng,
  fallbackLng: 'fr',
  interpolation: { escapeValue: false }
});

// Persist language changes and update <html> attributes
i18n.on('languageChanged', (lng) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('i18n_lng', lng);
    }
  } catch (_) { /* ignore */ }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
    const rtl = ['ar', 'fa', 'he', 'ur'];
    document.documentElement.dir = rtl.includes(lng) ? 'rtl' : 'ltr';
  }
});

export default i18n;
