# Multi-Admin System Implementation

## Overview
This job portal now supports multiple admins/recruiters. Each admin can create their own account, post jobs, and manage applications for their posted jobs independently.

## Key Features Implemented

### 1. **Multi-Admin Support**
- ✅ Removed hardcoded single admin credentials
- ✅ Any user can sign up as either a **Job Seeker** or **Recruiter** (Admin)
- ✅ JWT-based authentication for secure API access
- ✅ Each admin has their own isolated workspace

### 2. **Role-Based Access Control**
- **Job Seekers** can:
  - Browse all jobs from all companies
  - Apply to jobs
  - View their own applications
  
- **Recruiters/Admins** can:
  - Create, edit, and delete their own job postings
  - View only applications for their posted jobs
  - Manage (accept/reject) applications for their jobs
  - Cannot see or modify jobs posted by other recruiters

### 3. **Database Schema Updates**

#### User Model (`backend/models/User.js`)
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String, // 'user', 'admin', 'Job Seeker', 'Recruiter', 'Admin'
  companyName: String, // Required for admin/recruiter roles
  isEmailVerified: Boolean,
  // ... other fields
}
```

#### Job Model (`backend/models/newJobs.js`)
```javascript
{
  title: String,
  company: String,
  location: String,
  jobType: String,
  // ... other fields
  createdBy: ObjectId, // References User model - tracks which admin created the job
  createdAt: Date
}
```

### 4. **Authentication System**

#### JWT Token Authentication
- All authenticated routes now require JWT tokens
- Tokens are generated during signup/signin
- Tokens stored in localStorage and sent with every API request
- Automatic token validation on protected routes

#### Middleware (`backend/middleware/auth.js`)
- `verifyToken`: Validates JWT tokens
- `isAdmin`: Checks if user has admin/recruiter privileges
- `isUser`: Checks if user is a job seeker

### 5. **API Endpoints Updated**

#### Authentication Routes (`/api/auth`)
- `POST /signup` - Register as job seeker or recruiter (requires companyName for recruiters)
- `POST /signin` - Login for all users (returns JWT token)
- Email verification and password reset endpoints remain unchanged

#### Job Routes (`/api/jobs`)
**Public Routes:**
- `GET /api/jobs` - Get all jobs (for job seekers)
- `GET /api/jobs/:id` - Get single job details

**Protected Admin Routes:**
- `POST /api/jobs` - Create new job (admin only, associates job with logged-in admin)
- `GET /api/jobs/admin/my-jobs` - Get only the logged-in admin's jobs
- `PUT /api/jobs/:id` - Update job (admin can only update their own jobs)
- `DELETE /api/jobs/:id` - Delete job (admin can only delete their own jobs)

#### Application Routes (`/api/applications`)
**Public Routes:**
- `POST /api/applications/submit` - Submit job application
- `GET /api/applications/user/:userId` - Get user's applications

**Protected Admin Routes:**
- `GET /api/applications` - Get applications for admin's jobs only
- `GET /api/applications/job/:jobId` - Get applications for a specific job (only if admin owns that job)
- `PUT /api/applications/accept/:id` - Accept application (only for admin's jobs)
- `DELETE /api/applications/reject/:id` - Reject application (only for admin's jobs)

### 6. **Frontend Updates**

#### Sign Up Form
- Added role selection (Job Seeker vs Recruiter)
- Conditional company name field (shown only for recruiters)
- Company name validation for recruiter signups

#### Authentication Flow
- Token automatically stored in localStorage on signup/signin
- Token included in all API requests via axios interceptor
- Automatic redirect based on role after login

#### Admin Dashboard
- Displays only the logged-in admin's jobs
- Job management (create, edit, delete) restricted to own jobs
- Application management filtered by admin's jobs

### 7. **Security Enhancements**
- ✅ Passwords hashed with bcrypt (12 salt rounds)
- ✅ JWT tokens with 7-day expiration
- ✅ Protected routes require valid authentication
- ✅ Authorization checks ensure admins can only access their own data
- ✅ Automatic token expiration handling

## Installation & Setup

### Backend Setup

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Environment Variables**
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
# Email service variables (if using email verification)
```

3. **Start Backend Server**
```bash
npm start
```

### Frontend Setup

1. **Install Dependencies**
```bash
cd client
npm install
```

2. **Environment Variables**
Create a `.env` file in the client directory (if needed):
```env
VITE_BACKEND_URL=http://localhost:5000
```

3. **Start Frontend**
```bash
npm run dev
```

## Testing the System

### 1. Create Multiple Admin Accounts
1. Click "Sign Up"
2. Select "Recruiter" role
3. Enter company name (e.g., "Tech Corp")
4. Complete registration
5. Verify email (check console logs if email service not configured)
6. Sign in

### 2. Create Another Admin Account
1. Logout
2. Repeat the process with different email and company name (e.g., "Design Agency")

### 3. Test Admin Isolation
**As Admin 1 (Tech Corp):**
- Create a few job postings
- Note that you only see your jobs in the dashboard

**As Admin 2 (Design Agency):**
- Login with second admin account
- Create different job postings
- Verify you only see your jobs (not Admin 1's jobs)
- Try to edit/delete jobs → should only work for your own jobs

**As Job Seeker:**
- Sign up as a regular user (Job Seeker)
- Browse jobs → should see all jobs from all companies
- Apply to jobs from different companies
- View your applications

### 4. Test Application Management
**As Admin:**
- View applications → only see applications for your posted jobs
- Accept/Reject applications → only works for your jobs' applications

## Migration from Old System

If you have existing data with the old single-admin system:

1. **Database Migration Required:**
   - Existing jobs need a `createdBy` field
   - Run a migration script to assign existing jobs to a default admin account
   
2. **Sample Migration Script:**
```javascript
// Run this in MongoDB shell or create a Node.js script
const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/newJobs');

async function migrate() {
  // Create a default admin account for existing jobs
  const defaultAdmin = await User.create({
    name: 'Default Admin',
    email: 'admin@company.com',
    password: 'change_this_password',
    role: 'admin',
    companyName: 'Company Name',
    isEmailVerified: true
  });
  
  // Update all existing jobs to be owned by this admin
  await Job.updateMany(
    { createdBy: { $exists: false } },
    { $set: { createdBy: defaultAdmin._id } }
  );
  
  console.log('Migration completed!');
}

migrate();
```

## API Authentication Examples

### Sign Up as Recruiter
```javascript
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@techcorp.com",
  "password": "securePassword123",
  "role": "admin",
  "companyName": "Tech Corp"
}

Response:
{
  "success": true,
  "message": "User registered successfully!",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@techcorp.com",
      "role": "admin",
      "companyName": "Tech Corp"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Create Job (Authenticated)
```javascript
POST /api/jobs
Headers: {
  "Authorization": "Bearer <your_jwt_token>"
}
Body: {
  "title": "Senior React Developer",
  "company": "Tech Corp",
  "location": "Remote",
  "jobType": "full-time",
  "salaryRange": "$100k-$150k",
  "experience": "5+ years",
  "deadline": "2025-12-31",
  "description": "...",
  "requirements": "..."
}
```

### Get Admin's Jobs Only
```javascript
GET /api/jobs/admin/my-jobs
Headers: {
  "Authorization": "Bearer <your_jwt_token>"
}

Response: [
  {
    "_id": "...",
    "title": "Senior React Developer",
    "company": "Tech Corp",
    "createdBy": "...",  // Your admin ID
    // ... other fields
  }
]
```

## Troubleshooting

### Issue: "Authentication required" error
**Solution:** Ensure the JWT token is being sent in the Authorization header:
```javascript
Authorization: Bearer <token>
```

### Issue: Admin can't see any jobs
**Solution:** 
1. Check if admin has created any jobs
2. Verify the GET request goes to `/api/jobs/admin/my-jobs`
3. Check if token is valid and contains correct user ID

### Issue: "You can only update jobs you created" error
**Solution:** This is correct behavior. Admins can only manage their own jobs.

### Issue: Token expired
**Solution:** Sign in again to get a new token (tokens expire after 7 days)

## Security Best Practices

1. **Never expose JWT_SECRET** - Keep it in .env file, never commit to git
2. **Use HTTPS in production** - Encrypt token transmission
3. **Validate all inputs** - Both frontend and backend
4. **Rate limiting** - Implement to prevent brute force attacks
5. **Regular token rotation** - Tokens expire in 7 days, implement refresh tokens if needed

## Future Enhancements

- [ ] Refresh token implementation
- [ ] Role-based UI components
- [ ] Admin dashboard analytics (only their jobs/applications)
- [ ] Email notifications for application status changes
- [ ] Advanced admin permissions (super admin vs regular admin)
- [ ] Two-factor authentication for admin accounts
- [ ] Job posting approval workflow

## Support

If you encounter any issues:
1. Check browser console for error messages
2. Check backend server logs
3. Verify JWT token is being sent correctly
4. Ensure MongoDB is running and connected
5. Check that all required environment variables are set

---

**Last Updated:** October 8, 2025
**Version:** 2.0.0 - Multi-Admin System
