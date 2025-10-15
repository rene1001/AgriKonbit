import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiLinkedin, 
  FiMail, 
  FiPhone,
  FiMapPin
} from 'react-icons/fi';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: t('footer.howItWorks'), href: '/how-it-works' },
      { name: t('footer.forFarmers'), href: '/farmers' },
      { name: t('footer.forInvestors'), href: '/investors' },
      { name: t('footer.marketplace'), href: '/marketplace' },
    ],
    support: [
      { name: t('footer.helpCenter'), href: '/help' },
      { name: t('footer.contactUs'), href: '/contact' },
      { name: t('footer.terms'), href: '/terms' },
      { name: t('footer.privacy'), href: '/privacy' },
    ],
    company: [
      { name: t('footer.aboutUs'), href: '/about' },
      { name: t('footer.careers'), href: '/careers' },
      { name: t('footer.press'), href: '/press' },
      { name: t('footer.blog'), href: '/blog' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="ml-2 text-xl font-bold">AgriKonbit</span>
            </div>
            <p className="text-gray-400 mb-4">
              {t('footer.companyDescription')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.platform')}</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.support')}</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.company')}</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <FiMail className="h-5 w-5 text-primary-500 mr-3" />
              <span className="text-gray-400">support@agrikonbit.com</span>
            </div>
            <div className="flex items-center">
              <FiPhone className="h-5 w-5 text-primary-500 mr-3" />
              <span className="text-gray-400">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center">
              <FiMapPin className="h-5 w-5 text-primary-500 mr-3" />
              <span className="text-gray-400">San Francisco, CA</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} AgriKonbit. {t('footer.rights')}
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">{t('footer.poweredBy')}</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-primary-600 px-2 py-1 rounded">Polygon</span>
              <span className="text-xs bg-secondary-600 px-2 py-1 rounded">Stripe</span>
              <span className="text-xs bg-accent-600 px-2 py-1 rounded">React</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
