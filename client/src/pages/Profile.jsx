import React, { useContext, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Shield, 
  Camera, 
  Save, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Lock, 
  Edit3, 
  Home,
  Settings,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Star,
  Award,
  Bell,
  Eye,
  EyeOff
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  updateUserProfile, 
  changePassword, 
  saveProfileImageToStorage, 
  getProfileImageFromStorage
} from "../services/profileService";

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(AppContext);
  const fileInputRef = useRef(null);
  
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    location: currentUser?.location || '',
    bio: currentUser?.bio || '',
    company: currentUser?.company || '',
    position: currentUser?.position || '',
    website: currentUser?.website || '',
    notifications: {
      email: true,
      push: true,
      sms: false
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

  // Load profile image from localStorage on component mount
  useEffect(() => {
    if (currentUser?.email) {
      const savedImage = getProfileImageFromStorage(currentUser.email);
      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
  }, [currentUser?.email]);

  // Handle profile image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target.result;
      setProfileImage(imageDataUrl);
      
      // Save to localStorage with user-specific key
      const saved = saveProfileImageToStorage(currentUser?.email, imageDataUrl);
      if (saved) {
        toast.success('Profile picture updated successfully!');
        
        // Force navbar to update by triggering a custom event
        window.dispatchEvent(new CustomEvent('profileImageUpdated', { 
          detail: { userEmail: currentUser?.email, imageUrl: imageDataUrl } 
        }));
      } else {
        toast.error('Failed to save profile picture');
      }
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
      // In a real app, you would make an API call to update the user profile
      // For now, we'll update the context and localStorage
      
      const updatedUser = {
        ...currentUser,
        ...formData
      };
      
      setCurrentUser(updatedUser);
      
      // Save to localStorage (in a real app, this would be handled by the API)
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.user = updatedUser;
      localStorage.setItem('user', JSON.stringify(userData));
      
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change
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
      // In a real app, you would make an API call to change the password
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      toast.success('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordChange(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'recruiter':
        return <Briefcase className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Premium background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <Navbar />
      
      <div className="pt-32 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => navigate('/')}
                className="group flex items-center gap-3 px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/20 text-gray-700 rounded-xl hover:bg-white/90 hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Back to Home</span>
              </button>
            </div>
            
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4"
              >
                <Settings className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-800 font-medium text-sm uppercase tracking-wide">Profile Management</span>
              </motion.div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-4">
                Profile Settings
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Customize your experience and manage your professional presence
              </p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-all duration-500">
                {/* Profile Header */}
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 text-white relative overflow-hidden">
                  {/* Premium background pattern */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                  </div>
                  <div className="relative group">
                    <div className="w-24 h-24 mx-auto mb-6 relative">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover border-4 border-white/30 shadow-2xl ring-4 ring-white/20"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center border-4 border-white/30 shadow-2xl ring-4 ring-white/20">
                          <User className="w-10 h-10 text-white" />
                        </div>
                      )}
                      
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center hover:scale-105"
                      >
                        <Camera className="w-6 h-6 text-white drop-shadow-lg" />
                      </button>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    
                    <h3 className="text-xl font-bold text-center text-white drop-shadow-lg">{currentUser?.name}</h3>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <div className="p-1 bg-white/20 rounded-full">
                        {getRoleIcon(currentUser?.role)}
                      </div>
                      <span className="text-sm font-medium capitalize text-white/90 tracking-wide">{currentUser?.role}</span>
                    </div>
                  </div>
                </div>

                {/* User Status */}
                <div className="p-6 border-b border-gray-100/50 bg-gradient-to-r from-gray-50/50 to-blue-50/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 tracking-wide">Account Status</span>
                    <span className={`px-4 py-2 text-xs font-bold rounded-full border shadow-sm ${getStatusColor(currentUser?.status || 'active')}`}>
                      {currentUser?.status || 'Active'}
                    </span>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <nav className="p-6 space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`group w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-300 mb-1 ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]'
                            : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-blue-600 hover:shadow-md'
                        }`}
                      >
                        <div className={`p-2 rounded-lg transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-white/20'
                            : 'bg-gray-100 group-hover:bg-blue-100'
                        }`}>
                          <Icon className={`w-4 h-4 transition-all duration-300 ${
                            activeTab === tab.id ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'
                          }`} />
                        </div>
                        <span className="font-semibold tracking-wide">{tab.label}</span>
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
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-all duration-500">
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
                        <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                        <button
                          onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                          disabled={isLoading}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                            isEditing
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                            Basic Information
                          </h3>
                          
                          <div>
                            <label className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">Full Name</label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50/70 disabled:text-gray-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">Email Address</label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={true} // Email should not be editable
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50/70 text-gray-500 backdrop-blur-sm font-medium"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">Phone Number</label>
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Enter your phone number"
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50/70 disabled:text-gray-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg font-medium"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">Location</label>
                            <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Enter your location"
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50/70 disabled:text-gray-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg font-medium"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Professional Information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                            Professional Information
                          </h3>

                          <div>
                            <label className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">Company</label>
                            <div className="relative">
                              <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Enter your company"
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50/70 disabled:text-gray-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg font-medium"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">Position</label>
                            <input
                              type="text"
                              name="position"
                              value={formData.position}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              placeholder="Enter your position"
                              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50/70 disabled:text-gray-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">Website</label>
                            <input
                              type="url"
                              name="website"
                              value={formData.website}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              placeholder="https://yourwebsite.com"
                              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50/70 disabled:text-gray-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">Bio</label>
                            <textarea
                              name="bio"
                              value={formData.bio}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              rows={4}
                              placeholder="Tell us about yourself..."
                              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50/70 disabled:text-gray-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-md focus:shadow-lg resize-none font-medium"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Account Information */}
                      <div className="mt-10 pt-8 border-t border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                            <Award className="w-5 h-5 text-white" />
                          </div>
                          Account Information
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center gap-4 mb-3">
                              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                                {getRoleIcon(currentUser?.role)}
                              </div>
                              <span className="font-bold text-gray-800 text-lg">Role</span>
                            </div>
                            <p className="text-blue-800 font-semibold capitalize text-lg">{currentUser?.role || 'User'}</p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl p-6 border border-emerald-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center gap-4 mb-3">
                              <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg shadow-lg">
                                <Calendar className="w-5 h-5 text-white" />
                              </div>
                              <span className="font-bold text-gray-800 text-lg">Member Since</span>
                            </div>
                            <p className="text-emerald-800 font-semibold text-lg">
                              {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 border border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center gap-4 mb-3">
                              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg shadow-lg">
                                <CheckCircle className="w-5 h-5 text-white" />
                              </div>
                              <span className="font-bold text-gray-800 text-lg">Status</span>
                            </div>
                            <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full shadow-sm ${getStatusColor(currentUser?.status || 'active')}`}>
                              {currentUser?.status || 'Active'}
                            </span>
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
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>

                      {/* Password Change Section */}
                      <div className="space-y-6">
                        <div className="border-2 border-gray-200 rounded-2xl p-8 bg-gradient-to-br from-white to-gray-50/50 shadow-lg hover:shadow-xl transition-all duration-300">
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg">
                                  <Lock className="w-5 h-5 text-white" />
                                </div>
                                Password Security
                              </h3>
                              <p className="text-gray-600 mt-2">Keep your account secure with a strong password</p>
                            </div>
                            <button
                              onClick={() => setShowPasswordChange(!showPasswordChange)}
                              className="px-6 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-xl hover:from-blue-200 hover:to-indigo-200 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
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
                                <div className="space-y-4 pt-4 border-t border-gray-200">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                    <div className="relative">
                                      <input
                                        type={showPasswords.current ? 'text' : 'password'}
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter current password"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                      >
                                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                      </button>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                    <div className="relative">
                                      <input
                                        type={showPasswords.new ? 'text' : 'password'}
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter new password"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                      >
                                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                      </button>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                    <div className="relative">
                                      <input
                                        type={showPasswords.confirm ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Confirm new password"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                      >
                                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex gap-3 pt-4">
                                    <button
                                      onClick={handlePasswordUpdate}
                                      disabled={isLoading}
                                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                      {isLoading ? 'Updating...' : 'Update Password'}
                                    </button>
                                    <button
                                      onClick={() => setShowPasswordChange(false)}
                                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Two-Factor Authentication */}
                        <div className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">Two-Factor Authentication</h3>
                              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                            </div>
                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                              Enable 2FA
                            </button>
                          </div>
                        </div>
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
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>

                      <div className="space-y-8">
                        <div className="border-2 border-gray-200 rounded-2xl p-8 bg-gradient-to-br from-white to-blue-50/30 shadow-lg hover:shadow-xl transition-all duration-300">
                          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                              <Bell className="w-5 h-5 text-white" />
                            </div>
                            Communication Preferences
                          </h3>
                          
                          <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-white/70 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
                              <div>
                                <h4 className="font-bold text-gray-800">Email Notifications</h4>
                                <p className="text-sm text-gray-600 mt-1">Receive notifications via email</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  name="notifications.email"
                                  checked={formData.notifications.email}
                                  onChange={handleInputChange}
                                  className="sr-only peer"
                                />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-600 shadow-lg"></div>
                              </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/70 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
                              <div>
                                <h4 className="font-bold text-gray-800">Push Notifications</h4>
                                <p className="text-sm text-gray-600 mt-1">Receive push notifications in your browser</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  name="notifications.push"
                                  checked={formData.notifications.push}
                                  onChange={handleInputChange}
                                  className="sr-only peer"
                                />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-600 shadow-lg"></div>
                              </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/70 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
                              <div>
                                <h4 className="font-bold text-gray-800">SMS Notifications</h4>
                                <p className="text-sm text-gray-600 mt-1">Receive important notifications via SMS</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  name="notifications.sms"
                                  checked={formData.notifications.sms}
                                  onChange={handleInputChange}
                                  className="sr-only peer"
                                />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-600 shadow-lg"></div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'preferences' && (
                    <motion.div
                      key="preferences"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-8"
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Preferences</h2>
                      
                      <div className="space-y-6">
                        <div className="border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Preferences</h3>
                          <p className="text-gray-600">These preferences will be available in a future update.</p>
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

      <Footer />
      
      {/* Premium CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #6366f1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #4f46e5);
        }
        
        /* Glass morphism effect */
        .glass {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
      `}</style>
    </div>
  );
};

export default Profile;