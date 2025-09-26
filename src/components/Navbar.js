import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaBolt, FaBars, FaTimes } from 'react-icons/fa';
import { debounce } from '../utils/performance';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      const navbarHeight = 80; // Account for navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleLogoError = () => {
    setLogoError(true);
  };

  // Debounced resize handler for better performance
  const debouncedHandleResize = useMemo(() => {
    return debounce(() => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    }, 150);
  }, []);

  // Close mobile menu on window resize
  useEffect(() => {
    window.addEventListener('resize', debouncedHandleResize);
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
      // Cleanup any pending debounced calls
      debouncedHandleResize.cancel?.();
    };
  }, [debouncedHandleResize]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] bg-gradient-to-r from-federal-blue/90 via-blue-green/80 to-federal-blue/90 backdrop-blur-md border-b border-white/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg">
              {!logoError ? (
                <img 
                  src="/logo.svg" 
                  alt="PowerLine Monitor Logo" 
                  className="w-8 h-8" 
                  onError={handleLogoError}
                />
              ) : (
                <FaBolt className="text-white text-xl" />
              )}
            </div>
            <div className="text-white font-bold text-lg tracking-tight hidden sm:block">
              PowerLine Monitor
            </div>
            <div className="text-white font-bold text-base tracking-tight sm:hidden">
              PLM
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block flex-1">
            <div className="flex items-center justify-center space-x-8 lg:space-x-12">
              <button 
                onClick={() => scrollToSection('powerline-map')} 
                className="group relative text-white hover:text-vivid-sky-blue px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-500/20 hover:shadow-[0_0_15px_rgba(72,202,228,0.4)] whitespace-nowrap transform hover:scale-105"
              >
                <span className="relative z-10">Live Monitoring</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-cyan-500/0 group-hover:from-blue-600/20 group-hover:to-cyan-500/20 rounded-lg transition-all duration-300"></div>
              </button>
              <button 
                onClick={() => scrollToSection('performance-analytics')} 
                className="group relative text-white hover:text-vivid-sky-blue px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-500/20 hover:shadow-[0_0_15px_rgba(72,202,228,0.4)] whitespace-nowrap transform hover:scale-105"
              >
                <span className="relative z-10">Analytics</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-cyan-500/0 group-hover:from-blue-600/20 group-hover:to-cyan-500/20 rounded-lg transition-all duration-300"></div>
              </button>
              <button 
                onClick={() => scrollToSection('intelligent-monitoring')} 
                className="group relative text-white hover:text-vivid-sky-blue px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-500/20 hover:shadow-[0_0_15px_rgba(72,202,228,0.4)] whitespace-nowrap transform hover:scale-105"
              >
                <span className="relative z-10">Alerts</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-cyan-500/0 group-hover:from-blue-600/20 group-hover:to-cyan-500/20 rounded-lg transition-all duration-300"></div>
              </button>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4 flex-shrink-0">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-600/30 to-cyan-500/30 backdrop-blur-sm rounded-full px-4 py-2 border border-vivid-sky-blue/30 shadow-[0_0_10px_rgba(72,202,228,0.3)]">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
              <span className="text-white text-xs font-semibold tracking-wide">System Online</span>
            </div>
            <button className="group relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:shadow-[0_0_20px_rgba(72,202,228,0.5)] transition-all duration-300 hover:scale-105 whitespace-nowrap overflow-hidden">
              <span className="relative z-10">Export Data</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-emerald-green inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <FaBars className="block h-6 w-6" />
              ) : (
                <FaTimes className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
        isMenuOpen 
          ? 'max-h-screen opacity-100 visible' 
          : 'max-h-0 opacity-0 invisible'
      }`}>
        <div className="bg-gradient-to-br from-federal-blue/95 to-marian-blue/95 backdrop-blur-md border-t border-vivid-sky-blue/30">
          <div className="px-4 pt-4 pb-3 space-y-2">
            <button 
              onClick={() => { scrollToSection('powerline-map'); closeMenu(); }} 
              className="group text-white block w-full text-left px-4 py-3 rounded-xl text-base font-semibold hover:bg-gradient-to-r hover:from-blue-600/30 hover:to-cyan-500/30 hover:shadow-[0_0_15px_rgba(72,202,228,0.3)] transition-all duration-300 border border-transparent hover:border-vivid-sky-blue/30"
            >
              <span className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-vivid-sky-blue rounded-full group-hover:shadow-[0_0_8px_rgba(72,202,228,0.6)] transition-all duration-300"></span>
                <span>Live Monitoring</span>
              </span>
            </button>
            <button 
              onClick={() => { scrollToSection('performance-analytics'); closeMenu(); }} 
              className="group text-white block w-full text-left px-4 py-3 rounded-xl text-base font-semibold hover:bg-gradient-to-r hover:from-blue-600/30 hover:to-cyan-500/30 hover:shadow-[0_0_15px_rgba(72,202,228,0.3)] transition-all duration-300 border border-transparent hover:border-vivid-sky-blue/30"
            >
              <span className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-vivid-sky-blue rounded-full group-hover:shadow-[0_0_8px_rgba(72,202,228,0.6)] transition-all duration-300"></span>
                <span>Analytics</span>
              </span>
            </button>
            <button 
              onClick={() => { scrollToSection('intelligent-monitoring'); closeMenu(); }} 
              className="group text-white block w-full text-left px-4 py-3 rounded-xl text-base font-semibold hover:bg-gradient-to-r hover:from-blue-600/30 hover:to-cyan-500/30 hover:shadow-[0_0_15px_rgba(72,202,228,0.3)] transition-all duration-300 border border-transparent hover:border-vivid-sky-blue/30"
            >
              <span className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-vivid-sky-blue rounded-full group-hover:shadow-[0_0_8px_rgba(72,202,228,0.6)] transition-all duration-300"></span>
                <span>Alerts</span>
              </span>
            </button>
            <div className="pt-4 pb-2 border-t border-vivid-sky-blue/20 mt-4">
              <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-xl border border-vivid-sky-blue/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
                <span className="text-white text-sm font-semibold">System Online</span>
              </div>
              <button className="w-full mt-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:shadow-[0_0_20px_rgba(72,202,228,0.4)] hover:from-cyan-500 hover:to-blue-600 transition-all duration-300">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
