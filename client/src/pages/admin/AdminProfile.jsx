import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Shield, 
  Settings, 
  Camera, 
  Save, 
  Edit3, 
  Lock, 
  Bell, 
  Eye, 
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BarChart3,
  Users,
  Briefcase
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdminProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const fileInputRef = useRef(null);

  // Get admin user from sessionStorage
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const storedAdmin = sessionStorage.getItem('adminUser');
      return storedAdmin ? JSON.parse(storedAdmin) : null;
    } catch {
      return null;
    }
  });

  const [formData, setFormData] = useState({
    name: adminUser?.name || 'Admin User',
    email: adminUser?.email || 'admin@jobly.com',
    phone: adminUser?.phone || '',
    department: adminUser?.department || 'Human Resources',
    position: adminUser?.position || 'System Administrator',
    bio: adminUser?.bio || '',
    permissions: adminUser?.permissions || [],
    notifications: {
      email: true,
      push: true,
      sms: false,
      adminAlerts: true
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [adminStats, setAdminStats] = useState({
    totalUsers: 1248,
    totalJobs: 89,
    pendingApplications: 156,
    activeRecruiters: 23,
    lastLogin: new Date().toISOString(),
    accountCreated: '2024-01-15'
  });

  // Load profile image from localStorage
  useEffect(() => {
    if (adminUser?.email) {
      const savedImage = localStorage.getItem(`adminProfileImage_${adminUser.email}`);
      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
  }, [adminUser?.email]);

  // Handle profile image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target.result;
      setProfileImage(imageDataUrl);
      localStorage.setItem(`adminProfileImage_${adminUser?.email}`, imageDataUrl);
      toast.success('Profile picture updated successfully!');
    };
    reader.readAsDataURL(file);
  };

  // Handle form data change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('notifications.')) {
      const notificationKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationKey]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Handle password data change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const updatedAdmin = {
        ...adminUser,
        ...formData
      };
      
      setAdminUser(updatedAdmin);
      sessionStorage.setItem('adminUser', JSON.stringify(updatedAdmin));
      
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      toast.success('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordChange(false);
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'permissions', label: 'Permissions', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const permissions = [
    { id: 'manage_users', label: 'Manage Users', description: 'Create, edit, and delete user accounts' },
    { id: 'manage_jobs', label: 'Manage Jobs', description: 'Oversee job postings and applications' },
    { id: 'view_analytics', label: 'View Analytics', description: 'Access platform analytics and reports' },
    { id: 'system_settings', label: 'System Settings', description: 'Modify platform configuration' },
    { id: 'manage_admins', label: 'Manage Admins', description: 'Add and remove admin privileges' }
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your admin account and system preferences</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <div className="relative group">
                  <div className="w-20 h-20 mx-auto mb-4 relative">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Admin Profile"
                        className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center border-4 border-white shadow-lg">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                    )}
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <Camera className="w-5 h-5 text-white" />
                    </button>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-center">{formData.name}</h3>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Administrator</span>
                  </div>
                </div>
              </div>

              {/* Admin Status */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full border bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800">
                    Active
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="p-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors mb-2 ${
                        activeTab === tab.id
                          ? 'bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800'
                          : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-8"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
                      <button
                        onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                        disabled={isLoading}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          isEditing
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : isEditing ? (
                          <Save className="w-4 h-4" />
                        ) : (
                          <Edit3 className="w-4 h-4" />
                        )}
                        {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                          Personal Information
                        </h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:disabled:bg-gray-600"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              disabled={true}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              placeholder="Enter your phone number"
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:disabled:bg-gray-600"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Administrative Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                          Administrative Information
                        </h3>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
                          <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:disabled:bg-gray-600"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Position</label>
                          <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:disabled:bg-gray-600"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                          <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            rows={4}
                            placeholder="Administrative notes..."
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:disabled:bg-gray-600 resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Admin Statistics */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Administrator Statistics</h3>
                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <span className="font-medium text-gray-700 dark:text-gray-300">Total Users</span>
                          </div>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{adminStats.totalUsers.toLocaleString()}</p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Briefcase className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <span className="font-medium text-gray-700 dark:text-gray-300">Active Jobs</span>
                          </div>
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{adminStats.totalJobs}</p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            <span className="font-medium text-gray-700 dark:text-gray-300">Pending Apps</span>
                          </div>
                          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{adminStats.pendingApplications}</p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            <span className="font-medium text-gray-700 dark:text-gray-300">Recruiters</span>
                          </div>
                          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{adminStats.activeRecruiters}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-8"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Security Settings</h2>

                    <div className="space-y-6">
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Password</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Keep your admin account secure with a strong password</p>
                          </div>
                          <button
                            onClick={() => setShowPasswordChange(!showPasswordChange)}
                            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                          >
                            Change Password
                          </button>
                        </div>

                        <AnimatePresence>
                          {showPasswordChange && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                                  <div className="relative">
                                    <input
                                      type={showPasswords.current ? 'text' : 'password'}
                                      name="currentPassword"
                                      value={passwordData.currentPassword}
                                      onChange={handlePasswordChange}
                                      className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-300"
                                      placeholder="Enter current password"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                      {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                                  <div className="relative">
                                    <input
                                      type={showPasswords.new ? 'text' : 'password'}
                                      name="newPassword"
                                      value={passwordData.newPassword}
                                      onChange={handlePasswordChange}
                                      className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-300"
                                      placeholder="Enter new password"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                                  <div className="relative">
                                    <input
                                      type={showPasswords.confirm ? 'text' : 'password'}
                                      name="confirmPassword"
                                      value={passwordData.confirmPassword}
                                      onChange={handlePasswordChange}
                                      className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-300"
                                      placeholder="Confirm new password"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                  </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                  <button
                                    onClick={handlePasswordUpdate}
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                  >
                                    {isLoading ? 'Updating...' : 'Update Password'}
                                  </button>
                                  <button
                                    onClick={() => setShowPasswordChange(false)}
                                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'permissions' && (
                  <motion.div
                    key="permissions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-8"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Permissions</h2>
                    
                    <div className="space-y-4">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-800 dark:text-gray-200">{permission.label}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{permission.description}</p>
                            </div>
                            <div className="flex items-center">
                              <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                              <span className="text-sm font-medium text-green-600 dark:text-green-400">Granted</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'notifications' && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-8"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>

                    <div className="space-y-6">
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Admin Notifications</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-700 dark:text-gray-300">Admin Alerts</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Critical system notifications and alerts</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="notifications.adminAlerts"
                                checked={formData.notifications.adminAlerts}
                                onChange={handleInputChange}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-700 dark:text-gray-300">Email Notifications</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="notifications.email"
                                checked={formData.notifications.email}
                                onChange={handleInputChange}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-700 dark:text-gray-300">Push Notifications</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Browser push notifications</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="notifications.push"
                                checked={formData.notifications.push}
                                onChange={handleInputChange}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'analytics' && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-8"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Analytics</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Account Information</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Account Created</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{new Date(adminStats.accountCreated).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Last Login</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{new Date(adminStats.lastLogin).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Role</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">System Administrator</span>
                          </div>
                        </div>
                      </div>

                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">System Overview</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Platform Uptime</span>
                            <span className="font-medium text-green-600 dark:text-green-400">99.9%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Active Sessions</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">342</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">System Health</span>
                            <span className="font-medium text-green-600 dark:text-green-400">Excellent</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;