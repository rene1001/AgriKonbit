import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Section: Pourquoi investir */}
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{t('about.whyInvest.title')}</h1>
          <p className="text-primary-700 font-semibold mb-4">{t('about.whyInvest.subtitle')}</p>
          <p className="text-gray-700 leading-relaxed">
            {t('about.whyInvest.description')}
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">{t('about.whyInvest.impact.title')}</h3>
              <p className="text-gray-700">{t('about.whyInvest.impact.desc')}</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">{t('about.whyInvest.transparency.title')}</h3>
              <p className="text-gray-700">{t('about.whyInvest.transparency.desc')}</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">{t('about.whyInvest.collaborative.title')}</h3>
              <p className="text-gray-700">{t('about.whyInvest.collaborative.desc')}</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">{t('about.whyInvest.sustainable.title')}</h3>
              <p className="text-gray-700">{t('about.whyInvest.sustainable.desc')}</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">{t('about.whyInvest.markets.title')}</h3>
              <p className="text-gray-700">{t('about.whyInvest.markets.desc')}</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">{t('about.whyInvest.support.title')}</h3>
              <p className="text-gray-700">{t('about.whyInvest.support.desc')}</p>
            </div>
          </div>
        </section>

        {/* Section: Nos projets */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t('about.projects.title')}</h2>
          <p className="text-primary-700 font-semibold mb-4">{t('about.projects.subtitle')}</p>
          <p className="text-gray-700 leading-relaxed">
            {t('about.projects.description')}
          </p>
        </section>

        {/* Section: Notre vision */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t('about.vision.title')}</h2>
          <p className="text-primary-700 font-semibold mb-4">{t('about.vision.subtitle')}</p>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t('about.vision.description')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">{t('about.vision.empowerment.title')}</h3>
              <p className="text-gray-700">{t('about.vision.empowerment.desc')}</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">{t('about.vision.sustainability.title')}</h3>
              <p className="text-gray-700">{t('about.vision.sustainability.desc')}</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">{t('about.vision.inclusion.title')}</h3>
              <p className="text-gray-700">{t('about.vision.inclusion.desc')}</p>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">{t('about.vision.prosperity.title')}</h3>
              <p className="text-gray-700">{t('about.vision.prosperity.desc')}</p>
            </div>
          </div>
        </section>

        {/* Section: Comment investir ? */}
        <section className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t('about.howToInvest.title')}</h2>
          <p className="text-primary-700 font-semibold mb-4">{t('about.howToInvest.subtitle')}</p>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t('about.howToInvest.description')}
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>{t('about.howToInvest.step1')}</li>
            <li>{t('about.howToInvest.step2')}</li>
            <li>{t('about.howToInvest.step3')}</li>
            <li>{t('about.howToInvest.step4')}</li>
          </ol>
        </section>
      </div>
    </div>
  );
};

export default About;
