# Admin Dashboard Hardcoded Credentials Fix

## Summary
Fixed all remaining hardcoded admin authentication logic to use the new JWT-based multi-admin system.

## Changes Made

### 1. AdminDashboard.jsx - Complete Rewrite
**File:** `client/src/pages/admin/AdminDashboard.jsx`

**Changes:**
- ✅ Removed all hardcoded credentials logic
- ✅ Removed sessionStorage authentication checks
- ✅ Removed Users section (no super admin concept)
- ✅ Removed `totalUsers` and `recentUsers` stats
- ✅ Now uses JWT-authenticated API calls via `api.js`
- ✅ Fetches admin's jobs only using `fetchAdminJobs()`
- ✅ Fetches applications for admin's jobs using `/api/applications/`
- ✅ Stats now show: Total Jobs, Active Jobs, Total Applications, Pending Applications
- ✅ Displays recent jobs table (last 5 jobs posted by admin)
- ✅ Displays applications table with Accept/Reject actions
- ✅ All API calls automatically include JWT token from localStorage

**New Stats Displayed:**
- **Total Jobs**: Count of all jobs posted by this admin
- **Active Jobs**: Jobs where deadline hasn't passed yet
- **Total Applications**: All applications for admin's jobs
- **Pending Applications**: Applications with 'pending' status

**Tables:**
1. **Your Recent Jobs** - Shows last 5 jobs posted by admin
   - Columns: Job Title, Location, Type, Deadline
   
2. **Recent Applications** - Shows all applications for admin's jobs
   - Columns: Applicant Email, Job Title, Company, Resume (view link), Status, Actions
   - Actions: Accept (green checkmark), Reject (red X)

**API Endpoints Used:**
- `GET /api/jobs/admin` - Fetch admin's jobs
- `GET /api/applications/` - Fetch applications for admin's jobs
- `PUT /api/applications/accept/:id` - Accept application
- `DELETE /api/applications/reject/:id` - Reject application

### 2. AdminLogin.jsx - Converted to Redirect
**File:** `client/src/pages/admin/AdminLogin.jsx`

**Changes:**
- ✅ Removed all hardcoded admin-signin logic
- ✅ Removed sessionStorage usage
- ✅ Removed POST to `/api/auth/admin-signin` endpoint (which no longer exists)
- ✅ Now simply redirects to home page (`/`)
- ✅ Added comment explaining admins use regular login flow

**Why This Change:**
Admins now register and sign in through the regular authentication flow on the home page, selecting "Recruiter" role during registration. There's no separate admin login page needed.

### 3. AdminLayout.jsx - Already Updated (Previous Session)
**File:** `client/src/pages/admin/AdminLayout.jsx`

**Previous Changes Applied:**
- ✅ Removed AdminLogin component import
- ✅ Changed auth check from sessionStorage to `getCurrentUser()` with JWT
- ✅ Removed Users navigation item
- ✅ Added company name display in header
- ✅ Uses localStorage JWT token for authentication

## Authentication Flow

### Old System (Hardcoded):
1. Admin goes to `/admin` route
2. Sees AdminLogin component
3. Enters hardcoded credentials (email/password)
4. POST to `/api/auth/admin-signin`
5. Sets `sessionStorage.adminAuth` and `sessionStorage.adminUser`
6. Uses custom `x-admin-auth` header for requests

### New System (JWT Multi-Admin):
1. User registers on home page, selects "Recruiter" role, provides company name
2. Backend creates User with role='admin', stores company name
3. User signs in on home page with email/password
4. Backend returns JWT token (7-day expiration)
5. Frontend stores token in `localStorage.authToken`
6. All API requests automatically include `Authorization: Bearer <token>` header
7. Admin navigates to `/admin` routes
8. AdminLayout checks for valid JWT token and admin role
9. Admin can only see/manage their own jobs and applications

## Backend API Endpoints

### Admin-Specific Endpoints:
- `GET /api/jobs/admin` - Get jobs created by authenticated admin
- `GET /api/applications/` - Get applications for jobs created by authenticated admin
- `PUT /api/applications/accept/:id` - Accept an application (checks job ownership)
- `DELETE /api/applications/reject/:id` - Reject an application (checks job ownership)
- `POST /api/jobs` - Create new job (automatically sets createdBy to admin's ID)
- `PUT /api/jobs/:id` - Update job (validates ownership)
- `DELETE /api/jobs/:id` - Delete job (validates ownership)

### Removed Endpoints:
- ❌ `POST /api/auth/admin-signin` - No longer needed, use regular `/api/auth/signin`

## Testing Checklist

### Registration:
- [ ] Go to home page
- [ ] Click Sign Up
- [ ] Select "Recruiter" role
- [ ] Fill in name, email, password, company name
- [ ] Submit registration
- [ ] Verify user is created with role='admin'

### Login:
- [ ] Go to home page
- [ ] Click Sign In
- [ ] Enter registered email and password
- [ ] Submit login
- [ ] Verify JWT token is stored in localStorage
- [ ] Verify successful login

### Admin Dashboard Access:
- [ ] After login, navigate to `/admin`
- [ ] Verify AdminLayout checks for JWT token
- [ ] Verify dashboard loads without errors
- [ ] Verify stats display correctly (all zeros if no jobs/applications yet)

### Create Job:
- [ ] Navigate to `/admin/jobs`
- [ ] Click "Create Job" or similar button
- [ ] Fill in job details
- [ ] Submit job creation
- [ ] Verify job is created with `createdBy` field set to admin's ID
- [ ] Verify job appears in dashboard stats and recent jobs table

### View Applications:
- [ ] Have a job seeker apply to one of your jobs
- [ ] Navigate to `/admin` dashboard
- [ ] Verify application appears in "Recent Applications" table
- [ ] Verify stats update (Total Applications, Pending Applications)

### Accept/Reject Applications:
- [ ] Click green checkmark to accept an application
- [ ] Verify status changes to "Accepted"
- [ ] Verify Pending Applications count decreases
- [ ] Click red X to reject an application
- [ ] Confirm rejection in popup
- [ ] Verify application is removed from list
- [ ] Verify Total Applications count decreases

### Multi-Admin Isolation:
- [ ] Register a second admin account with different email
- [ ] Login as second admin
- [ ] Navigate to `/admin` dashboard
- [ ] Verify second admin sees NO jobs from first admin
- [ ] Create a job as second admin
- [ ] Verify first admin cannot see second admin's job
- [ ] Have job seekers apply to both admins' jobs
- [ ] Verify each admin only sees applications for their own jobs

### Logout:
- [ ] Click logout button in AdminLayout header
- [ ] Verify token is removed from localStorage
- [ ] Verify redirect to home page
- [ ] Try accessing `/admin` routes after logout
- [ ] Verify redirect to home page (unauthorized)

## Files Modified

### Created/Replaced:
1. `client/src/pages/admin/AdminDashboard.jsx` - Complete rewrite
2. `client/src/pages/admin/AdminLogin.jsx` - Converted to redirect component

### Backup Files:
- `client/src/pages/admin/AdminDashboard_backup.jsx` - Original file with hardcoded logic
- `client/src/pages/admin/AdminLogin_backup.jsx` - Original file with hardcoded signin

## Important Notes

1. **No Super Admin**: The system no longer has a concept of "super admin" who can see all users/jobs. Each admin is independent and can only manage their own jobs and applications.

2. **Company Name**: Admins/recruiters must provide a company name during registration. This is displayed in their profile and helps identify them.

3. **JWT Token Security**:
   - Tokens expire after 7 days
   - Tokens are validated on every API request
   - Tokens are stored in localStorage (persists across browser sessions)
   - Tokens are automatically included in all API requests via axios interceptor

4. **Role Names**: The backend supports both 'admin' and 'Admin' role names (case-insensitive). Frontend displays "Recruiter" during registration but backend stores as 'admin'.

5. **Resume Viewing**: Application resumes are viewable by clicking the "View" link in the applications table. The backend URL is automatically prepended to resume paths.

## Next Steps

1. **Test the complete flow** using the checklist above
2. **Remove old backup files** if new implementation works correctly:
   - `AdminDashboard_backup.jsx`
   - `AdminLogin_backup.jsx`
3. **Remove ManageUsers route** from App.jsx if it exists (since no super admin)
4. **Update documentation** if any other files reference the old admin authentication system

## Troubleshooting

### Issue: "Invalid credentials" error
**Cause**: Trying to use old admin login endpoint
**Solution**: Ensure using regular signin at home page, not `/admin` route

### Issue: Dashboard shows "Loading..." forever
**Cause**: JWT token missing or invalid
**Solution**: Logout and login again, check localStorage for `authToken`

### Issue: Can't see any jobs/applications
**Cause**: No jobs created yet, or viewing as wrong admin
**Solution**: Create a test job, have a job seeker apply to it

### Issue: 401 Unauthorized on API calls
**Cause**: JWT token expired or invalid
**Solution**: Login again to get fresh token

### Issue: Other admin's jobs visible
**Cause**: Backend createdBy field not set correctly
**Solution**: Check jobController.js createJob function sets req.user._id

## API Response Examples

### GET /api/jobs/admin
```json
{
  "success": true,
  "jobs": [
    {
      "_id": "65abc123...",
      "title": "Frontend Developer",
      "company": "Tech Corp",
      "location": "New York",
      "jobType": "Full-time",
      "deadline": "2024-12-31T23:59:59.999Z",
      "createdBy": "65abc456..." // Admin's user ID
    }
  ]
}
```

### GET /api/applications/
```json
{
  "success": true,
  "applications": [
    {
      "_id": "65abc789...",
      "userId": "applicant@example.com",
      "jobId": {
        "_id": "65abc123...",
        "title": "Frontend Developer",
        "company": "Tech Corp"
      },
      "resumeUrl": "uploads/resumes/1234567890.pdf",
      "status": "pending"
    }
  ]
}
```

### PUT /api/applications/accept/:id
```json
{
  "success": true,
  "message": "Application accepted successfully",
  "application": {
    "_id": "65abc789...",
    "status": "accepted"
  }
}
```

## Conclusion

All hardcoded admin authentication logic has been removed. The system now uses a proper JWT-based multi-admin system where:
- Each admin registers and signs in through the regular auth flow
- Each admin can only see and manage their own jobs
- Each admin can only see and manage applications for their own jobs
- No super admin or users list exists
- All API calls are authenticated with JWT tokens
- Proper ownership validation is enforced on the backend

The implementation is now at a professional level with secure authentication, proper data isolation, and clean code structure.
