import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FiHome, FiBriefcase, FiUsers, FiBell, FiUser, FiLogOut, FiSun, FiMoon } from 'react-icons/fi';
import AdminLogin from './AdminLogin';
import axios from 'axios';
import { ThemeProvider, useTheme } from '../../context/ThemeContext';

const AdminLayoutContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminProfileImage, setAdminProfileImage] = useState(null);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    // Check if admin is already authenticated
    const adminAuth = sessionStorage.getItem('adminAuth');
    const storedAdminUser = sessionStorage.getItem('adminUser');
    
    if (adminAuth === 'admin-authenticated' && storedAdminUser) {
      setIsAuthenticated(true);
      const parsedAdminUser = JSON.parse(storedAdminUser);
      setAdminUser(parsedAdminUser);
      
      // Load admin profile image
      const savedImage = localStorage.getItem(`adminProfileImage_${parsedAdminUser?.email}`);
      if (savedImage) {
        setAdminProfileImage(savedImage);
      }
      
      // Set axios header for future requests
      axios.defaults.headers.common['x-admin-auth'] = 'admin-authenticated';
    }
    setLoading(false);
  }, []);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setAdminUser(user);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminUser');
    delete axios.defaults.headers.common['x-admin-auth'];
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-lg dark:text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const navItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard', exact: true },
    { path: '/admin/jobs', icon: FiBriefcase, label: 'Jobs' },
    { path: '/admin/users', icon: FiUsers, label: 'Users' },
    { path: '/admin/profile', icon: FiUser, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="text-xl font-semibold text-gray-900 dark:text-white">
            Job Portal Admin
          </div>
          <div className="flex items-center space-x-4">
            {/* Admin Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                {adminProfileImage ? (
                  <img
                    src={adminProfileImage}
                    alt="Admin Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {adminUser?.name}
              </span>
            </div>
            
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
              title="Logout"
            >
              <FiLogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex space-x-4 px-4 sm:px-6 lg:px-8 py-4 border-t dark:border-gray-700">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <item.icon className="h-5 w-5 mr-2" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="dark:bg-gray-900">
        <Outlet />
      </main>
    </div>
  );
};

const AdminLayout = () => {
  return (
    <ThemeProvider>
      <AdminLayoutContent />
    </ThemeProvider>
  );
};

export default AdminLayout;