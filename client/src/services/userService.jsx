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

export async function fetchUsers(params = {}) {
  const { page, limit, search } = params;
  const res = await axios.get(`${BASE_URL}/api/users`, {
    headers: authHeaders(),
    params: { page, limit, search }
  });
  return res.data; // expected: { success, data }
}

export async function createUser(payload) {
  const res = await axios.post(`${BASE_URL}/api/admin/users`, payload, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() }
  });
  return res.data; // expected: { success, user }
}

export async function updateUser(id, payload) {
  const res = await axios.put(`${BASE_URL}/api/users/${id}`, payload, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() }
  });
  return res.data; // expected: { success, data }
}

export async function deleteUser(id) {
  const res = await axios.delete(`${BASE_URL}/api/users/${id}`, {
    headers: authHeaders()
  });
  return res.data; // expected: { success }
}

export async function toggleUserStatus(id) {
  const res = await axios.patch(`${BASE_URL}/api/admin/users/${id}/status`, {}, {
    headers: authHeaders()
  });
  return res.data; // expected: { success, user }
}