import React, { useContext } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Applications from "./pages/Applications";
import Profile from "./pages/Profile";
import AuthModal from "./components/AuthModal";
import StatusNotification from "./components/StatusNotification";
import LandingPage from "./pages/LandingPage";
import { AppContext } from "./context/AppContext";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminManageJobs from "./pages/admin/ManageJobs";
import AdminManageUsers from "./pages/admin/ManageUsers";
import AdminProfile from "./pages/admin/AdminProfile";
import "quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { showAuthModal, setShowAuthModal, setCurrentUser, currentUser } = useContext(AppContext);
  const [authMode, setAuthMode] = React.useState("Sign Up");
  const navigate = useNavigate();

  // Simple authentication check
  const isAuthenticated = () => {
    return currentUser !== null && currentUser !== undefined && currentUser.email;
  };

  const handleLogin = (userData) => {
    console.log('handleLogin called with userData:', userData);
    
    // Add null checks before setting user data
    if (userData) {
      console.log('User logged in:', userData);
      
      // Ensure we have at least basic user structure
      const userToSet = { 
        ...userData,
        role: userData.role || 'user', // Default role if missing
        name: userData.name || userData.email?.split('@')[0] || 'User',
        email: userData.email || ''
      };
      
      console.log('Setting currentUser to:', userToSet);
      setCurrentUser(userToSet);
      
      // Close auth modal and redirect based on role
      setShowAuthModal(false);
      
      if (userToSet.role === 'admin') {
        console.log('Admin user logged in, redirecting to admin dashboard');
        // Set admin session for AdminLayout
        sessionStorage.setItem('adminAuth', 'admin-authenticated');
        sessionStorage.setItem('adminUser', JSON.stringify(userToSet));
        // Add axios default header for admin requests
        import('axios').then(axios => {
          axios.default.defaults.headers.common['x-admin-auth'] = 'admin-authenticated';
        });
        window.location.href = '/admin'; // Force full page reload to ensure admin context
      } else {
        navigate('/');
      }
    } else {
      console.error('handleLogin called with undefined userData');
    }
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    setAuthMode("Sign Up"); // Reset to default
  };

  // Auto-open auth modal removed to prevent showing on every refresh

  // If user is not authenticated, show the landing page
  if (!isAuthenticated()) {
    return (
      <div>
        <LandingPage 
          onLogin={handleLogin}
          authMode={authMode}
          setAuthMode={setAuthMode}
          showAuthModal={showAuthModal}
          setShowAuthModal={setShowAuthModal}
          handleAuthModalClose={handleAuthModalClose}
        />
        <ToastContainer />
      </div>
    );
  }

  // Authenticated users can access all routes
  return (
    <div>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleAuthModalClose}
        onLogin={handleLogin}
        initialMode={authMode}
        canClose={true} // Allow closing when already authenticated
      />
      <StatusNotification />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<div style={{padding:'2rem'}}>Job detail page is being rebuilt. Please check back soon.</div>} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="jobs" element={<AdminManageJobs />} />
          <Route path="users" element={<AdminManageUsers />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
