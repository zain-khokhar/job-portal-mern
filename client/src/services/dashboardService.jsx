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
    
    // Debug user statuses to verify our active users calculation
    console.log('User statuses:', users.map(user => ({
      id: user._id,
      name: user.name,
      status: user.status,
      isActive: user.isActive
    })));

    // Calculate stats
    // Count active users correctly - users are active if:
    // 1. Their status is 'Active' or not set (defaults to active)
    // 2. Their status is NOT 'Suspended'
    // 3. Their isActive property is true or not set
    const activeUsers = users.filter(user => {
      // If status is explicitly set to 'Suspended', user is not active
      if (user.status === 'Suspended') return false;
      
      // If isActive is explicitly set to false, user is not active
      if (user.isActive === false) return false;
      
      // Otherwise consider the user active
      return true;
    }).length;
    
    const dashboardData = {
      stats: {
        totalJobs: jobs.length,
        activeJobs: activeUsers, // Use the correctly calculated active users count
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