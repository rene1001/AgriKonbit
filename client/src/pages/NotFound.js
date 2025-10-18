import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold text-gray-800">{t('notFound.title')}</h1>
        <p className="text-gray-600 mt-4 text-lg">{t('notFound.message')}</p>
        <Link to="/" className="btn btn-primary mt-6 inline-block">
          {t('notFound.goHome')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
