# API Changes Reference - Multi-Admin System

## Authentication Endpoints

### 1. Sign Up (Updated)
**Endpoint:** `POST /api/auth/signup`

**Old Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**New Request (Job Seeker):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**New Request (Recruiter) - Company Name Now Required:**
```json
{
  "name": "John Smith",
  "email": "john@techcorp.com",
  "password": "password123",
  "role": "admin",
  "companyName": "Tech Corp"
}
```

**New Response:**
```json
{
  "success": true,
  "message": "User registered successfully!",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Smith",
      "email": "john@techcorp.com",
      "role": "admin",
      "companyName": "Tech Corp",
      "isEmailVerified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Sign In (Updated)
**Endpoint:** `POST /api/auth/signin`

**Old Behavior:**
- Checked for hardcoded admin credentials first
- Regular users authenticated from database

**New Behavior:**
- All users (including admins) authenticate from database
- Returns JWT token for all successful logins

**Request:**
```json
{
  "email": "john@techcorp.com",
  "password": "password123"
}
```

**New Response:**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Smith",
      "email": "john@techcorp.com",
      "role": "admin",
      "companyName": "Tech Corp",
      "isEmailVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Admin Sign In (Removed)
**Endpoint:** `POST /api/auth/admin-signin` ❌ **REMOVED**

This endpoint has been removed. Admins now use the regular `/api/auth/signin` endpoint.

## Job Endpoints

### 1. Create Job (Updated - Now Requires Auth)
**Endpoint:** `POST /api/jobs`

**Old Behavior:**
- No authentication required
- Anyone could create jobs

**New Behavior:**
- Requires JWT token in header
- Only admin/recruiter roles can create jobs
- Job automatically linked to authenticated user

**Headers Required:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "title": "Senior React Developer",
  "company": "Tech Corp",
  "location": "Remote",
  "jobType": "full-time",
  "salaryRange": "$100k-$150k",
  "experience": "5+ years",
  "deadline": "2025-12-31",
  "description": "We are looking for...",
  "requirements": "- 5+ years React experience..."
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Senior React Developer",
  "company": "Tech Corp",
  "location": "Remote",
  "jobType": "full-time",
  "salaryRange": "$100k-$150k",
  "experience": "5+ years",
  "deadline": "2025-12-31T00:00:00.000Z",
  "description": "We are looking for...",
  "requirements": "- 5+ years React experience...",
  "createdBy": "507f1f77bcf86cd799439011",
  "createdAt": "2025-10-08T12:00:00.000Z"
}
```

### 2. Get All Jobs (Unchanged)
**Endpoint:** `GET /api/jobs`

**Behavior:**
- Public endpoint (no auth required)
- Returns ALL jobs from ALL recruiters
- Used by job seekers to browse jobs

**Response:**
```json
[
  {
    "_id": "...",
    "title": "Senior React Developer",
    "company": "Tech Corp",
    "createdBy": {
      "name": "John Smith",
      "email": "john@techcorp.com",
      "companyName": "Tech Corp"
    },
    // ... other fields
  },
  {
    "_id": "...",
    "title": "UI Designer",
    "company": "Design Studio",
    "createdBy": {
      "name": "Sarah Johnson",
      "email": "sarah@designstudio.com",
      "companyName": "Design Studio"
    },
    // ... other fields
  }
]
```

### 3. Get Admin's Jobs (New Endpoint)
**Endpoint:** `GET /api/jobs/admin/my-jobs` ✨ **NEW**

**Purpose:** Returns only jobs created by the authenticated admin

**Headers Required:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "_id": "...",
    "title": "Senior React Developer",
    "company": "Tech Corp",
    "createdBy": "507f1f77bcf86cd799439011",
    // ... other fields
  },
  {
    "_id": "...",
    "title": "Backend Developer",
    "company": "Tech Corp",
    "createdBy": "507f1f77bcf86cd799439011",
    // ... other fields
  }
]
```

### 4. Update Job (Updated - Authorization Added)
**Endpoint:** `PUT /api/jobs/:id`

**Old Behavior:**
- No authentication required
- Anyone could update any job

**New Behavior:**
- Requires JWT token
- Admin can only update jobs they created
- Returns 403 error if trying to update another admin's job

**Headers Required:**
```
Authorization: Bearer <jwt_token>
```

**Error Response (Not Owner):**
```json
{
  "message": "You can only update jobs you created"
}
```

### 5. Delete Job (Updated - Authorization Added)
**Endpoint:** `DELETE /api/jobs/:id`

**Old Behavior:**
- No authentication required
- Anyone could delete any job

**New Behavior:**
- Requires JWT token
- Admin can only delete jobs they created
- Returns 403 error if trying to delete another admin's job

**Headers Required:**
```
Authorization: Bearer <jwt_token>
```

**Error Response (Not Owner):**
```json
{
  "message": "You can only delete jobs you created"
}
```

## Application Endpoints

### 1. Get All Applications (Updated - Filtered by Admin's Jobs)
**Endpoint:** `GET /api/applications`

**Old Behavior:**
- Returned ALL applications for ALL jobs

**New Behavior:**
- Requires JWT token
- Only returns applications for jobs created by authenticated admin
- Each admin sees only their job applications

**Headers Required:**
```
Authorization: Bearer <jwt_token>
```

**Response (Admin John - Tech Corp):**
```json
{
  "success": true,
  "applications": [
    {
      "_id": "...",
      "jobId": {
        "_id": "...",
        "title": "Senior React Developer",
        "company": "Tech Corp",
        "createdBy": "507f1f77bcf86cd799439011"
      },
      "userId": "user123",
      "status": "pending",
      // ... other fields
    }
  ]
}
```

**Note:** Sarah (Design Studio admin) would get different applications - only for her jobs.

### 2. Get Applications for Specific Job (New Endpoint)
**Endpoint:** `GET /api/applications/job/:jobId` ✨ **NEW**

**Purpose:** Get applications for a specific job (only if admin owns that job)

**Headers Required:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "applications": [
    {
      "_id": "...",
      "jobId": "507f1f77bcf86cd799439011",
      "userId": "user123",
      "coverLetter": "I am interested...",
      "resumeUrl": "http://...",
      "status": "pending",
      "createdAt": "2025-10-08T12:00:00.000Z"
    }
  ]
}
```

**Error Response (Not Job Owner):**
```json
{
  "success": false,
  "message": "You can only view applications for jobs you created"
}
```

### 3. Accept Application (Updated - Authorization Added)
**Endpoint:** `PUT /api/applications/accept/:id`

**Old Behavior:**
- Required custom header `x-admin-auth`
- No verification of job ownership

**New Behavior:**
- Requires JWT token
- Verifies the application's job belongs to authenticated admin
- Returns 403 if trying to manage another admin's job applications

**Headers Required:**
```
Authorization: Bearer <jwt_token>
```

**Error Response (Not Job Owner):**
```json
{
  "success": false,
  "message": "You can only manage applications for jobs you created"
}
```

### 4. Reject Application (Updated - Authorization Added)
**Endpoint:** `DELETE /api/applications/reject/:id`

**Old Behavior:**
- Required custom header `x-admin-auth`
- No verification of job ownership

**New Behavior:**
- Requires JWT token
- Verifies the application's job belongs to authenticated admin
- Returns 403 if trying to manage another admin's job applications

**Headers Required:**
```
Authorization: Bearer <jwt_token>
```

## Authentication Flow

### Token Management

**1. On Signup/Signin:**
```javascript
// Backend generates token
const token = jwt.sign(
  { 
    id: user._id, 
    email: user.email, 
    role: user.role,
    name: user.name
  },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

**2. Frontend Stores Token:**
```javascript
// Token stored in localStorage
localStorage.setItem('authToken', token);

// Token automatically included in all API requests
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

**3. Backend Verifies Token:**
```javascript
// Middleware extracts and verifies token
const token = req.headers.authorization?.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded; // User info available in all routes
```

## Migration Guide

### For Existing Installations

If you have existing jobs without `createdBy` field:

**Option 1: Assign to Default Admin**
```javascript
// Create a default admin account
const defaultAdmin = await User.create({
  name: 'Default Admin',
  email: 'admin@company.com',
  password: 'change_this',
  role: 'admin',
  companyName: 'Your Company',
  isEmailVerified: true
});

// Update all existing jobs
await Job.updateMany(
  { createdBy: { $exists: false } },
  { $set: { createdBy: defaultAdmin._id } }
);
```

**Option 2: Delete Old Jobs**
```javascript
// If old jobs are test data, simply delete them
await Job.deleteMany({ createdBy: { $exists: false } });
```

## Error Codes Reference

| Status Code | Error | Meaning |
|-------------|-------|---------|
| 401 | No token provided | User not authenticated |
| 401 | Invalid token | Token is malformed or expired |
| 401 | Token expired | Token has exceeded 7-day validity |
| 403 | Access denied | User doesn't have required role |
| 403 | You can only update jobs you created | Trying to modify another admin's job |
| 403 | You can only delete jobs you created | Trying to delete another admin's job |
| 403 | You can only manage applications for jobs you created | Trying to manage another admin's applications |

## Testing with Postman/Insomnia

### 1. Sign Up as Recruiter
```
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "Test Admin",
  "email": "test@company.com",
  "password": "password123",
  "role": "admin",
  "companyName": "Test Company"
}
```

### 2. Copy Token from Response
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Create Job with Token
```
POST http://localhost:5000/api/jobs
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Test Job",
  "company": "Test Company",
  "location": "Remote",
  "jobType": "full-time",
  "salaryRange": "$80k-$120k",
  "experience": "3+ years",
  "deadline": "2025-12-31",
  "description": "Test description",
  "requirements": "Test requirements"
}
```

### 4. Get Your Jobs
```
GET http://localhost:5000/api/jobs/admin/my-jobs
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

**Summary:** The API now properly supports multiple admins with JWT authentication, ensuring each admin can only manage their own jobs and applications.
