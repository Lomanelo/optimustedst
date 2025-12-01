import React, { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCMS } from '../../app/contexts/cms-context';
import { useAuth } from '../../app/contexts/auth-context';
import Logo from './Logo';
import Button from './Button';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-accent' : 'text-gray-800';
  };

  return (
    <nav 
      className={`navbar-container fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <Link to="/programs" className={`${isActive('/programs')} hover:text-accent font-medium transition-colors`}>{t('header.programs')}</Link>
            <Link to="/about" className={`${isActive('/about')} hover:text-accent font-medium transition-colors`}>{t('header.about')}</Link>
            <Link to="/blog" className={`${isActive('/blog')} hover:text-accent font-medium transition-colors`}>{t('header.blog')}</Link>
            <Link to="/contact" className={`${isActive('/contact')} hover:text-accent font-medium transition-colors`}>{t('header.contact')}</Link>
            {currentUser && (
              <Link to="/dashboard" className={`${isActive('/dashboard')} hover:text-accent font-medium transition-colors`}>{t('header.dashboard')}</Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            {currentUser ? (
              <Link to="/profile" className="flex items-center space-x-2 text-primary hover:text-primary-dark">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                  {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
                </div>
                <span className="font-medium hidden lg:inline-block">{currentUser.displayName?.split(' ')[0] || currentUser.email?.split('@')[0]}</span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
                  {t('auth.login')}
                </Link>
                <a href="https://optimus-solutions.org/register" target="_blank" rel="noopener noreferrer">
                  <Button variant="accent" size="md">{t('header.enroll')}</Button>
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-gray-800"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-white`}>
        <div className="px-4 pt-2 pb-4 space-y-3">
          <Link to="/programs" className={`block ${isActive('/programs')} hover:text-accent font-medium py-2 transition-colors`}>{t('header.programs')}</Link>
          <Link to="/about" className={`block ${isActive('/about')} hover:text-accent font-medium py-2 transition-colors`}>{t('header.about')}</Link>
          <Link to="/blog" className={`block ${isActive('/blog')} hover:text-accent font-medium py-2 transition-colors`}>{t('header.blog')}</Link>
          <Link to="/contact" className={`block ${isActive('/contact')} hover:text-accent font-medium py-2 transition-colors`}>{t('header.contact')}</Link>
          {currentUser && (
            <Link to="/dashboard" className={`block ${isActive('/dashboard')} hover:text-accent font-medium py-2 transition-colors`}>{t('header.dashboard')}</Link>
          )}
          <LanguageSwitcher />
          
          {currentUser ? (
            <Link to="/profile" className="flex items-center space-x-2 py-2">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
              </div>
              <span className="font-medium">{currentUser.displayName || currentUser.email?.split('@')[0]}</span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="block font-medium text-primary hover:text-primary-dark py-2">
                {t('auth.login')}
              </Link>
              <a href="https://optimus-solutions.org/register" target="_blank" rel="noopener noreferrer" className="block w-full mt-2">
                <Button variant="accent" size="md" className="w-full">{t('header.enroll')}</Button>
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;