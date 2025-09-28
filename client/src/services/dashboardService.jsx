import { fetchUsers } from './userService';
import { fetchJobs } from './jobService';

export async function fetchDashboardData() {
  try {
    // Fetch all users and jobs in parallel
    const [usersResponse, jobsResponse] = await Promise.all([
      fetchUsers(),
      fetchJobs()
    ]);

    // Check both responses for the expected format
    console.log('User response:', usersResponse);
    console.log('Job response:', jobsResponse);
    
    const users = usersResponse.data || [];
    const jobs = Array.isArray(jobsResponse) ? jobsResponse : [];

    // Calculate stats
    const dashboardData = {
      stats: {
        totalJobs: jobs.length,
        activeJobs: users.filter(user => user.status === 'Active' || user.isActive === true).length, // Count users that are active
        totalApplications: 0, // Not implemented yet
        totalUsers: users.length
      },
      recentJobs: jobs.slice(0, 5).map(job => ({
        ...job,
        applications: job.applications || 0, // Default to 0 if not available
        type: job.jobType || 'N/A'
      })),
      recentUsers: users.slice(0, 5)
    };

    return dashboardData;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}