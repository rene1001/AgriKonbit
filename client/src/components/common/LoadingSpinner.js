import React from 'react';

/**
 * Composant de chargement utilisé pour les lazy-loaded components
 * Affiche un spinner pendant le chargement des chunks
 */
const LoadingSpinner = ({ message = 'Chargement...' }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="flex flex-col items-center space-y-6 p-8">
        {/* Spinner animé */}
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary-600"></div>
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-secondary-600 absolute top-0 left-0" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        
        {/* Message */}
        <div className="text-center">
          <p className="text-gray-700 text-lg font-medium">{message}</p>
          <p className="text-gray-500 text-sm mt-2">Veuillez patienter</p>
        </div>
        
        {/* Points animés */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
