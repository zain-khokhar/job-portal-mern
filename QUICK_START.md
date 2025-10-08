# Multi-Admin Job Portal - Quick Start Guide

## ✅ Implementation Complete!

Your job portal now supports multiple admins/recruiters with full data isolation. Here's what has been implemented:

## 🎯 Key Changes Summary

### Backend Changes

1. **User Model Enhanced**
   - Added `companyName` field (required for admin/recruiter roles)
   - Added JWT token generation method
   - Role-based validation

2. **Job Model Updated**
   - Added `createdBy` field to track job creator
   - Jobs are now linked to the admin who created them

3. **New Authentication Middleware** (`backend/middleware/auth.js`)
   - `verifyToken` - Validates JWT tokens
   - `isAdmin` - Checks admin/recruiter privileges
   - `isUser` - Checks job seeker role

4. **Updated Controllers**
   - **authController**: Removed hardcoded admin credentials, added JWT support
   - **jobController**: Added admin-specific job filtering
   - **jobApplicationController**: Filter applications by job ownership

5. **Updated Routes**
   - All admin routes now require JWT authentication
   - Added `/api/jobs/admin/my-jobs` endpoint for admin's jobs only
   - Authorization checks ensure admins only access their own data

### Frontend Changes

1. **SignUpForm Component**
   - Added role selection (Job Seeker vs Recruiter)
   - Conditional company name field for recruiters
   - Validation for recruiter-specific fields

2. **Authentication Service**
   - Token storage and management
   - Automatic token inclusion in API requests
   - Company name support in registration

3. **API Configuration** (`client/src/services/api.js`)
   - Centralized axios instance with interceptors
   - Automatic token injection in requests
   - Token expiration handling

4. **Admin Dashboard**
   - Updated to fetch only admin's own jobs
   - Job management restricted to owned jobs

## 🚀 How to Start Using the System

### Step 1: Start the Backend
The backend is already running on port 5000!

If you need to restart it:
```bash
cd backend
node server.js
```

### Step 2: Start the Frontend
```bash
cd client
npm run dev
```

### Step 3: Test Multi-Admin Functionality

#### Create First Recruiter Account
1. Navigate to the app (http://localhost:5173)
2. Click "Sign Up"
3. Select "Recruiter" role
4. Fill in details:
   - Name: John Smith
   - Email: john@techcorp.com
   - Company Name: Tech Corp
   - Password: (your choice)
5. Complete registration
6. Sign in with these credentials

#### Post Jobs as First Admin
1. Go to Admin Dashboard
2. Click "Add New Job"
3. Create 2-3 job postings for Tech Corp
4. Note: These jobs are now owned by john@techcorp.com

#### Create Second Recruiter Account
1. Logout
2. Click "Sign Up" again
3. Select "Recruiter" role
4. Fill in details:
   - Name: Sarah Johnson
   - Email: sarah@designstudio.com
   - Company Name: Design Studio
   - Password: (your choice)
5. Complete registration
6. Sign in as Sarah

#### Verify Isolation
1. As Sarah (Design Studio admin):
   - Go to Admin Dashboard
   - Notice: You see NO jobs (empty dashboard)
   - Create 2-3 job postings for Design Studio
   - You only see Design Studio jobs

2. Switch back to John (Tech Corp admin):
   - Logout and login as john@techcorp.com
   - Go to Admin Dashboard
   - You only see Tech Corp jobs (not Design Studio jobs)
   - Try to edit/delete → only works for your jobs

#### Test Job Seeker View
1. Logout
2. Sign up as Job Seeker
3. Browse jobs → You'll see ALL jobs from all companies
4. Apply to jobs from both Tech Corp and Design Studio

#### Test Application Management
1. Login as recruiter (john@techcorp.com)
2. Go to Applications/Dashboard
3. You only see applications for Tech Corp jobs
4. Login as sarah@designstudio.com
5. You only see applications for Design Studio jobs

## 📋 Testing Checklist

- [ ] Create multiple recruiter accounts
- [ ] Each recruiter can post jobs
- [ ] Recruiters only see their own jobs
- [ ] Recruiters can only edit/delete their own jobs
- [ ] Job seekers see all jobs from all recruiters
- [ ] Applications are filtered by job ownership
- [ ] Token authentication works on all protected routes
- [ ] Company name is required for recruiter signup
- [ ] Logout clears authentication properly

## 🔧 Configuration

### Environment Variables

**Backend** (`.env` already created):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/jobportal
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-please
```

**Frontend** (if needed):
```env
VITE_BACKEND_URL=http://localhost:5000
```

## 🎨 User Interface Changes

### Sign Up Form
- Role selection buttons prominently displayed at top
- Company name field appears when "Recruiter" is selected
- Visual feedback for selected role
- Validation ensures company name is provided for recruiters

### Admin Dashboard
- Shows only the logged-in recruiter's jobs
- "My Jobs" section displays job count
- Create/Edit/Delete buttons work only for owned jobs

## 🔐 Security Features

✅ JWT-based authentication
✅ Password hashing with bcrypt (12 salt rounds)
✅ Token expiration (7 days)
✅ Protected API routes
✅ Authorization checks (admins can only access their own data)
✅ Automatic token validation on every request

## 📊 Database Structure

### Users Collection
```javascript
{
  _id: ObjectId,
  name: "John Smith",
  email: "john@techcorp.com",
  password: "hashed_password",
  role: "admin",
  companyName: "Tech Corp",
  isEmailVerified: true,
  createdAt: Date,
  // ... other fields
}
```

### Jobs Collection
```javascript
{
  _id: ObjectId,
  title: "Senior React Developer",
  company: "Tech Corp",
  location: "Remote",
  jobType: "full-time",
  createdBy: ObjectId("user_id"), // Links to Users collection
  // ... other fields
}
```

### Applications Collection
```javascript
{
  _id: ObjectId,
  jobId: ObjectId("job_id"),
  userId: String,
  coverLetter: String,
  resumeUrl: String,
  status: "pending",
  // ... other fields
}
```

## 🐛 Troubleshooting

### MongoDB Connection Error
**Issue:** "MongoDB connection error"
**Solution:** Ensure MongoDB is running:
```bash
# Windows
net start MongoDB

# Or if using MongoDB Compass, it should start automatically
```

### JWT Token Not Working
**Issue:** "No token provided" or "Invalid token"
**Solution:** 
1. Clear browser localStorage
2. Sign in again to get a fresh token
3. Check browser console for token value

### Can't See Any Jobs as Admin
**Issue:** Empty jobs list
**Solution:** This is correct! You'll only see jobs you've created. Create some jobs first.

### Company Name Required Error
**Issue:** Can't sign up as recruiter
**Solution:** Make sure to fill in the company name field (it appears when you select "Recruiter" role)

## 🎯 Next Steps

1. **Test the system** thoroughly with multiple accounts
2. **Customize** the JWT_SECRET in your `.env` file
3. **Configure email service** for email verification (optional)
4. **Add more features**:
   - Dashboard analytics
   - Application status notifications
   - Advanced search filters
   - Company profiles
   - Job applicant tracking

## 📞 Support

If you encounter issues:
1. Check MongoDB is running
2. Check backend console for errors
3. Check browser console for frontend errors
4. Verify .env file exists and has correct values
5. Clear browser cache and localStorage

## 🎉 Success Criteria

Your system is working correctly when:
- ✅ Multiple recruiters can create accounts
- ✅ Each recruiter sees only their own jobs
- ✅ Job seekers see all jobs from all recruiters
- ✅ Applications are properly filtered by job ownership
- ✅ Edit/Delete operations are restricted to job owners
- ✅ JWT tokens are working for authentication

---

**Congratulations!** Your job portal now supports multiple admins with full data isolation. Each recruiter operates independently while job seekers can access all opportunities.

**Status:** ✅ READY FOR TESTING
**Backend:** ✅ Running on port 5000
**Next:** Start the frontend and begin testing!
