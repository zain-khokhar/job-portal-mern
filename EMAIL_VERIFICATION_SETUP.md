# Email Verification Setup Guide

## 📧 Basic Email Verification Implementation

This implementation provides basic email verification for user registration with the following features:

### ✨ Features
- **Email verification on signup** - Users receive a verification email after registration
- **Verification link** - Click-to-verify email links that expire in 24 hours
- **Resend verification** - Users can request new verification emails
- **Blocked unverified logins** - Unverified users cannot sign in (except admins)
- **Welcome emails** - Automatic welcome email after successful verification

### 🔧 Setup Instructions

#### 1. Gmail Setup (Recommended)
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
3. **Update .env file**:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-specific-password-here
   FRONTEND_URL=http://localhost:5173
   ```

#### 2. Other Email Providers
Update the transporter configuration in `backend/services/emailService.js`:
```javascript
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: 'your-smtp-host.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};
```

### 🚀 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register user (sends verification email) |
| POST | `/api/auth/signin` | Login (checks verification status) |
| POST | `/api/auth/verify-email` | Verify email with token |
| POST | `/api/auth/resend-verification` | Resend verification email |

### 📱 Frontend Pages

1. **EmailVerification.jsx** - Handles email verification from links
2. **EmailVerificationPrompt.jsx** - Shows after registration
3. **Updated AuthModal** - Handles verification flow
4. **Updated SignInForm** - Shows verification errors

### 🎯 User Flow

1. **User registers** → Account created + verification email sent
2. **User clicks email link** → Account verified + welcome email sent
3. **User tries to login** → 
   - ✅ Verified: Login successful
   - ❌ Unverified: Login blocked with resend option

### 🛡️ Security Features

- **24-hour token expiry** - Verification links expire automatically
- **Unique tokens** - Crypto-generated random tokens per verification
- **Admin bypass** - Admins can login without verification
- **No password in emails** - Only verification tokens sent

### 🎨 Customization

#### Email Templates
Edit templates in `backend/services/emailService.js`:
- **Verification email** - `sendVerificationEmail()`
- **Welcome email** - `sendWelcomeEmail()`

#### Frontend Styling
Customize components:
- `EmailVerification.jsx` - Verification page styling
- `EmailVerificationPrompt.jsx` - Modal styling
- `SignInForm.jsx` - Error message styling

### 🧪 Testing

1. **Register a new user** - Check email delivery
2. **Click verification link** - Verify redirection works
3. **Try login before verification** - Should be blocked
4. **Try login after verification** - Should work
5. **Test resend functionality** - Should send new email

### 📝 Notes

- **Development**: Emails work with any SMTP provider
- **Production**: Consider using services like SendGrid, AWS SES, or Mailgun for better deliverability
- **Styling**: All emails are responsive and work across email clients
- **Error handling**: Graceful fallbacks if email service fails

### 🚨 Important

Remember to:
1. **Never commit real email credentials** to version control
2. **Use app-specific passwords** for Gmail (not your regular password)
3. **Test email delivery** in both development and production
4. **Monitor email logs** for delivery issues

This implementation provides a solid foundation for email verification that can be extended with additional features like password reset, email change verification, etc.