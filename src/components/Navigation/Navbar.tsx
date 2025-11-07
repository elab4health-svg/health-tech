import React, { useState } from 'react';
import { Activity, BarChart3, Map, Users, ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, category: 'main' },
    { 
      id: 'countries', 
      label: 'Region Analysis', 
      icon: Map, 
      category: 'main',
      subItems: [
        { id: 'singapore', label: 'Singapore', icon: Users },
        { id: 'malaysia', label: 'Malaysia', icon: Users },
        { id: 'indonesia', label: 'Indonesia', icon: Users },
        { id: 'thailand', label: 'Thailand', icon: Users },
        { id: 'vietnam', label: 'Vietnam', icon: Users },
        { id: 'philippines', label: 'Philippines', icon: Users },
        { id: 'hongkong', label: 'Hong Kong', icon: Users },
        { id: 'GBA', label: 'GBA', icon: Users },
      ]
    },
    { id: 'insights', label: 'Regional Insights', icon: Activity, category: 'main' }
  ];

  const flatTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'singapore', label: 'Singapore', icon: Users },
    { id: 'malaysia', label: 'Malaysia', icon: Users },
    { id: 'indonesia', label: 'Indonesia', icon: Users },
    { id: 'thailand', label: 'Thailand', icon: Users },
    { id: 'vietnam', label: 'Vietnam', icon: Users },
    { id: 'philippines', label: 'Philippines', icon: Users },
    { id: 'hongkong', label: 'Hong Kong', icon: Users },
    { id: 'GBA', label: 'GBA', icon: Users },
    { id: 'insights', label: 'Regional Insights', icon: Activity }
  ];

  const CountriesDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const countryTabs = tabs.find(tab => tab.id === 'countries')?.subItems || [];

    return (
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 relative overflow-hidden ${
            countryTabs.some(country => country.id === activeTab)
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Map className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Region Analysis</span>
          <ChevronDown className={`w-4 h-4 relative z-10 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 mt-[-2px] w-56 bg-white rounded-b-xl rounded-t-sm shadow-lg border border-gray-200 border-t-0 py-2 z-50"
            >
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                Select Country
              </div>
              {countryTabs.map((country, index) => {
                const Icon = country.icon;
                return (
                  <motion.button
                    key={country.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      onTabChange(country.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 ${
                      activeTab === country.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{country.label}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative">
              <Activity className="w-8 h-8 text-blue-600" />
              <motion.div
                className="absolute inset-0 bg-blue-600 rounded-full opacity-20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
              HealthTech Insights
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Overview Tab */}
            <motion.button
              onClick={() => onTabChange('overview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 relative overflow-hidden ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setHoveredTab('overview')}
              onHoverEnd={() => setHoveredTab(null)}
            >
              {hoveredTab === 'overview' && activeTab !== 'overview' && (
                <motion.div
                  layoutId="hoverBackground"
                  className="absolute inset-0 bg-gray-100 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              <BarChart3 className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Overview</span>
            </motion.button>

            {/* Countries Dropdown */}
            <CountriesDropdown />

            {/* Insights Tab */}
            <motion.button
              onClick={() => onTabChange('insights')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 relative overflow-hidden ${
                activeTab === 'insights'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setHoveredTab('insights')}
              onHoverEnd={() => setHoveredTab(null)}
            >
              {hoveredTab === 'insights' && activeTab !== 'insights' && (
                <motion.div
                  layoutId="hoverBackground"
                  className="absolute inset-0 bg-gray-100 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              <Activity className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Regional Insights</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <motion.button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden"
            >
              <div className="pb-4 pt-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {flatTabs.map((tab, index) => {
                    const Icon = tab.icon;
                    return (
                      <motion.button
                        key={tab.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                        onClick={() => {
                          onTabChange(tab.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-center leading-tight">{tab.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar; 