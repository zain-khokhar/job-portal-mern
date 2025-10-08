import React, { useState, useEffect } from 'react';
import { FiBriefcase, FiFileText, FiCheckCircle, FiXCircle, FiFileText as FiResume, FiClock } from 'react-icons/fi';
import { Card } from '../../components/common/FormComponents';
import { Table } from '../../components/common/TableComponents';
import { fetchAdminJobs } from '../../services/jobService';
import api from '../../services/api';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card>
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color} bg-opacity-10 mr-4`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  </Card>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationsError, setApplicationsError] = useState(null);
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // Fetch admin's jobs and calculate stats
  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true);
        const jobs = await fetchAdminJobs();
        
        const totalJobs = jobs.length;
        const activeJobs = jobs.filter(job => {
          const deadlineDate = job.deadline ? new Date(job.deadline) : null;
          return !deadlineDate || deadlineDate > new Date();
        }).length;
        
        setRecentJobs(jobs.slice(0, 5));
        setStats(prev => ({
          ...prev,
          totalJobs,
          activeJobs
        }));
        
        setError(null);
      } catch (err) {
        console.error('Failed to load admin data:', err);
        setError('Failed to load dashboard data.');
        setRecentJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  // Fetch job applications for admin's jobs
  useEffect(() => {
    const fetchJobApplications = async () => {
      try {
        setApplicationsLoading(true);
        const response = await api.get('/api/applications/');
        
        if (response.data.success) {
          const applications = response.data.applications;
          setJobApplications(applications);
          
          setStats(prev => ({
            ...prev,
            totalApplications: applications.length,
            pendingApplications: applications.filter(app => app.status === 'pending').length
          }));
          
          setApplicationsError(null);
        }
      } catch (err) {
        console.error('Failed to load job applications:', err);
        setApplicationsError('Failed to load applications data.');
        setJobApplications([]);
      } finally {
        setApplicationsLoading(false);
      }
    };

    fetchJobApplications();
  }, []);

  const handleAcceptApplication = async (applicationId) => {
    try {
      const response = await api.put(`/api/applications/accept/${applicationId}`);
      
      if (response.data.success) {
        const updatedApplications = jobApplications.map(app => 
          app._id === applicationId ? { ...app, status: 'accepted' } : app
        );
        
        setJobApplications(updatedApplications);
        setStats(prev => ({
          ...prev,
          pendingApplications: prev.pendingApplications - 1
        }));
        
        alert('Application accepted successfully!');
      }
    } catch (error) {
      console.error('Error accepting application:', error);
      alert(error.response?.data?.message || 'Failed to accept application');
    }
  };

  const handleRejectApplication = async (applicationId) => {
    if (!window.confirm('Are you sure you want to reject this application?')) {
      return;
    }

    try {
      await api.delete(`/api/applications/reject/${applicationId}`);
      
      const updatedApplications = jobApplications.filter(app => app._id !== applicationId);
      setJobApplications(updatedApplications);
      
      setStats(prev => ({
        ...prev,
        totalApplications: prev.totalApplications - 1,
        pendingApplications: prev.pendingApplications - 1
      }));
      
      alert('Application rejected successfully!');
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert(error.response?.data?.message || 'Failed to reject application');
    }
  };

  const jobColumns = [
    { 
      key: 'title', 
      header: 'Job Title',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.title}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{row.company}</div>
        </div>
      )
    },
    { 
      key: 'location', 
      header: 'Location',
      render: (row) => <span className="text-gray-900 dark:text-white">{row.location}</span>
    },
    { 
      key: 'jobType', 
      header: 'Type',
      render: (row) => <span className="text-gray-900 dark:text-white">{row.jobType}</span>
    },
    {
      key: 'deadline',
      header: 'Deadline',
      render: (row) => (
        <span className="text-gray-900 dark:text-white">
          {row.deadline ? new Date(row.deadline).toLocaleDateString() : 'N/A'}
        </span>
      )
    }
  ];

  const applicationColumns = [
    { 
      key: 'userId', 
      header: 'Applicant Email',
      render: (row) => (
        <span className="text-gray-900 dark:text-white">{row.userId || 'Unknown'}</span>
      )
    },
    { 
      key: 'jobTitle', 
      header: 'Job Title',
      render: (row) => <span className="text-gray-900 dark:text-white">{row.jobId?.title || 'Unknown'}</span>
    },
    { 
      key: 'company', 
      header: 'Company',
      render: (row) => <span className="text-gray-900 dark:text-white">{row.jobId?.company || 'Unknown'}</span>
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
        >
          <FiResume className="mr-1" />
          View
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
        <div className="flex space-x-2">
          <button 
            className={`p-1 ${row.status === 'accepted' ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:text-green-900'}`}
            title="Accept Application"
            disabled={row.status === 'accepted'}
            onClick={() => row.status !== 'accepted' && handleAcceptApplication(row._id)}
          >
            <FiCheckCircle className="w-5 h-5" />
          </button>
          <button 
            className="p-1 text-red-600 hover:text-red-900"
            title="Reject Application"
            onClick={() => handleRejectApplication(row._id)}
          >
            <FiXCircle className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  if (loading || applicationsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome to your admin dashboard. Manage your jobs and applications.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Jobs" 
          value={stats.totalJobs} 
          icon={FiBriefcase} 
          color="text-blue-600" 
        />
        <StatCard 
          title="Active Jobs" 
          value={stats.activeJobs} 
          icon={FiClock} 
          color="text-green-600" 
        />
        <StatCard 
          title="Total Applications" 
          value={stats.totalApplications} 
          icon={FiFileText} 
          color="text-purple-600" 
        />
        <StatCard 
          title="Pending Applications" 
          value={stats.pendingApplications} 
          icon={FiClock} 
          color="text-yellow-600" 
        />
      </div>

      {/* Recent Jobs */}
      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Recent Jobs</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Jobs you've posted recently</p>
        </div>
        {error ? (
          <div className="text-red-600 dark:text-red-400">{error}</div>
        ) : recentJobs.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 text-center py-8">
            You haven't posted any jobs yet. Go to Jobs section to create your first job posting.
          </div>
        ) : (
          <Table columns={jobColumns} data={recentJobs} />
        )}
      </Card>

      {/* Job Applications */}
      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Applications</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Applications received for your job postings</p>
        </div>
        {applicationsError ? (
          <div className="text-red-600 dark:text-red-400">{applicationsError}</div>
        ) : jobApplications.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 text-center py-8">
            No applications received yet.
          </div>
        ) : (
          <Table columns={applicationColumns} data={jobApplications} />
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;
