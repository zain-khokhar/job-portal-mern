import React, { useState, useEffect } from 'react';
import { FiUsers, FiBriefcase, FiFileText, FiUserCheck, FiAlertCircle, FiCheckCircle, FiXCircle, FiFileText as FiResume } from 'react-icons/fi';
import { Card } from '../../components/admin/common/FormComponents';
import { Table } from '../../components/admin/common/TableComponents';
import { fetchDashboardData } from '../../services/dashboardService';
import adminData from '../../data/adminData'; // Kept as fallback
import axios from 'axios';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card>
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color} bg-opacity-10 mr-4`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </Card>
);

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalJobs: 0,
      activeJobs: 0, // This will be active users count
      totalApplications: 0,
      totalUsers: 0
    },
    recentJobs: [], // Changed back to recentJobs to match API response
    recentUsers: []
  });
  const [jobApplications, setJobApplications] = useState([]); // New state for job applications
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationsError, setApplicationsError] = useState(null);
  
  // Get backend URL from environment or default
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // Fetch dashboard data
  // Fetch dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Failed to load dashboard data. Using sample data instead.');
        // Fallback to static data
        setDashboardData({
          stats: adminData.stats,
          recentJobs: adminData.recentJobs, // Keep using recentJobs to match API response
          recentUsers: adminData.users
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Fetch job applications
  useEffect(() => {
    const fetchJobApplications = async () => {
      try {
        setApplicationsLoading(true);
        const response = await axios.get(`${backendUrl}/api/applications/`);
        
        if (response.data.success) {
          // The applications come with populated jobId objects
          console.log("Applications data:", response.data.applications);
          
          // Clean up the applications data
          const cleanedApplications = response.data.applications.map(app => {
            // If userId is missing or undefined, set it to "Email Not Provided"
            if (!app.userId || app.userId === 'undefined' || app.userId === 'null') {
              return {
                ...app,
                userId: "Email Not Provided"
              };
            }
            return app;
          });
          
          setJobApplications(cleanedApplications);
          // Update total applications count in dashboardData
          setDashboardData(prev => ({
            ...prev,
            stats: {
              ...prev.stats,
              totalApplications: cleanedApplications.length
            }
          }));
        } else {
          throw new Error(response.data.message || 'Failed to fetch applications');
        }
      } catch (err) {
        console.error('Failed to load job applications:', err);
        setApplicationsError('Failed to load job applications data.');
        // Don't set any fallback data here to avoid showing fake applications
      } finally {
        setApplicationsLoading(false);
      }
    };

    fetchJobApplications();
  }, [backendUrl]);

  const applicationColumns = [
    { 
      key: 'userId', 
      header: 'Applicant Email',
      render: (row) => {
        // Debug log to see what's in the row
        console.log("Application row userId:", row.userId, "type:", typeof row.userId);
        
        // The userId field contains the email
        if (!row.userId || row.userId === 'undefined' || row.userId === null) {
          return 'Unknown';
        }
        return row.userId;
      }
    },
    { 
      key: 'jobTitle', 
      header: 'Job Title',
      render: (row) => row.jobId?.title || 'Unknown'
    },
    { 
      key: 'company', 
      header: 'Company',
      render: (row) => row.jobId?.company || 'Unknown'
    },
    { 
      key: 'jobType', 
      header: 'Job Type',
      render: (row) => row.jobId?.jobType || 'N/A' 
    },
    { 
      key: 'resumeUrl', 
      header: 'Resume',
      render: (row) => (
        <a 
          href={row.resumeUrl.startsWith('http') ? row.resumeUrl : `${backendUrl}/${row.resumeUrl}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
          onClick={(e) => e.stopPropagation()}
        >
          <FiResume className="mr-1" />
          View Resume
        </a>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const statusColors = {
          pending: 'bg-yellow-100 text-yellow-800',
          accepted: 'bg-green-100 text-green-800',
          rejected: 'bg-red-100 text-red-800'
        };
        
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[row.status] || 'bg-gray-100 text-gray-800'}`}>
            {row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : 'Unknown'}
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
          <button 
            className="p-1 text-green-600 hover:text-green-900 focus:outline-none"
            title="Accept Application"
            disabled={row.status === 'accepted'}
          >
            <FiCheckCircle className="w-5 h-5" />
          </button>
          <button 
            className="p-1 text-red-600 hover:text-red-900 focus:outline-none"
            title="Reject Application"
            disabled={row.status === 'rejected'}
          >
            <FiXCircle className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  const userColumns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { 
      key: 'role', 
      header: 'Role',
      render: (row) => row.role || 'User'
    },
    { 
      key: 'joinDate', 
      header: 'Join Date',
      render: (row) => {
        const date = row.joinDate || row.createdAt;
        if (!date) return 'N/A';
        try {
          return new Date(date).toLocaleDateString();
        } catch (err) {
          return 'Invalid Date';
        }
      }
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard Overview</h1>
      
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Jobs"
              value={dashboardData.stats.totalJobs}
              icon={FiBriefcase}
              color="text-blue-600"
            />
            <StatCard
              title="Active Users"
              value={dashboardData.stats.activeJobs}
              icon={FiUserCheck}
              color="text-green-600"
            />
            <StatCard
              title="Total Applications"
              value={dashboardData.stats.totalApplications}
              icon={FiUserCheck}
              color="text-purple-600"
            />
            <StatCard
              title="Total Users"
              value={dashboardData.stats.totalUsers}
              icon={FiUsers}
              color="text-orange-600"
            />
          </div>

          {/* Job Applications */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Job Applications</h2>
            <Card>
              {applicationsLoading ? (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600 mb-2"></div>
                  <p className="text-gray-500">Loading applications...</p>
                </div>
              ) : applicationsError ? (
                <div className="text-center py-10 text-red-500">
                  <FiAlertCircle className="h-5 w-5 mx-auto mb-2" />
                  {applicationsError}
                </div>
              ) : jobApplications.length > 0 ? (
                <Table
                  columns={applicationColumns}
                  data={jobApplications.map(app => {
                    // Log each application for debugging
                    console.log("Processing application:", app);
                    return app;
                  })}
                  onRowClick={(application) => console.log('Application clicked:', application)}
                />
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No job applications found
                </div>
              )}
            </Card>
          </div>

          {/* Recent Users */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Users</h2>
            <Card>
              {dashboardData.recentUsers.length > 0 ? (
                <Table
                  columns={userColumns}
                  data={dashboardData.recentUsers}
                  onRowClick={(user) => console.log('User clicked:', user)}
                />
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No users found
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
