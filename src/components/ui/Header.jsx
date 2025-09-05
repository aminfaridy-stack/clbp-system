import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const location = useLocation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'fa' : 'en';
    setCurrentLanguage(newLanguage);
    document.documentElement?.setAttribute('dir', newLanguage === 'fa' ? 'rtl' : 'ltr');
    document.documentElement?.setAttribute('lang', newLanguage);
  };

  const isPatientRoute = ['/patient-registration', '/patient-login', '/multi-step-assessment', '/assessment-results']?.includes(location?.pathname);
  const isProfessionalRoute = ['/admin-dashboard', '/patient-profile']?.includes(location?.pathname);

  const patientNavItems = [
    { path: '/patient-registration', label: currentLanguage === 'fa' ? 'ثبت نام' : 'Registration', icon: 'UserPlus' },
    { path: '/patient-login', label: currentLanguage === 'fa' ? 'ورود' : 'Login', icon: 'LogIn' },
    { path: '/multi-step-assessment', label: currentLanguage === 'fa' ? 'ارزیابی' : 'Assessment', icon: 'ClipboardList' },
    { path: '/assessment-results', label: currentLanguage === 'fa' ? 'نتایج' : 'Results', icon: 'BarChart3' }
  ];

  const professionalNavItems = [
    { path: '/patient-profile', label: currentLanguage === 'fa' ? 'پروفایل بیمار' : 'Patient Profile', icon: 'User' },
    { path: '/admin-dashboard', label: currentLanguage === 'fa' ? 'داشبورد مدیریت' : 'Admin Dashboard', icon: 'LayoutDashboard' }
  ];

  const currentNavItems = isPatientRoute ? patientNavItems : professionalNavItems;

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const Logo = () => (
    <div className="flex items-center space-x-3 rtl:space-x-reverse">
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
        <Icon name="Activity" size={24} color="white" />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-foreground font-heading">
          {currentLanguage === 'fa' ? 'سیستم پیش‌بینی CLBP' : 'CLBP Predictive System'}
        </span>
        <span className="text-xs text-muted-foreground font-caption">
          {currentLanguage === 'fa' ? 'سیستم پیشرفته تشخیص پزشکی' : 'Advanced Medical Assessment'}
        </span>
      </div>
    </div>
  );

  return (
    <header className="nav-clinical sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {currentNavItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`nav-item-clinical ${
                  location?.pathname === item?.path ? 'active' : ''
                } flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-md text-sm font-medium transition-clinical`}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-2 rtl:space-x-reverse"
            >
              <Icon name="Globe" size={16} />
              <span className="text-sm font-medium">
                {currentLanguage === 'fa' ? 'EN' : 'فا'}
              </span>
            </Button>

            {/* Professional Access */}
            {isPatientRoute && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin-dashboard')}
                iconName="Shield"
                iconPosition="left"
              >
                {currentLanguage === 'fa' ? 'دسترسی حرفه‌ای' : 'Professional Access'}
              </Button>
            )}

            {/* Patient Portal */}
            {isProfessionalRoute && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/patient-login')}
                iconName="Users"
                iconPosition="left"
              >
                {currentLanguage === 'fa' ? 'پورتال بیمار' : 'Patient Portal'}
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Icon name={isMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <>
          <div 
            className="mobile-nav-overlay"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="mobile-nav-panel">
            <div className="p-4 border-b border-border">
              <Logo />
            </div>
            <nav className="p-4 space-y-2">
              {currentNavItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`w-full nav-item-clinical ${
                    location?.pathname === item?.path ? 'active' : ''
                  } flex items-center space-x-3 rtl:space-x-reverse px-3 py-3 rounded-md text-sm font-medium transition-clinical`}
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.label}</span>
                </button>
              ))}
              
              <div className="pt-4 mt-4 border-t border-border">
                {isPatientRoute ? (
                  <button
                    onClick={() => handleNavigation('/admin-dashboard')}
                    className="w-full nav-item-clinical flex items-center space-x-3 rtl:space-x-reverse px-3 py-3 rounded-md text-sm font-medium transition-clinical"
                  >
                    <Icon name="Shield" size={18} />
                    <span>{currentLanguage === 'fa' ? 'دسترسی حرفه‌ای' : 'Professional Access'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavigation('/patient-login')}
                    className="w-full nav-item-clinical flex items-center space-x-3 rtl:space-x-reverse px-3 py-3 rounded-md text-sm font-medium transition-clinical"
                  >
                    <Icon name="Users" size={18} />
                    <span>{currentLanguage === 'fa' ? 'پورتال بیمار' : 'Patient Portal'}</span>
                  </button>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;