import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/auth';

export const register = async (userData) => {
  try {
    console.log("Registering user with data:", userData); // Debug log
    
    const response = await axios.post('http://localhost:5000/api/auth/signup', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || "user"
    });
    
    console.log("Registration API response:", response.data); // Debug log
    return response.data;
    
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message || 'Something went wrong during registration' };
  }
};

export const login = async (credentials) => {
  try {
    console.log("Attempting login with:", { email: credentials.email, role: credentials.role }); // Debug log
    
    const response = await axios.post('http://localhost:5000/api/auth/signin', {
      email: credentials.email,
      password: credentials.password,
      role: credentials.role
    });
    
    console.log("Login API response:", response.data); // Debug log
    
    // Handle different response structures and normalize the data
    let normalizedResponse = {
      success: true,
      token: null,
      user: null
    };
    
    if (response.data) {
      // Extract token
      normalizedResponse.token = response.data.token || response.data.accessToken || 'temp-token-' + Date.now();
      
      // Extract user data - handle different structures
      if (response.data.user) {
        normalizedResponse.user = response.data.user;
      } else if (response.data.data && response.data.data.user) {
        normalizedResponse.user = response.data.data.user;
      } else if (response.data.name || response.data.email) {
        // User data is directly in response.data
        normalizedResponse.user = {
          id: response.data.id || response.data._id || Date.now(),
          name: response.data.name,
          email: response.data.email,
          role: response.data.role || credentials.role || 'user'
        };
      } else {
        // Fallback - create user from credentials if no user data in response
        normalizedResponse.user = {
          id: Date.now(),
          name: response.data.username || credentials.email?.split('@')[0] || 'User',
          email: credentials.email,
          role: credentials.role || 'user'
        };
      }
      
      // Ensure user has required fields
      normalizedResponse.user = {
        ...normalizedResponse.user,
        id: normalizedResponse.user.id || Date.now(),
        name: normalizedResponse.user.name || normalizedResponse.user.username || credentials.email?.split('@')[0] || 'User',
        email: normalizedResponse.user.email || credentials.email,
        role: normalizedResponse.user.role || credentials.role || 'user'
      };
    }
    
    console.log("Normalized response:", normalizedResponse); // Debug log
    console.log("Storing user data:", normalizedResponse); // Debug log
    localStorage.setItem('user', JSON.stringify(normalizedResponse));
    
    return normalizedResponse;
    
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message || 'Login failed. Please check your credentials.' };
  }
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('user');
    const parsed = userData ? JSON.parse(userData) : null;
    console.log("getCurrentUser returning:", parsed); // Debug log
    return parsed;
  } catch (error) {
    console.error("Error parsing user data:", error);
    localStorage.removeItem('user'); // Clear corrupted data
    return null;
  }
};

// Helper function to get all registered users (for debugging)
export const getAllRegisteredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  } catch (error) {
    console.error("Error parsing registered users:", error);
    return [];
  }
};

// Helper function to check if user is admin
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.user && user.user.role === 'admin';
};

// Password reset functions
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
      email
    });
    
    return response.data;
  } catch (error) {
    console.error("Forgot password error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message || 'Failed to send password reset email' };
  }
};

export const verifyResetToken = async (token) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/verify-reset-token', {
      token
    });
    
    return response.data;
  } catch (error) {
    console.error("Verify reset token error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message || 'Invalid or expired reset token' };
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
      token,
      newPassword
    });
    
    return response.data;
  } catch (error) {
    console.error("Reset password error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message || 'Failed to reset password' };
  }
};
