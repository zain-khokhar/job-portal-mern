import React from 'react';
import { FiUsers, FiBriefcase, FiFileText, FiUserCheck } from 'react-icons/fi';
import { Card } from '../../components/admin/common/FormComponents';
import { Table } from '../../components/admin/common/TableComponents';
import adminData from '../../data/adminData';

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
  const jobColumns = [
    { key: 'title', header: 'Job Title' },
    { key: 'company', header: 'Company' },
    { key: 'location', header: 'Location' },
    { key: 'type', header: 'Type' },
    { 
      key: 'applications', 
      header: 'Applications',
      render: (row) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {row.applications}
        </span>
      )
    }
  ];

  const userColumns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    { key: 'joinDate', header: 'Join Date' }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Jobs"
          value={adminData.stats.totalJobs}
          icon={FiBriefcase}
          color="text-blue-600"
        />
        <StatCard
          title="Active Jobs"
          value={adminData.stats.activeJobs}
          icon={FiFileText}
          color="text-green-600"
        />
        <StatCard
          title="Total Applications"
          value={adminData.stats.totalApplications}
          icon={FiUserCheck}
          color="text-purple-600"
        />
        <StatCard
          title="Total Users"
          value={adminData.stats.totalUsers}
          icon={FiUsers}
          color="text-orange-600"
        />
      </div>

      {/* Recent Jobs */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Jobs</h2>
        <Card>
          <Table
            columns={jobColumns}
            data={adminData.recentJobs}
            onRowClick={(job) => console.log('Job clicked:', job)}
          />
        </Card>
      </div>

      {/* Recent Users */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Users</h2>
        <Card>
          <Table
            columns={userColumns}
            data={adminData.users}
            onRowClick={(user) => console.log('User clicked:', user)}
          />
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
