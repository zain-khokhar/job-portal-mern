import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Applications from "./pages/Applications";
import AuthModal from "./components/AuthModal";
import LandingPage from "./pages/LandingPage";
import { AppContext } from "./context/AppContext";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminManageJobs from "./pages/admin/ManageJobs";
import AdminManageUsers from "./pages/admin/ManageUsers";
import "quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { showAuthModal, setShowAuthModal, setCurrentUser, currentUser } = useContext(AppContext);
  const [authMode, setAuthMode] = React.useState("Sign Up");

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
      
      // Force a re-render by logging after state update
      setTimeout(() => {
        console.log('Current user after state update should be:', userToSet);
      }, 100);
      
      // Optional: redirect based on role
      if (userToSet.role === 'admin') {
        console.log('Admin user logged in:', userToSet);
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
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<div style={{padding:'2rem'}}>Job detail page is being rebuilt. Please check back soon.</div>} />
        <Route path="/applications" element={<Applications />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="jobs" element={<AdminManageJobs />} />
          <Route path="users" element={<AdminManageUsers />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
