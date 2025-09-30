import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FiHome, FiBriefcase, FiUsers, FiBell, FiUser, FiLogOut } from 'react-icons/fi';
import AdminLogin from './AdminLogin';
import axios from 'axios';

const AdminLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already authenticated
    const adminAuth = localStorage.getItem('adminAuth');
    const storedAdminUser = localStorage.getItem('adminUser');
    
    if (adminAuth === 'admin-authenticated' && storedAdminUser) {
      setIsAuthenticated(true);
      setAdminUser(JSON.parse(storedAdminUser));
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
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    delete axios.defaults.headers.common['x-admin-auth'];
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
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
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="text-xl font-semibold text-gray-900">
            Job Portal Admin
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {adminUser?.name}
            </span>
            <button 
              onClick={handleLogout}
              className="p-1 rounded-full text-gray-400 hover:text-gray-500"
              title="Logout"
            >
              <FiLogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex space-x-4 px-4 sm:px-6 lg:px-8 py-4 border-t">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-md text-sm font-medium
                ${isActive
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;