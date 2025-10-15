import axios from 'axios';

// Correction de l'URL de base de l'API pour assurer la connectivité
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
console.log('API Base URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    web3Login: '/auth/web3-login',
    me: '/auth/me',
    logout: '/auth/logout'
  },
  
  // Projects
  projects: {
    list: '/projects',
    detail: (id) => `/projects/${id}`,
    create: '/projects',
    update: (id) => `/projects/${id}`,
    farmerProjects: '/projects/farmer/my-projects',
    addUpdate: (id) => `/projects/${id}/updates`
  },
  
  // Investments
  investments: {
    list: '/investments/my-investments',
    myInvestments: '/investments/my-investments',
    create: '/investments',
    detail: (id) => `/investments/${id}`,
    stats: '/investments/stats/overview',
    scheduleDelivery: '/investments/returns/schedule-delivery'
  },
  
  // Products
  products: {
    list: '/products',
    detail: (id) => `/products/${id}`,
    create: '/products',
    farmerProducts: '/products/farmer/my-products',
    updateStock: (id) => `/products/${id}/stock`,
    traceability: (id) => `/products/${id}/traceability`
  },
  
  // Orders
  orders: {
    list: '/orders/my-orders',
    create: '/orders',
    detail: (id) => `/orders/${id}`,
    updateStatus: (id) => `/orders/${id}/status`,
    invoice: (id) => `/orders/${id}/invoice`,
    invoiceEmail: (id) => `/orders/${id}/invoice/email`
  },
  
  // Users
  users: {
    profile: '/users/profile',
    updateProfile: '/users/profile',
    uploadProfileImage: '/users/profile/image',
    deleteProfileImage: '/users/profile/image',
    changePassword: '/users/change-password',
    notifications: '/users/notifications',
    markNotificationRead: (id) => `/users/notifications/${id}/read`,
    markAllNotificationsRead: '/users/notifications/read-all'
  },
  // Admin
  admin: {
    dashboard: '/admin/dashboard',
    pendingProjects: '/admin/projects/pending',
    validateProject: (id) => `/admin/projects/${id}/validate`,
    users: '/admin/users',
    updateUserStatus: (id) => `/admin/users/${id}/status`,
    updateUserRole: (id) => `/admin/users/${id}/role`,
    products: '/admin/products',
    updateProductStatus: (id) => `/admin/products/${id}/status`,
    settings: '/admin/settings'
  },

  // Reports (Admin exports)
  reports: {
    exportUsers: '/reports/users',
    exportInvestments: '/reports/investments',
    exportOrders: '/reports/orders',
    exportProjects: '/reports/projects'
  },
  // Blockchain
  blockchain: {
    info: '/blockchain/gyt/info',
    gytBalance: '/blockchain/gyt/balance',
    gytTransactions: '/blockchain/gyt/transactions',
    gytConvert: '/blockchain/gyt/convert',
    nftInfo: (nftId) => `/blockchain/nft/${nftId}`,
    productQr: (productId) => `/blockchain/product/${productId}/qr`,
    verifyTx: '/blockchain/verify-transaction'
  },
  
  // Payments
  payments: {
    methods: '/payments/methods',
    stripe: {
      createIntent: '/payments/stripe/create-payment-intent',
      confirm: '/payments/stripe/confirm-payment'
    },
    paypal: {
      createOrder: '/payments/paypal/create-order',
      capture: '/payments/paypal/capture-order'
    },
    metamask: {
      sendTransaction: '/payments/metamask/send-transaction'
    }
  },
  
  // Farmer
  farmer: {
    dashboardStats: '/farmer/stats/dashboard',
    orders: '/farmer/orders',
    orderDetail: (id) => `/farmer/orders/${id}`,
    updateOrderStatus: (id) => `/farmer/orders/${id}/status`,
    investors: '/farmer/investors',
    transactions: '/farmer/transactions',
    withdraw: '/farmer/withdraw',
    activities: '/farmer/activities'
  },

  // Messages
  messages: {
    conversations: '/messages/conversations',
    conversationMessages: (id) => `/messages/conversations/${id}/messages`,
    send: '/messages/send',
    investorsList: '/messages/farmer/investors-list',
    farmersList: '/messages/investor/farmers-list',
    admins: '/messages/admins',
    deleteMessage: (id) => `/messages/messages/${id}`,
    adminBroadcastPrivate: '/messages/admin/broadcast-private',
    adminBroadcastNotification: '/messages/admin/broadcast-notification'
  },

  // Documents
  documents: {
    myDocuments: '/documents/my-documents',
    upload: '/documents/upload',
    download: (id) => `/documents/download/${id}`,
    delete: (id) => `/documents/${id}`
  },

  // Notifications
  notifications: {
    list: '/notifications',
    markRead: (id) => `/notifications/${id}/read`,
    markAllRead: '/notifications/read-all',
    delete: (id) => `/notifications/${id}`
  },

  // Wallet
  wallet: {
    withdraw: '/wallet/withdraw'
  },

  // Returns
  returns: {
    list: '/returns',
    delete: (id) => `/returns/${id}`
  },

  // Deliveries
  deliveries: {
    my: '/deliveries/my',
    track: (trackingNumber) => `/deliveries/track/${trackingNumber}`
  },

  // Favorites
  favorites: {
    list: '/favorites',
    add: '/favorites',
    remove: (type, id) => `/favorites/${type}/${id}`
  },

  // Subscriptions
  subscriptions: {
    my: '/subscriptions/my',
    create: '/subscriptions',
    update: (id) => `/subscriptions/${id}`
  }
};

export default api;
