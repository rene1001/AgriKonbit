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
        continueShopping: 'Continue shopping',
        subtotal: 'Subtotal',
        checkout: 'Proceed to Checkout',
        remove: 'Remove'
      },
      notFound: {
        title: '404 - Not Found',
        message: 'The page you are looking for does not exist.',
        goHome: 'Go Home'
      },
      orderTracking: {
        title: 'Order Tracking',
        tracking: 'Tracking',
        nft: 'NFT',
        verify: 'Verify Authenticity',
        verifying: 'Verifying...',
        authenticity: 'Authenticity: OK',
        product: 'Product',
        origin: 'Origin',
        harvest: 'Harvest',
        noData: 'No NFT data.',
        failed: 'Verification failed'
      },
      orderTrackingDetail: {
        loading: 'Loading...',
        notFound: 'Order not found',
        backToDashboard: 'Back to dashboard',
        back: '← Back',
        title: 'Order Tracking',
        orderNumber: 'Order #',
        receivedQuestion: 'Have you received your order?',
        confirmReceipt: 'Confirm receipt to close the order',
        orderedItems: 'Ordered Items',
        farmer: 'Farmer:',
        quantity: 'Quantity:',
        orderHistory: 'Order History',
        shippingAddress: 'Shipping Address',
        confirmDelivery: 'Confirm Delivery',
        confirmMessage: 'Do you confirm that you have received your order in good condition?'
      },
      traceability: {
        title: 'Product Traceability',
        loading: 'Loading traceability...',
        notFound: 'Not found.',
        nftId: 'NFT ID',
        name: 'Name',
        description: 'Description'
      },
      projectsMap: {
        title: 'Projects Map',
        viewList: 'View list',
        loadError: 'Unable to load projects'
      },
      dashboard: {
        loading: 'Loading...',
        pleaseLogin: 'Please log in'
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
        admin: {
          title: 'Admin Dashboard',
          subtitle: 'Platform management',
          sections: {
            overview: 'Overview',
            treasury: 'Platform Treasury',
            funds: 'Funds Management',
            communication: 'Communication',
            reports: 'Reports & Exports',
            analytics: 'Analytics',
            config: 'Configuration',
            validation: 'Project Validation',
            activity: 'Recent Activity'
          },
          quickLinks: {
            users: 'Users',
            products: 'Products',
            projects: 'Projects'
          },
          projectUpdated: 'Project updated',
          actionFailed: 'Action failed',
          privateMessagesSent: 'Private messages sent',
          sendPrivateMessagesFailed: 'Failed to send messages',
          announcementSent: 'Announcement sent',
          sendAnnouncementFailed: 'Failed to send announcement',
          contentRequired: 'Content required',
          messageRequired: 'Message required',
          announcement: 'Announcement',
          exportSuccess: 'Export successful',
          exportFailed: 'Export failed'
        },
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
        heroTitle: 'Invest for Haiti. Support Haitian farmers. Let\'s harvest the fruits of sustainable development together.',
        heroSubtitle: 'AgriKonbit connects investors and farmers with transparency and traceability via blockchain.',
        exploreProjects: 'Explore Projects',
        shopMarketplace: 'Shop Marketplace',
        featuredProjects: 'Featured Projects',
        featuredProducts: 'Featured Products',
        ctas: {
          invest: 'Invest',
          buy: 'Buy',
          submit: 'Submit a project'
        },
        testimonials: 'Testimonials',
        viewAll: 'View all',
        loadingProjects: 'Loading projects...',
        errorProjects: 'Unable to load projects.',
        loadingProducts: 'Loading products...',
        errorProducts: 'Unable to load products.',
        cards: {
          investDesc: 'Find and fund agricultural projects.',
          buyDesc: 'Buy traceable and certified products.',
          submitDesc: 'Publish your project and get funding.'
        },
        watchOurStory: 'Watch our story',
        blockchainVerified: 'Blockchain verified',
        securePayments: 'Secure payments',
        stats: {
          investors: 'Investors',
          funded: 'Funded',
          farmers: 'Farmers'
        },
        features: {
          token: 'DOLLAR',
          tokenDesc: 'Yield 5–10%/year or physical products.',
          verified: 'Verified Projects',
          verifiedDesc: 'Reviewed by experts with regular updates.',
          traceability: 'Traceability',
          traceabilityDesc: 'Authenticity via batch NFT.'
        },
        project: {
          budget: 'Budget: {{amount}} DOLLAR',
          estimatedReturn: 'Estimated return: {{percent}}% annual',
          duration: 'Duration: {{days}} days',
          details: 'Details'
        },
        product: {
          view: 'View'
        },
        hero: {
          title: 'Sustainable Agriculture through Blockchain',
          subtitle: 'Connecting farmers with investors for a better future',
          cta: 'Get Started',
          ctaAlt: 'Learn More'
        }
      },
      marketplace: {
        title: 'Marketplace',
        loadingProducts: 'Loading products...',
        loadError: 'Failed to load products.',
        unknownError: 'Unknown error',
        filters: {
          title: 'Filters',
          search: 'Search',
          searchPlaceholder: 'Mango, honey...',
          category: 'Category',
          all: 'All',
          originCountry: 'Country of origin',
          originPlaceholder: 'Burkina Faso, ...',
          organicOnly: 'Organic only'
        },
        categories: {
          cereals: 'Cereals',
          fruits: 'Fruits',
          vegetables: 'Vegetables',
          honey: 'Honey',
          dairy: 'Dairy products',
          meat: 'Meat'
        },
        product: {
          by: 'By',
          inStock: 'in stock',
          details: 'Details',
          addToCart: 'Add to cart'
        }
      },
      productDetail: {
        loading: 'Loading product...',
        loadError: 'Failed to load product.',
        inStock: 'in stock',
        addToCart: 'Add to cart',
        viewTraceability: 'View traceability',
        origin: 'Origin',
        harvestDate: 'Harvest date',
        certifiedOrganic: 'Certified organic',
        yes: 'Yes'
      },
      projectsPage: {
        title: 'Agricultural projects',
        total: '{{count}} projects',
        loading: 'Loading projects...',
        error: 'Failed to load projects.',
        unknownError: 'Unknown error',
        budget: 'Budget: {{amount}} DOLLAR',
        return: 'Return: {{percent}}% annual',
        duration: 'Duration: {{days}} days',
        details: 'Details',
        investModal: {
          title: 'Invest in {{title}}',
          budgetRequired: 'Required budget',
          alreadyFunded: 'Already funded',
          estimatedReturn: 'Estimated return',
          amountLabel: 'Amount to invest (DOLLAR)',
          placeholder: 'e.g. 100',
          minimum: 'Minimum amount: 10 DOLLAR',
          yourInvestment: 'Your investment',
          estimatedReturnCalc: 'Estimated return ({{percent}}%)'
        }
      },
      farmer: {
        submitProject: {
          title: 'Submit a Project',
          titleLabel: 'Title',
          description: 'Description',
          budget: 'Budget (USD)',
          duration: 'Duration (days)',
          returnRate: 'Return Rate (%)',
          location: 'Location',
          latitude: 'Latitude',
          longitude: 'Longitude',
          images: 'Images (URL)'
        },
        projectUpdates: {
          title: 'Add an Update',
          back: 'Back',
          loading: 'Loading…',
          titleLabel: 'Title',
          content: 'Content',
          public: 'Public',
          images: 'Images'
        },
        projectManagement: {
          loading: 'Loading...',
          notFound: 'Project not found',
          noPermission: 'This project does not exist or you do not have permissions.',
          budget: 'Budget',
          funded: 'Funded',
          investors: 'Investors',
          estimatedReturn: 'Estimated return',
          status: 'Status',
          updatesTitle: 'Project Updates',
          noUpdates: 'No updates',
          keepInvestorsInformed: 'Keep your investors informed of project progress',
          withdrawal: 'Withdrawal of Funds',
          projectDetails: 'Project Details',
          duration: 'Duration',
          category: 'Category',
          fundingStatus: 'Funding Status',
          fundingProgress: 'Funding progress',
          availableAmount: 'Available amount',
          requestHistory: 'Request History',
          adminNotes: 'Administrator Notes'
        },
        myProjects: {
          loading: 'Loading your projects...',
          loadError: 'Loading error',
          unableToLoad: 'Unable to load your projects',
          title: 'My Projects',
          subtitle: 'Manage all your agricultural projects',
          totalProjects: 'Total Projects',
          activeProjects: 'Active Projects',
          totalBudget: 'Total Budget',
          noProjects: 'No projects yet',
          createFirst: 'Create your first agricultural project to get started',
          funding: 'Funding',
          collected: 'Collected'
        },
        myProducts: {
          loading: 'Loading...',
          noProducts: 'No products',
          edit: 'Edit'
        }
      },
      dashboardComponents: {
        projects: {
          budget: 'Budget',
          funded: 'Funded',
          investors: 'Investors',
          estimatedReturn: 'Estimated return'
        },
        marketplace: {
          active: 'Active',
          inactive: 'Inactive',
          totalStock: 'Total Stock',
          stock: 'Stock',
          category: 'Category',
          noProducts: 'No products yet',
          addFirst: 'Add your first product',
          paid: 'Paid',
          shipped: 'Shipped',
          delivered: 'Delivered',
          customer: 'Customer',
          items: 'Items',
          total: 'Total'
        },
        investmentReturns: {
          loading: 'Loading...',
          totalInvested: 'Total Invested',
          returnsReceived: 'Returns Received',
          distributed: 'Distributed',
          amountInvested: 'Amount Invested',
          estimatedReturn: 'Estimated Return'
        },
        notifications: {
          noNotifications: 'No notifications yet'
        },
        common: {
          loading: 'Loading...'
        }
      },
      projectDetail: {
        loading: 'Loading project...',
        loadError: 'Failed to load project.',
        back: '← Back',
        cards: {
          budget: 'Budget',
          return: 'Return',
          returnYearly: '{{percent}}% annual',
          duration: 'Duration',
          durationDays: '{{days}} days',
          progress: 'Progress'
        },
        updates: 'Project updates',
        noUpdates: 'No updates yet.',
        amountLabel: 'Amount (DOLLAR)',
        investBtn: 'Invest with DOLLAR Wallet',
        processing: 'Processing...',
        minInfo: 'Minimum 10 DOLLAR. You can also deposit DOLLAR via Payments.',
        goDashboard: 'Go to dashboard',
        minError: 'Minimum amount is 10 DOLLAR',
        investOk: 'Investment successful',
        investFail: 'Investment failed'
      },
      checkoutPage: {
        title: 'Checkout',
        empty: 'Your cart is empty.',
        totalsUSD: 'Total (USD)',
        totalsGYT: 'Total (DOLLAR)',
        yourBalance: 'Your DOLLAR balance',
        insufficient: 'Insufficient balance. Please deposit DOLLAR before proceeding.',
        payButton: 'Pay with DOLLAR Wallet',
        processing: 'Processing…',
        tip: 'Tip: Deposit DOLLAR on your Dashboard.',
        success: 'Order placed successfully',
        createFailed: 'Order creation failed',
        failed: 'Payment failed'
      },
      walletPage: {
        title: 'DOLLAR Wallet',
        topup: 'Top up',
        balanceAvailable: 'Available balance',
        approx: '≈ {{usd}} USD @ {{rate}} USD/$',
        topupCardTitle: 'Top up in DOLLAR',
        topupCardDesc: 'Stripe or PayPal (demo)',
        openForm: 'Open form',
        infoTitle: 'Information',
        infoDesc: 'Indicative rate • No real fees • Test transactions',
        historyTitle: 'History',
        historySubtitle: 'Recent operations',
        noTransactions: 'No transactions.',
        prev: 'Previous',
        next: 'Next',
        pageXofY: 'Page {{page}} / {{pages}}',
        modalTitle: 'Top up wallet',
        amountLabel: 'Amount (DOLLAR)',
        amountPh: 'e.g. 50',
        providerLabel: 'Payment provider',
        stripe: 'Stripe',
        paypal: 'PayPal',
        cancel: 'Cancel',
        continue: 'Continue',
        demoNote: 'Demo: no real fees, simulated transactions.',
        summaryAmount: 'Amount',
        summaryFees: 'Fees (simulated)',
        summaryTotal: 'Total charged',
        summaryApprox: '≈ {{usd}} USD • Provider: {{provider}}',
        edit: 'Edit',
        confirm: 'Confirm',
        confirming: 'Processing…',
        toastInvalid: 'Invalid amount',
        toastTopupOk: 'Top-up completed',
        toastTopupFail: 'Top-up failed'
      },
      farmerOrders: {
        title: 'My Orders',
        loading: 'Loading…',
        empty: 'No orders',
        client: 'Client',
        items: 'Items',
        itemsCount: '{{count}} product(s)',
        total: 'Total',
        date: 'Date'
      },
      addProduct: {
        title: 'Add a product',
        nameLabel: 'Product name',
        namePh: 'e.g. Organic tomatoes, Artisan honey...',
        descLabel: 'Description',
        descPh: 'Describe your product, its features, production method...',
        priceLabel: 'Price (DOLLAR)',
        pricePh: '0.00',
        stockLabel: 'Stock',
        stockPh: 'Available quantity',
        unitLabel: 'Unit',
        unit: {
          kg: 'Kilograms (kg)',
          g: 'Grams (g)',
          l: 'Liters (l)',
          ml: 'Milliliters (ml)',
          piece: 'Piece(s)',
          box: 'Box(es)',
          bottle: 'Bottle(s)'
        },
        categoryLabel: 'Category',
        category: {
          crops: 'Crops',
          livestock: 'Livestock',
          dairy: 'Dairy products',
          honey: 'Honey',
          fruits: 'Fruits',
          vegetables: 'Vegetables',
          grains: 'Grains',
          other: 'Other'
        },
        locationLabel: 'Location',
        locationPh: 'e.g. Port-au-Prince, Cap-Haïtien...',
        imagesLabel: 'Product images',
        imagesPh: 'https://... or image URL',
        addImage: 'Add',
        removeImage: 'Remove',
        submit: 'Add product',
        submitting: 'Adding...',
        toastName: 'Product name is required (minimum 3 characters)',
        toastDesc: 'Description must contain at least 10 characters',
        toastPrice: 'Price must be greater than 0',
        toastStock: 'Stock must be a positive integer or zero',
        toastLocation: 'Location must contain at least 3 characters',
        toastSuccess: 'Product added successfully',
        toastFail: 'Failed to add product'
      },
      admin: {
        dashboard: {
          title: 'Admin Dashboard',
          subtitle: 'Platform management',
          sections: {
            overview: 'Overview',
            treasury: 'Platform Treasury',
            funds: 'Funds Management',
            communication: 'Communication',
            reports: 'Reports & Exports',
            analytics: 'Analytics',
            config: 'Configuration',
            validation: 'Project Validation',
            activity: 'Recent Activity'
          },
          quickLinks: {
            users: 'Users',
            products: 'Products',
            projects: 'Projects'
          },
          projectUpdated: 'Project updated successfully',
          actionFailed: 'Action failed',
          privateMessagesSent: 'Private messages sent successfully',
          sendPrivateMessagesFailed: 'Failed to send private messages',
          announcementSent: 'Announcement sent successfully',
          sendAnnouncementFailed: 'Failed to send announcement',
          contentRequired: 'Content is required',
          messageRequired: 'Message is required',
          announcement: 'Announcement',
          exportSuccess: 'Export successful',
          exportFailed: 'Export failed'
        }
      },
      about: {
        videoTitle: 'Explanatory video',
        whyInvest: {
          title: 'Why invest with AgriKonbit?',
          subtitle: 'Impact, transparency and traceability',
          description: 'We connect investors to farmers to fund sustainable projects, generate returns and develop local supply chains.',
          impact: {
            title: 'Social and local impact',
            desc: 'Your investments support farmers, create jobs and strengthen food security.'
          },
          transparency: {
            title: 'Transparency',
            desc: 'Project and product tracking via verified data and batch NFTs.'
          },
          collaborative: {
            title: 'Collaborative funding',
            desc: 'Co-funded projects with clear governance and regular updates.'
          },
          sustainable: {
            title: 'Sustainability',
            desc: 'Responsible farming practices and long-term yield.'
          },
          markets: {
            title: 'Market access',
            desc: 'Marketing support and purchase contracts to secure income.'
          },
          support: {
            title: 'Support',
            desc: 'Team and partners for technical and financial monitoring.'
          }
        },
        projects: {
          title: 'Our projects',
          subtitle: 'Agriculture, processing and logistics',
          description: 'Discover rigorously selected projects, with budget, estimated returns and delivery traceability.'
        },
        vision: {
          title: 'Our vision',
          subtitle: 'Building resilient agricultural supply chains',
          description: 'We believe in inclusive, sustainable and profitable agriculture, driven by technology and communities.',
          empowerment: {
            title: 'Empowerment',
            desc: 'Give farmers the means to invest, produce and earn.'
          },
          sustainability: {
            title: 'Sustainability',
            desc: 'Reduce footprint, protect soil and optimize water.'
          },
          inclusion: {
            title: 'Financial inclusion',
            desc: 'Access to finance and equitable value sharing.'
          },
          prosperity: {
            title: 'Shared prosperity',
            desc: 'Align interests between producers, investors and consumers.'
          }
        },
        howToInvest: {
          title: 'How to invest?',
          subtitle: 'A simple and secure process',
          description: 'Create your account, verify your identity, deposit funds and finance the projects of your choice.',
          step1: 'Create an account and complete your profile',
          step2: 'Verify your identity (KYC)',
          step3: 'Deposit funds in DOLLAR',
          step4: 'Select a project and invest'
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
      cart: {
        title: 'Su carrito',
        empty: 'Su carrito está vacío',
        continueShopping: 'Continuar comprando',
        subtotal: 'Subtotal',
        checkout: 'Proceder al pago',
        remove: 'Eliminar'
      },
      notFound: {
        title: '404 - No Encontrado',
        message: 'La página que busca no existe.',
        goHome: 'Ir al Inicio'
      },
      orderTracking: {
        title: 'Seguimiento de Pedido',
        tracking: 'Seguimiento',
        nft: 'NFT',
        verify: 'Verificar Autenticidad',
        verifying: 'Verificando...',
        authenticity: 'Autenticidad: OK',
        product: 'Producto',
        origin: 'Origen',
        harvest: 'Cosecha',
        noData: 'Sin datos NFT.',
        failed: 'Verificación fallida'
      },
      traceability: {
        title: 'Trazabilidad del Producto',
        loading: 'Cargando trazabilidad...',
        notFound: 'No encontrado.',
        nftId: 'ID NFT',
        name: 'Nombre',
        description: 'Descripción'
      },
      projectsMap: {
        title: 'Mapa de Proyectos',
        viewList: 'Ver lista',
        loadError: 'No se pueden cargar los proyectos'
      },
      dashboard: {
        loading: 'Cargando...',
        pleaseLogin: 'Por favor inicie sesión'
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
      },
      home: {
        heroTitle: 'Invierte en Haití. Apoya a los agricultores haitianos. Cosechemos juntos los frutos del desarrollo sostenible.',
        heroSubtitle: 'AgriKonbit conecta inversores y agricultores con transparencia y trazabilidad mediante blockchain.',
        exploreProjects: 'Explorar proyectos',
        shopMarketplace: 'Visitar el mercado',
        featuredProjects: 'Proyectos destacados',
        featuredProducts: 'Productos destacados',
        ctas: {
          invest: 'Invertir',
          buy: 'Comprar',
          submit: 'Enviar un proyecto'
        },
        testimonials: 'Testimonios',
        viewAll: 'Ver todo',
        loadingProjects: 'Cargando proyectos...',
        errorProjects: 'No se pueden cargar los proyectos.',
        loadingProducts: 'Cargando productos...',
        errorProducts: 'No se pueden cargar los productos.',
        cards: {
          investDesc: 'Encuentre y financie proyectos agrícolas.',
          buyDesc: 'Compre productos trazables y certificados.',
          submitDesc: 'Publique su proyecto y obtenga fondos.'
        },
        watchOurStory: 'Ver nuestra historia',
        blockchainVerified: 'Verificado por blockchain',
        securePayments: 'Pagos seguros',
        stats: {
          investors: 'Inversores',
          funded: 'Financiado',
          farmers: 'Agricultores'
        },
        features: {
          token: 'DOLLAR',
          tokenDesc: 'Rendimiento 5-10%/año o productos físicos.',
          verified: 'Proyectos verificados',
          verifiedDesc: 'Revisados por expertos con actualizaciones regulares.',
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
      marketplace: {
        title: 'Mercado',
        loadingProducts: 'Cargando productos...',
        loadError: 'Error al cargar productos.',
        unknownError: 'Error desconocido',
        filters: {
          title: 'Filtros',
          search: 'Buscar',
          searchPlaceholder: 'Mango, miel...',
          category: 'Categoría',
          all: 'Todos',
          originCountry: 'País de origen',
          originPlaceholder: 'Burkina Faso, ...',
          organicOnly: 'Solo orgánico'
        },
        categories: {
          cereals: 'Cereales',
          fruits: 'Frutas',
          vegetables: 'Verduras',
          honey: 'Miel',
          dairy: 'Productos lácteos',
          meat: 'Carne'
        },
        product: {
          by: 'Por',
          inStock: 'en stock',
          details: 'Detalles',
          addToCart: 'Añadir al carrito'
        }
      },
      productDetail: {
        loading: 'Cargando producto...',
        loadError: 'Error al cargar producto.',
        inStock: 'en stock',
        addToCart: 'Añadir al carrito',
        viewTraceability: 'Ver trazabilidad',
        origin: 'Origen',
        harvestDate: 'Fecha de cosecha',
        certifiedOrganic: 'Orgánico certificado',
        yes: 'Sí'
      },
      projectsPage: {
        title: 'Proyectos agrícolas',
        total: '{{count}} proyectos',
        loading: 'Cargando proyectos...',
        error: 'Error al cargar proyectos.',
        unknownError: 'Error desconocido',
        budget: 'Presupuesto: {{amount}} DOLLAR',
        return: 'Rendimiento: {{percent}}% anual',
        duration: 'Duración: {{days}} días',
        details: 'Detalles',
        investModal: {
          title: 'Invertir en {{title}}',
          budgetRequired: 'Presupuesto requerido',
          alreadyFunded: 'Ya financiado',
          estimatedReturn: 'Rendimiento estimado',
          amountLabel: 'Monto a invertir (DOLLAR)',
          placeholder: 'Ej: 100',
          minimum: 'Monto mínimo: 10 DOLLAR',
          yourInvestment: 'Su inversión',
          estimatedReturnCalc: 'Rendimiento estimado ({{percent}}%)'
        }
      },
      farmer: {
        submitProject: {
          title: 'Enviar un Proyecto',
          titleLabel: 'Título',
          description: 'Descripción',
          budget: 'Presupuesto (USD)',
          duration: 'Duración (días)',
          returnRate: 'Tasa de Retorno (%)',
          location: 'Ubicación',
          latitude: 'Latitud',
          longitude: 'Longitud',
          images: 'Imágenes (URL)',
          category: 'Categoría'
        },
        projectUpdates: {
          title: 'Añadir una Actualización',
          back: 'Atrás',
          loading: 'Cargando…',
          titleLabel: 'Título',
          content: 'Contenido',
          public: 'Público',
          images: 'Imágenes'
        },
        projectManagement: {
          loading: 'Cargando...',
          notFound: 'Proyecto no encontrado',
          noPermission: 'Este proyecto no existe o no tiene permisos.',
          budget: 'Presupuesto',
          funded: 'Financiado',
          investors: 'Inversores',
          estimatedReturn: 'Rendimiento estimado',
          status: 'Estado',
          updatesTitle: 'Actualizaciones del Proyecto',
          noUpdates: 'Sin actualizaciones',
          keepInvestorsInformed: 'Mantenga informados a sus inversores sobre el progreso del proyecto',
          withdrawal: 'Retiro de Fondos',
          projectDetails: 'Detalles del Proyecto',
          duration: 'Duración',
          category: 'Categoría',
          fundingStatus: 'Estado del Financiamiento',
          fundingProgress: 'Progreso del financiamiento',
          availableAmount: 'Monto disponible',
          requestHistory: 'Historial de Solicitudes',
          adminNotes: 'Notas del Administrador'
        },
        myProjects: {
          loading: 'Cargando sus proyectos...',
          loadError: 'Error de carga',
          unableToLoad: 'No se pueden cargar sus proyectos',
          title: 'Mis Proyectos',
          subtitle: 'Gestione todos sus proyectos agrícolas',
          totalProjects: 'Total Proyectos',
          activeProjects: 'Proyectos Activos',
          totalBudget: 'Presupuesto Total',
          noProjects: 'Aún no hay proyectos',
          createFirst: 'Cree su primer proyecto agrícola para comenzar',
          funding: 'Financiamiento',
          collected: 'Recaudado'
        },
        myProducts: {
          loading: 'Cargando...',
          noProducts: 'Sin productos',
          edit: 'Editar'
        }
      },
      dashboardComponents: {
        projects: {
          budget: 'Presupuesto',
          funded: 'Financiado',
          investors: 'Inversores',
          estimatedReturn: 'Rendimiento estimado'
        },
        marketplace: {
          active: 'Activos',
          inactive: 'Inactivos',
          totalStock: 'Stock Total',
          stock: 'Stock',
          category: 'Categoría',
          noProducts: 'Aún no hay productos',
          addFirst: 'Añada su primer producto',
          paid: 'Pagadas',
          shipped: 'Enviadas',
          delivered: 'Entregadas',
          customer: 'Cliente',
          items: 'Artículos',
          total: 'Total'
        },
        investmentReturns: {
          loading: 'Cargando...',
          totalInvested: 'Total Invertido',
          returnsReceived: 'Retornos Recibidos',
          distributed: 'Distribuidos',
          amountInvested: 'Monto Invertido',
          estimatedReturn: 'Rendimiento Estimado'
        },
        notifications: {
          noNotifications: 'Aún no hay notificaciones'
        },
        common: {
          loading: 'Cargando...'
        }
      },
      projectDetail: {
        loading: 'Cargando proyecto...',
        loadError: 'Error al cargar proyecto.',
        back: '← Atrás',
        cards: {
          budget: 'Presupuesto',
          return: 'Rendimiento',
          returnYearly: '{{percent}}% anual',
          duration: 'Duración',
          durationDays: '{{days}} días',
          progress: 'Progreso'
        },
        updates: 'Actualizaciones del proyecto',
        noUpdates: 'Sin actualizaciones todavía.',
        amountLabel: 'Monto (DOLLAR)',
        investBtn: 'Invertir con Billetera DOLLAR',
        processing: 'Procesando...',
        minInfo: 'Mínimo 10 DOLLAR. También puede depositar DOLLAR a través de Pagos.',
        goDashboard: 'Ir al panel',
        minError: 'El monto mínimo es 10 DOLLAR',
        investOk: 'Inversión exitosa',
        investFail: 'Inversión fallida'
      },
      checkoutPage: {
        title: 'Pago',
        empty: 'Su carrito está vacío.',
        totalsUSD: 'Total (USD)',
        totalsGYT: 'Total (DOLLAR)',
        yourBalance: 'Su saldo DOLLAR',
        insufficient: 'Saldo insuficiente. Por favor deposite DOLLAR antes de continuar.',
        payButton: 'Pagar con Billetera DOLLAR',
        processing: 'Procesando…',
        tip: 'Consejo: Deposite DOLLAR en su Panel.',
        success: 'Pedido realizado con éxito',
        createFailed: 'Falló la creación del pedido',
        failed: 'Pago fallido'
      },
      walletPage: {
        title: 'Billetera DOLLAR',
        topup: 'Recargar',
        balanceAvailable: 'Saldo disponible',
        approx: '≈ {{usd}} USD @ {{rate}} USD/$',
        topupCardTitle: 'Recargar en DOLLAR',
        topupCardDesc: 'Stripe o PayPal (demo)',
        openForm: 'Abrir formulario',
        infoTitle: 'Información',
        infoDesc: 'Tasa indicativa • Sin tarifas reales • Transacciones de prueba',
        historyTitle: 'Historial',
        historySubtitle: 'Operaciones recientes',
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
        summaryApprox: '≈ {{usd}} USD • Proveedor: {{provider}}',
        edit: 'Editar',
        confirm: 'Confirmar',
        confirming: 'Procesando…',
        toastInvalid: 'Monto no válido',
        toastTopupOk: 'Recarga completada',
        toastTopupFail: 'Recarga fallida'
      },
      farmerOrders: {
        title: 'Mis Pedidos',
        loading: 'Cargando…',
        empty: 'Sin pedidos',
        client: 'Cliente',
        items: 'Artículos',
        itemsCount: '{{count}} producto(s)',
        total: 'Total',
        date: 'Fecha'
      },
      addProduct: {
        title: 'Añadir un producto',
        nameLabel: 'Nombre del producto',
        namePh: 'Ej: Tomates orgánicos, Miel artesanal...',
        descLabel: 'Descripción',
        descPh: 'Describa su producto, sus características, método de producción...',
        priceLabel: 'Precio (DOLLAR)',
        pricePh: '0.00',
        stockLabel: 'Stock',
        stockPh: 'Cantidad disponible',
        unitLabel: 'Unidad',
        unit: {
          kg: 'Kilogramos (kg)',
          g: 'Gramos (g)',
          l: 'Litros (l)',
          ml: 'Mililitros (ml)',
          piece: 'Pieza(s)',
          box: 'Caja(s)',
          bottle: 'Botella(s)'
        },
        categoryLabel: 'Categoría',
        category: {
          crops: 'Cultivos',
          livestock: 'Ganadería',
          dairy: 'Productos lácteos',
          honey: 'Miel',
          fruits: 'Frutas',
          vegetables: 'Verduras',
          grains: 'Cereales',
          other: 'Otro'
        },
        locationLabel: 'Ubicación',
        locationPh: 'Ej: Puerto Príncipe, Cap-Haitien...',
        imagesLabel: 'Imágenes del producto',
        imagesPh: 'https://... o URL de imagen',
        addImage: 'Añadir',
        removeImage: 'Eliminar',
        submit: 'Añadir producto',
        submitting: 'Añadiendo...',
        toastName: 'El nombre del producto es obligatorio (mínimo 3 caracteres)',
        toastDesc: 'La descripción debe contener al menos 10 caracteres',
        toastPrice: 'El precio debe ser mayor que 0',
        toastStock: 'El stock debe ser un número entero positivo o cero',
        toastLocation: 'La ubicación debe contener al menos 3 caracteres',
        toastSuccess: 'Producto añadido con éxito',
        toastFail: 'Error al añadir producto'
      },
      about: {
        videoTitle: 'Video explicativo',
        whyInvest: {
          title: '¿Por qué invertir con AgriKonbit?',
          subtitle: 'Impacto, transparencia y trazabilidad',
          description: 'Conectamos inversores con agricultores para financiar proyectos sostenibles, generar rendimientos y desarrollar cadenas de suministro locales.',
          impact: {
            title: 'Impacto social y local',
            desc: 'Sus inversiones apoyan a los agricultores, crean empleos y fortalecen la seguridad alimentaria.'
          },
          transparency: {
            title: 'Transparencia',
            desc: 'Seguimiento de proyectos y productos mediante datos verificados y NFT de lote.'
          },
          collaborative: {
            title: 'Financiación colaborativa',
            desc: 'Proyectos cofinanciados con gobernanza clara y actualizaciones regulares.'
          },
          sustainable: {
            title: 'Sostenibilidad',
            desc: 'Prácticas agrícolas responsables y rendimiento a largo plazo.'
          },
          markets: {
            title: 'Acceso a mercados',
            desc: 'Apoyo en marketing y contratos de compra para asegurar ingresos.'
          },
          support: {
            title: 'Acompañamiento',
            desc: 'Equipo y socios para seguimiento técnico y financiero.'
          }
        },
        projects: {
          title: 'Nuestros proyectos',
          subtitle: 'Agricultura, transformación y logística',
          description: 'Descubra proyectos rigurosamente seleccionados, con presupuesto, rendimientos estimados y trazabilidad de entregas.'
        },
        vision: {
          title: 'Nuestra visión',
          subtitle: 'Construir cadenas agrícolas resilientes',
          description: 'Creemos en una agricultura inclusiva, sostenible y rentable, impulsada por la tecnología y las comunidades.',
          empowerment: {
            title: 'Empoderamiento',
            desc: 'Dar a los agricultores los medios para invertir, producir y ganar.'
          },
          sustainability: {
            title: 'Sostenibilidad',
            desc: 'Reducir la huella, proteger los suelos y optimizar el agua.'
          },
          inclusion: {
            title: 'Inclusión financiera',
            desc: 'Acceso al financiamiento y distribución equitativa del valor.'
          },
          prosperity: {
            title: 'Prosperidad compartida',
            desc: 'Alinear los intereses entre productores, inversores y consumidores.'
          }
        },
        howToInvest: {
          title: '¿Cómo invertir?',
          subtitle: 'Un proceso simple y seguro',
          description: 'Cree su cuenta, verifique su identidad, deposite fondos y financie los proyectos de su elección.',
          step1: 'Crear una cuenta y completar su perfil',
          step2: 'Verificar su identidad (KYC)',
          step3: 'Depositar fondos en DOLLAR',
          step4: 'Seleccionar un proyecto e invertir'
        }
      },
      dashboard: {
        admin: {
          title: 'Panel de Administración',
          subtitle: 'Gestión de la plataforma',
          sections: {
            overview: 'Vista general',
            treasury: 'Tesorería de la Plataforma',
            funds: 'Gestión de Fondos',
            communication: 'Comunicación',
            reports: 'Informes y Exportaciones',
            analytics: 'Analíticas',
            config: 'Configuración',
            validation: 'Validación de Proyectos',
            activity: 'Actividad Reciente'
          },
          quickLinks: {
            users: 'Usuarios',
            products: 'Productos',
            projects: 'Proyectos'
          },
          projectUpdated: 'Proyecto actualizado',
          actionFailed: 'Acción fallida',
          privateMessagesSent: 'Mensajes privados enviados',
          sendPrivateMessagesFailed: 'Error al enviar mensajes',
          announcementSent: 'Anuncio enviado',
          sendAnnouncementFailed: 'Error al enviar anuncio',
          contentRequired: 'Contenido requerido',
          messageRequired: 'Mensaje requerido',
          announcement: 'Anuncio',
          exportSuccess: 'Exportación exitosa',
          exportFailed: 'Exportación fallida'
        },
        consumer: {
          title: '🛍️ Panel del Consumidor',
          subtitle: 'Compras, trazabilidad y entregas',
          notifications: 'Notificaciones',
          markAll: 'Marcar todo como leído',
          viewAll: 'Ver todo',
          none: 'Sin notificaciones',
          tabs: {
            overview: '📊 Vista general',
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
            totalOrders: 'Total Pedidos',
            inProgress: 'En curso',
            delivered: 'Entregado'
          },
          recentOrders: 'Mis Pedidos Recientes',
          noOrders: 'Sin pedidos todavía',
          marketplaceCard: {
            title: 'Mercado',
            desc: 'Comprar productos'
          },
          deliveriesCard: {
            title: 'Seguimiento de entregas',
            desc: 'Rastrear sus paquetes'
          },
          open: 'Abrir'
        },
        overview: {
          stats: {
            projectsActive: 'Proyectos Activos',
            projectsTotal: 'Total',
            productsOnSale: 'Productos en Venta',
            stock: 'Stock',
            units: 'unidades',
            ordersPending: 'Pedidos Pendientes',
            ordersTotal: 'Total',
            walletBalance: 'Saldo DOLLAR',
            earned: 'Ganado'
          }
        }
      },
      cart: {
        title: 'Su carrito',
        empty: 'Su carrito está vacío',
        subtotal: 'Subtotal',
        checkout: 'Proceder al pago'
      }
    }
  },
  fr: {
    translation: {
      app: {
        name: 'AgriKonbit'
      },
      cart: {
        title: 'Votre panier',
        empty: 'Votre panier est vide',
        continueShopping: 'Continuer les achats',
        subtotal: 'Sous-total',
        checkout: 'Procéder au paiement',
        remove: 'Retirer'
      },
      notFound: {
        title: '404 - Page Non Trouvée',
        message: 'La page que vous recherchez n\'existe pas.',
        goHome: 'Retour à l\'Accueil'
      },
      orderTracking: {
        title: 'Suivi de Commande',
        tracking: 'Suivi',
        nft: 'NFT',
        verify: 'Vérifier l\'Authenticité',
        verifying: 'Vérification...',
        authenticity: 'Authenticité: OK',
        product: 'Produit',
        origin: 'Origine',
        harvest: 'Récolte',
        noData: 'Aucune donnée NFT.',
        failed: 'Vérification échouée'
      },
      traceability: {
        title: 'Traçabilité du Produit',
        loading: 'Chargement de la traçabilité...',
        notFound: 'Non trouvé.',
        nftId: 'ID NFT',
        name: 'Nom',
        description: 'Description'
      },
      projectsMap: {
        title: 'Carte des Projets',
        viewList: 'Voir la liste',
        loadError: 'Impossible de charger les projets'
      },
      dashboard: {
        loading: 'Chargement...',
        pleaseLogin: 'Veuillez vous connecter'
      },
      marketplace: {
        title: 'Marketplace',
        loadingProducts: 'Chargement des produits...',
        loadError: 'Échec du chargement des produits.',
        unknownError: 'Erreur inconnue',
        filters: {
          title: 'Filtres',
          search: 'Rechercher',
          searchPlaceholder: 'Mangue, miel...',
          category: 'Catégorie',
          all: 'Tous',
          originCountry: 'Pays d\'origine',
          originPlaceholder: 'Burkina Faso, ...',
          organicOnly: 'Bio uniquement'
        },
        categories: {
          cereals: 'Céréales',
          fruits: 'Fruits',
          vegetables: 'Légumes',
          honey: 'Miel',
          dairy: 'Produits laitiers',
          meat: 'Viande'
        },
        product: {
          by: 'Par',
          inStock: 'en stock',
          details: 'Détails',
          addToCart: 'Ajouter au panier'
        }
      },
      productDetail: {
        loading: 'Chargement du produit...',
        loadError: 'Échec du chargement du produit.',
        inStock: 'en stock',
        addToCart: 'Ajouter au panier',
        viewTraceability: 'Voir la traçabilité',
        origin: 'Origine',
        harvestDate: 'Date de récolte',
        certifiedOrganic: 'Bio certifié',
        yes: 'Oui'
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
      about: {
        videoTitle: 'Vidéo explicative',
        whyInvest: {
          title: 'Pourquoi investir avec AgriKonbit ?',
          subtitle: 'Impact, transparence et traçabilité',
          description: 'Nous connectons les investisseurs aux agriculteurs pour financer des projets durables, générer des rendements et développer des filières locales.',
          impact: {
            title: 'Impact social et local',
            desc: 'Vos investissements soutiennent les agriculteurs, créent des emplois et renforcent la sécurité alimentaire.'
          },
          transparency: {
            title: 'Transparence',
            desc: 'Suivi des projets et des produits via des données vérifiées et NFT de lot.'
          },
          collaborative: {
            title: 'Financement collaboratif',
            desc: 'Des projets co-financés avec une gouvernance claire et des mises à jour régulières.'
          },
          sustainable: {
            title: 'Durabilité',
            desc: 'Pratiques agricoles responsables et rendement à long terme.'
          },
          markets: {
            title: 'Accès aux marchés',
            desc: 'Aide à la commercialisation et contrats d’achat pour sécuriser les revenus.'
          },
          support: {
            title: 'Accompagnement',
            desc: 'Équipe et partenaires pour le suivi technique et financier.'
          }
        },
        projects: {
          title: 'Nos projets',
          subtitle: 'Agriculture, transformation et logistique',
          description: 'Découvrez des projets rigoureusement sélectionnés, avec budget, rendements estimés et traçabilité des livraisons.'
        },
        vision: {
          title: 'Notre vision',
          subtitle: 'Construire des filières agricoles résilientes',
          description: 'Nous croyons à une agriculture inclusive, durable et rentable, portée par la technologie et les communautés.',
          empowerment: {
            title: 'Autonomisation',
            desc: 'Donner aux agriculteurs les moyens d’investir, produire et gagner.'
          },
          sustainability: {
            title: 'Soutenabilité',
            desc: 'Réduire l’empreinte, protéger les sols et optimiser l’eau.'
          },
          inclusion: {
            title: 'Inclusion financière',
            desc: 'Accès au financement et partage équitable de la valeur.'
          },
          prosperity: {
            title: 'Prospérité partagée',
            desc: 'Aligner les intérêts entre producteurs, investisseurs et consommateurs.'
          }
        },
        howToInvest: {
          title: 'Comment investir ?',
          subtitle: 'Un parcours simple et sécurisé',
          description: 'Créez votre compte, vérifiez votre identité, déposez des fonds et financez les projets de votre choix.',
          step1: 'Créer un compte et compléter votre profil',
          step2: 'Vérifier votre identité (KYC)',
          step3: 'Déposer des fonds en DOLLAR',
          step4: 'Sélectionner un projet et investir'
        }
      },
      dashboard: {
        admin: {
          title: 'Tableau de bord Admin',
          subtitle: 'Gestion de la plateforme',
          sections: {
            overview: 'Vue d\'ensemble',
            treasury: 'Trésorerie Plateforme',
            funds: 'Gestion des Fonds',
            communication: 'Communication',
            reports: 'Rapports & Exports',
            analytics: 'Analytiques',
            config: 'Configuration',
            validation: 'Validation de Projets',
            activity: 'Activité Récente'
          },
          quickLinks: {
            users: 'Utilisateurs',
            products: 'Produits',
            projects: 'Projets'
          },
          projectUpdated: 'Projet mis à jour',
          actionFailed: 'Action échouée',
          privateMessagesSent: 'Messages privés envoyés',
          sendPrivateMessagesFailed: 'Échec envoi messages',
          announcementSent: 'Annonce envoyée',
          sendAnnouncementFailed: 'Échec envoi annonce',
          contentRequired: 'Contenu requis',
          messageRequired: 'Message requis',
          announcement: 'Annonce',
          exportSuccess: 'Export réussi',
          exportFailed: 'Export échoué'
        },
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
            purchases: 'Mes Achats',
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
        details: 'Détails',
        investModal: {
          title: 'Investir dans {{title}}',
          budgetRequired: 'Budget requis',
          alreadyFunded: 'Déjà financé',
          estimatedReturn: 'Retour estimé',
          amountLabel: 'Montant à investir (DOLLAR)',
          placeholder: 'Ex: 100',
          minimum: 'Montant minimum: 10 DOLLAR',
          yourInvestment: 'Votre investissement',
          estimatedReturnCalc: 'Retour estimé ({{percent}}%)'
        }
      },
      farmer: {
        submitProject: {
          title: 'Soumettre un Projet',
          titleLabel: 'Titre',
          description: 'Description',
          budget: 'Budget (USD)',
          duration: 'Durée (jours)',
          returnRate: 'Rendement (%)',
          location: 'Localisation',
          latitude: 'Latitude',
          longitude: 'Longitude',
          images: 'Images (URL)'
        },
        projectUpdates: {
          title: 'Ajouter une Mise à Jour',
          back: 'Retour',
          loading: 'Chargement…',
          titleLabel: 'Titre',
          content: 'Contenu',
          public: 'Public',
          images: 'Images'
        },
        projectManagement: {
          loading: 'Chargement...',
          notFound: 'Projet non trouvé',
          noPermission: 'Ce projet n\'existe pas ou vous n\'avez pas les permissions.',
          budget: 'Budget',
          funded: 'Financé',
          investors: 'Investisseurs',
          estimatedReturn: 'Rendement estimé',
          status: 'Statut',
          updatesTitle: 'Mises à jour du projet',
          noUpdates: 'Aucune mise à jour',
          keepInvestorsInformed: 'Tenez vos investisseurs informés de l\'avancement du projet',
          withdrawal: 'Retrait de fonds',
          projectDetails: 'Détails du projet',
          duration: 'Durée',
          category: 'Catégorie',
          fundingStatus: 'Statut du financement',
          fundingProgress: 'Progression du financement',
          availableAmount: 'Montant disponible',
          requestHistory: 'Historique des demandes',
          adminNotes: 'Notes de l\'administrateur'
        },
        myProjects: {
          loading: 'Chargement de vos projets...',
          loadError: 'Erreur de chargement',
          unableToLoad: 'Impossible de charger vos projets',
          title: 'Mes Projets',
          subtitle: 'Gérez tous vos projets agricoles',
          totalProjects: 'Total Projets',
          activeProjects: 'Projets Actifs',
          totalBudget: 'Budget Total',
          noProjects: 'Aucun projet pour le moment',
          createFirst: 'Créez votre premier projet agricole pour commencer',
          funding: 'Financement',
          collected: 'Collecté'
        },
        myProducts: {
          loading: 'Chargement...',
          noProducts: 'Aucun produit',
          edit: 'Modifier'
        }
      },
      dashboardComponents: {
        projects: {
          budget: 'Budget',
          funded: 'Financé',
          investors: 'Investisseurs',
          estimatedReturn: 'Rendement estimé'
        },
        marketplace: {
          active: 'Actifs',
          inactive: 'Inactifs',
          totalStock: 'Stock Total',
          stock: 'Stock',
          category: 'Catégorie',
          noProducts: 'Aucun produit pour le moment',
          addFirst: 'Ajoutez votre premier produit',
          paid: 'Payées',
          shipped: 'Expédiées',
          delivered: 'Livrées',
          customer: 'Client',
          items: 'Articles',
          total: 'Total'
        },
        investmentReturns: {
          loading: 'Chargement...',
          totalInvested: 'Total Investi',
          returnsReceived: 'Retours Reçus',
          distributed: 'Distribués',
          amountInvested: 'Montant Investi',
          estimatedReturn: 'Rendement Estimé'
        },
        notifications: {
          noNotifications: 'Aucune notification pour le moment'
        },
        common: {
          loading: 'Chargement...'
        }
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
  approx: '≈ {{usd}} USD @ {{rate}} USD/$',
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
  summaryApprox: '≈ {{usd}} USD • Fournisseur: {{provider}}',
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
          submitDesc: 'Publiez votre projet et obtenez du financement.'
        },
        watchOurStory: 'Regardez notre histoire',
        blockchainVerified: 'Blockchain vérifié',
        securePayments: 'Paiements protégés',
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
