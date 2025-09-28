import axios from 'axios';
import { getCurrentUser } from './authService';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

function authHeaders() {
  try {
    const stored = getCurrentUser();
    const token = stored?.token || stored?.user?.token || stored?.accessToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

export async function fetchJobs(params = {}) {
  const { page, limit, search } = params;
  const res = await axios.get(`${BASE_URL}/api/jobs`, {
    headers: authHeaders(),
    params: { page, limit, search }
  });
  
  return res.data; // Return jobs array directly based on the API response
}

export async function fetchJobStats() {
  const res = await axios.get(`${BASE_URL}/api/jobs`, {
    headers: authHeaders()
  });
  
  const jobs = res.data || [];
  
  // Calculate job stats
  return {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(job => {
      // Check if job deadline hasn't passed
      const deadlineDate = job.deadline ? new Date(job.deadline) : null;
      return !deadlineDate || deadlineDate > new Date();
    }).length
  };
}