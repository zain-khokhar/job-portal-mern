# Profile Settings Feature Documentation

## Overview
The Profile Settings feature provides comprehensive user and admin profile management capabilities with real-time status tracking, profile image upload, and secure settings management.

## Features

### User Profile Settings (`/profile`)

#### 1. **Profile Image Management**
- Upload and crop profile pictures (max 5MB)
- Support for all image formats (JPEG, PNG, GIF, WebP)
- Automatic storage in browser localStorage with user-specific keys
- Real-time profile image updates in navigation bar
- Fallback to user initials when no image is uploaded

#### 2. **Profile Information Tabs**
- **Profile Tab**: Personal and professional information
- **Security Tab**: Password change and security settings
- **Notifications Tab**: Communication preferences
- **Preferences Tab**: Application and system preferences

#### 3. **Personal Information Management**
- Full name editing
- Phone number
- Location
- Bio/description
- Company and position information
- Website URL

#### 4. **Account Information Display**
- User role (User, Admin, Recruiter)
- Account creation date
- Current status (Active, Suspended, Pending)
- Real-time status updates with color-coded indicators

#### 5. **Security Features**
- Password change with validation
- Current password verification
- Password strength requirements (min 6 characters)
- Show/hide password toggles
- Two-factor authentication preparation (UI ready)

#### 6. **Notification Preferences**
- Email notifications toggle
- Push notifications toggle
- SMS notifications toggle
- Granular notification controls

### Admin Profile Settings (`/admin/profile`)

#### 1. **Admin-Specific Features**
- Enhanced admin profile with department and position
- Administrative permissions display
- System analytics and statistics
- Admin role indicators and badges

#### 2. **Admin Statistics Dashboard**
- Total users count
- Active jobs count
- Pending applications
- Active recruiters
- System health metrics
- Platform uptime display

#### 3. **Permission Management**
- Visual permission display
- Manage Users permission
- Manage Jobs permission
- View Analytics permission
- System Settings permission
- Manage Admins permission

#### 4. **Admin Analytics**
- Account creation date
- Last login tracking
- System overview metrics
- Platform health indicators

## Real-Time Status Monitoring

### StatusNotification Component
- Monitors user status every 30 seconds
- Shows notifications for status changes:
  - **Account Suspended**: Persistent error notification
  - **Account Restored**: Success notification (5s)
  - **Account Under Review**: Warning notification (7s)
  - **General Status Updates**: Info notification (5s)

### Status Indicators
- **Active**: Green badge with checkmark
- **Suspended**: Red badge with alert icon
- **Pending**: Yellow badge with clock icon
- **Custom Statuses**: Gray badge with appropriate styling

## Data Storage

### localStorage Usage
- **Profile Images**: `profileImage_{userEmail}` for users
- **Admin Profile Images**: `adminProfileImage_{adminEmail}` for admins
- **User Data**: Synced with `user` key in localStorage
- **Admin Data**: Stored in `adminUser` sessionStorage

### Profile Image Storage
- Base64 encoded image data
- User-specific keys prevent conflicts
- Automatic cleanup on logout
- Event-driven updates across components

## API Integration Ready

### Profile Service (`profileService.js`)
- `getUserProfile(userId)` - Fetch user profile
- `updateUserProfile(userId, data)` - Update profile
- `changePassword(passwordData)` - Change password
- `uploadProfileImage(imageFile)` - Upload profile image
- `getUserStatus(userId)` - Check user status
- `updateNotificationPreferences(preferences)` - Update notifications

### Status Monitoring
- Integrated with backend user management
- Real-time status synchronization
- Automatic context updates

## Responsive Design

### Mobile-First Approach
- Responsive grid layouts
- Touch-friendly interface
- Optimized for all screen sizes
- Accessible form controls

### Dark Mode Support
- Full dark mode compatibility
- Theme-aware color schemes
- Automatic theme persistence
- Smooth transitions

## Security Features

### Data Validation
- File type validation for images
- File size limits (5MB)
- Password strength requirements
- Input sanitization

### Privacy Protection
- User-specific data isolation
- Secure password handling
- Protected admin functionalities
- Role-based access control

## Usage Examples

### Basic Profile Update
```javascript
// Update user profile
const handleSaveProfile = async () => {
  const updatedUser = { ...currentUser, ...formData };
  setCurrentUser(updatedUser);
  localStorage.setItem('user', JSON.stringify(updatedUser));
};
```

### Profile Image Upload
```javascript
// Handle image upload
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const imageDataUrl = e.target.result;
    saveProfileImageToStorage(currentUser?.email, imageDataUrl);
  };
  reader.readAsDataURL(file);
};
```

### Status Monitoring
```javascript
// Check user status
const checkStatus = async () => {
  const statusData = await getUserStatus(currentUser.id);
  if (statusData.status !== currentUser.status) {
    setCurrentUser(prev => ({ ...prev, status: statusData.status }));
  }
};
```

## Component Structure

```
src/
├── pages/
│   ├── Profile.jsx                 # Main user profile page
│   └── admin/
│       └── AdminProfile.jsx        # Admin profile page
├── components/
│   ├── Navbar.jsx                  # Updated with profile image
│   └── StatusNotification.jsx      # Real-time status notifications
├── services/
│   └── profileService.js           # Profile-related API calls
└── context/
    └── AppContext.jsx              # Updated with profile management
```

## Best Practices

### Performance Optimization
- Lazy loading of profile images
- Debounced status checks
- Efficient localStorage usage
- Minimal re-renders

### User Experience
- Smooth animations and transitions
- Clear loading states
- Helpful error messages
- Intuitive navigation

### Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

## Future Enhancements

### Planned Features
- Two-factor authentication implementation
- Profile image crop/resize tools
- Advanced notification settings
- Social media profile links
- CV/Resume upload and management
- Activity timeline
- Profile completion progress

### API Integration
- Real-time WebSocket status updates
- Cloud image storage (AWS S3, Cloudinary)
- Advanced user analytics
- Audit logging
- Email verification
- Phone number verification

## Browser Compatibility

### Supported Browsers
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Storage Requirements
- localStorage: ~5MB per user (profile images)
- sessionStorage: Admin authentication data
- IndexedDB: Future enhancement for offline support

## Troubleshooting

### Common Issues
1. **Profile image not displaying**: Check localStorage quota
2. **Status not updating**: Verify API connectivity
3. **Form not saving**: Check user authentication
4. **Dark mode issues**: Clear theme cache

### Debug Tools
- React DevTools for component state
- Browser DevTools for localStorage inspection
- Network tab for API call monitoring
- Console for error tracking

This comprehensive profile settings system provides a premium, branded experience with real-time capabilities and extensible architecture for future enhancements.