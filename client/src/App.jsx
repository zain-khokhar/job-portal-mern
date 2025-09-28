import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Applications from "./pages/Applications";
import ApplyJob from "./pages/ApplyJob";
import RecruiterLogin from "./components/RecruiterLogin";
import AuthModal from "./components/AuthModal";
import { AppContext } from "./context/AppContext";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import ManageJobs from "./pages/ManageJobs";
import ViewApplications from "./pages/ViewApplications";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminManageJobs from "./pages/admin/ManageJobs";
import AdminManageUsers from "./pages/admin/ManageUsers";
import "quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { showRecruiterLogin, companyToken, showAuthModal, setShowAuthModal, setCurrentUser } = useContext(AppContext);
  const [authMode, setAuthMode] = React.useState("Sign Up");

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

  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleAuthModalClose}
        onLogin={handleLogin}
        initialMode={authMode}
      />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/recruiter-login" element={<RecruiterLogin />} />
        <Route path="/applications" element={<Applications />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="jobs" element={<AdminManageJobs />} />
          <Route path="users" element={<AdminManageUsers />} />
        </Route>

        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="add-job" element={<AddJob />} />
          <Route path="manage-job" element={<ManageJobs />} />
          <Route path="view-applications" element={<ViewApplications />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
