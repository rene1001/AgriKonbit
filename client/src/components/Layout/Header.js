import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useTranslation } from 'react-i18next';
import { 
  FiMenu, 
  FiX, 
  FiUser, 
  FiShoppingCart, 
  FiLogOut,
  FiSettings,
  FiTrendingUp,
  FiPackage,
  FiUsers,
  FiInfo
} from 'react-icons/fi';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  // Build navigation depending on role: consumers should only see Marketplace
  const navigation = React.useMemo(() => {
    const market = { name: t('nav.marketplace'), href: '/marketplace', icon: FiPackage };
    const projects = { name: t('nav.projects'), href: '/projects', icon: FiTrendingUp };
    const about = { name: t('nav.about'), href: '/about', icon: FiInfo };
    if (user?.role === 'consumer') {
      return [market, about];
    }
    return [projects, market, about];
  }, [t, user?.role]);

  const userNavigation = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: FiUser },
    { name: t('nav.profile'), href: '/profile', icon: FiSettings },
  ];

  const adminNavigation = [
    { name: t('nav.admin'), href: '/admin', icon: FiUsers },
  ];

  const changeLang = (lng) => i18n.changeLanguage(lng);

  return (
    <header className="sticky top-0 z-50 topbar-agri text-white" style={{ backgroundColor: '#22a06b' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left: Logo + Nav */}
          <div className="flex items-center space-x-6 min-w-0">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img
                src="/logo.png"
                alt="AgriKonbit"
                className="h-24 md:h-28 w-auto object-contain drop-shadow-md -my-2"
                loading="eager"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => {
                const active = location.pathname.startsWith(item.href);
                const base = "px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors";
                const cls = active
                  ? `${base} bg-white/20 text-white`
                  : `${base} text-white/90 hover:text-white hover:bg-white/10`;
                const Icon = item.icon;
                return (
                  <Link key={item.name} to={item.href} className={cls} aria-current={active ? 'page' : undefined}>
                    {Icon && <Icon className="h-4 w-4 mr-2" />}
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Language */}
            <div className="hidden sm:flex items-center space-x-2 text-sm text-white/90">
              <button onClick={() => changeLang('fr')} className="hover:text-white">FR</button>
              <span>·</span>
              <button onClick={() => changeLang('en')} className="hover:text-white">EN</button>
              <span>·</span>
              <button onClick={() => changeLang('es')} className="hover:text-white">ES</button>
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-white hover:text-white">
              <FiShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-primary-700 text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                {/* Profile dropdown */}
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-white hover:text-white"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <FiUser className="h-4 w-4" />
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {user?.fullName}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 text-gray-700">
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.name}
                      </Link>
                    ))}
                    
                    {user?.role === 'admin' && (
                      <>
                        <div className="border-t border-gray-200 my-1"></div>
                        {adminNavigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <item.icon className="h-4 w-4 mr-3" />
                            {item.name}
                          </Link>
                        ))}
                      </>
                    )}
                    
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FiLogOut className="h-4 w-4 mr-3" />
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white hover:text-white"
              aria-label="Toggle navigation"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-white/20 bg-primary-700">
              {navigation.map((item) => {
                const active = location.pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${active ? 'text-white bg-white/20' : 'text-white/90 hover:text-white hover:bg-white/10'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="inline-flex items-center">
                      {Icon && <Icon className="h-4 w-4 mr-2" />}
                      {item.name}
                    </span>
                  </Link>
                );
              })}

              <div className="mt-2 border-t border-white/20" />
              <div className="px-3 py-2 text-sm text-white/90 flex items-center space-x-3">
                <button onClick={() => { changeLang('fr'); setIsMenuOpen(false); }} className="hover:text-white">FR</button>
                <span>·</span>
                <button onClick={() => { changeLang('en'); setIsMenuOpen(false); }} className="hover:text-white">EN</button>
                <span>·</span>
                <button onClick={() => { changeLang('es'); setIsMenuOpen(false); }} className="hover:text-white">ES</button>
              </div>

              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="text-white/90 hover:text-white hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white text-primary-700 block px-3 py-2 rounded-md text-base font-medium hover:bg-white/90"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
