import React, { useState, useEffect } from 'react';
import { FiUsers, FiBriefcase, FiFileText, FiUserCheck, FiAlertCircle } from 'react-icons/fi';
import { Card } from '../../components/admin/common/FormComponents';
import { Table } from '../../components/admin/common/TableComponents';
import { fetchDashboardData } from '../../services/dashboardService';
import adminData from '../../data/adminData'; // Kept as fallback

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
    recentJobs: [],
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          recentJobs: adminData.recentJobs,
          recentUsers: adminData.users
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const jobColumns = [
    { key: 'title', header: 'Job Title' },
    { key: 'company', header: 'Company' },
    { key: 'location', header: 'Location' },
    { key: 'type', header: 'Type', render: (row) => row.jobType || row.type || 'N/A' },
    { 
      key: 'applications', 
      header: 'Applications',
      render: (row) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {row.applications || 0}
        </span>
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

          {/* Recent Jobs */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Jobs</h2>
            <Card>
              {dashboardData.recentJobs.length > 0 ? (
                <Table
                  columns={jobColumns}
                  data={dashboardData.recentJobs}
                  onRowClick={(job) => console.log('Job clicked:', job)}
                />
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No jobs found
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
