import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import './index.css';
import './i18n';
import App from './App';
import { SocketProvider } from './contexts/SocketContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SocketProvider>
          <App />
        </SocketProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

// Enregistrer le Service Worker (PWA)
serviceWorkerRegistration.register({
  onSuccess: () => {
    console.log('✅ Contenu mis en cache pour utilisation hors ligne');
  },
  onUpdate: (registration) => {
    console.log('🔄 Nouveau contenu disponible');
    // Optionnel: afficher notification de mise à jour
    if (window.confirm('Une nouvelle version est disponible. Recharger ?')) {
      window.location.reload();
    }
  }
});

// Afficher le prompt d'installation PWA
serviceWorkerRegistration.showInstallPrompt();
