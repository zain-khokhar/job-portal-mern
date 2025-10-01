import axios from 'axios';
import { getCurrentUser } from './authService';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  try {
    const user = getCurrentUser();
    const token = user?.token || user?.user?.token || user?.accessToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/users/${userId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error.response?.data || { message: 'Failed to fetch user profile' };
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/users/${userId}`, profileData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error.response?.data || { message: 'Failed to update user profile' };
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/auth/change-password`, passwordData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Change password error:', error);
    throw error.response?.data || { message: 'Failed to change password' };
  }
};

// Upload profile image
export const uploadProfileImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('profileImage', imageFile);
    
    const response = await axios.post(`${BASE_URL}/api/users/upload-profile-image`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Upload profile image error:', error);
    throw error.response?.data || { message: 'Failed to upload profile image' };
  }
};

// Get user status - useful for checking if user is suspended
export const getUserStatus = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/users/${userId}/status`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Get user status error:', error);
    throw error.response?.data || { message: 'Failed to fetch user status' };
  }
};

// Profile image utilities for localStorage
export const saveProfileImageToStorage = (userEmail, imageDataUrl) => {
  try {
    localStorage.setItem(`profileImage_${userEmail}`, imageDataUrl);
    return true;
  } catch (error) {
    console.error('Failed to save profile image to localStorage:', error);
    return false;
  }
};

export const getProfileImageFromStorage = (userEmail) => {
  try {
    return localStorage.getItem(`profileImage_${userEmail}`);
  } catch (error) {
    console.error('Failed to get profile image from localStorage:', error);
    return null;
  }
};

export const removeProfileImageFromStorage = (userEmail) => {
  try {
    localStorage.removeItem(`profileImage_${userEmail}`);
    return true;
  } catch (error) {
    console.error('Failed to remove profile image from localStorage:', error);
    return false;
  }
};

// Notification preferences
export const updateNotificationPreferences = async (preferences) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/users/notification-preferences`, preferences, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Update notification preferences error:', error);
    throw error.response?.data || { message: 'Failed to update notification preferences' };
  }
};

// Get notification preferences
export const getNotificationPreferences = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/users/notification-preferences`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Get notification preferences error:', error);
    throw error.response?.data || { message: 'Failed to fetch notification preferences' };
  }
};