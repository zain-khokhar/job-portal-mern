import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your_email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your_app_password'
    }
  });
};

// Send email verification
export const sendVerificationEmail = async (email, verificationToken, userName) => {
  try {
    const transporter = createTransporter();
    
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@jobly.com',
      to: email,
      subject: 'Verify Your Email - Jobly Job Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Jobly!</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Find Your Next Journey</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1a202c; margin-bottom: 20px;">Hi ${userName}!</h2>
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 25px;">
              Thank you for signing up with Jobly! To complete your registration and start exploring amazing job opportunities, please verify your email address.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #718096; font-size: 14px; line-height: 1.5; margin-top: 25px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">
            
            <p style="color: #a0aec0; font-size: 12px; text-align: center; margin: 0;">
              This verification link will expire in 24 hours. If you didn't create an account with Jobly, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #a0aec0; font-size: 12px; margin: 0;">
              © 2025 Jobly. All rights reserved.
            </p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully to:', email);
    return { success: true, message: 'Verification email sent successfully' };
    
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, message: 'Failed to send verification email', error: error.message };
  }
};

// Send welcome email after verification
export const sendWelcomeEmail = async (email, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@jobly.com',
      to: email,
      subject: 'Welcome to Jobly - Your Account is Verified!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Account Verified!</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Welcome to the Jobly Community</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1a202c; margin-bottom: 20px;">Hi ${userName}!</h2>
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 25px;">
              Congratulations! Your email has been successfully verified. You can now access all features of Jobly and start your journey to find the perfect job.
            </p>
            
            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px;">What's next?</h3>
              <ul style="color: #4a5568; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Complete your profile</li>
                <li style="margin-bottom: 8px;">Upload your resume</li>
                <li style="margin-bottom: 8px;">Browse job opportunities</li>
                <li>Start applying to your dream jobs!</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile" 
                 style="display: inline-block; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Complete Your Profile
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #a0aec0; font-size: 12px; margin: 0;">
              © 2025 Jobly. All rights reserved.
            </p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully to:', email);
    return { success: true, message: 'Welcome email sent successfully' };
    
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, message: 'Failed to send welcome email', error: error.message };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken, userName) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@jobly.com',
      to: email,
      subject: 'Reset Your Password - Jobly',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔒 Password Reset</h1>
            <p style="color: #bee3f8; margin: 10px 0 0 0; font-size: 16px;">Reset your password securely</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1a202c; margin-bottom: 20px;">Hi ${userName}!</h2>
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 25px;">
              We received a request to reset your password for your Jobly account. Click the button below to create a new password.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%); 
                        color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; 
                        font-weight: bold; font-size: 16px; transition: all 0.3s ease;">
                Reset My Password
              </a>
            </div>
            
            <div style="background: #fef2e2; border-left: 4px solid #f6ad55; padding: 15px; margin: 25px 0; border-radius: 4px;">
              <p style="color: #744210; margin: 0; font-size: 14px;">
                <strong>⚠️ Important:</strong> This link will expire in 15 minutes for security reasons.
              </p>
            </div>
            
            <p style="color: #718096; font-size: 14px; margin-bottom: 20px;">
              If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
            </p>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
              <p style="color: #a0aec0; font-size: 12px; margin-bottom: 10px;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="color: #3182ce; font-size: 12px; word-break: break-all; margin: 0;">
                ${resetUrl}
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #a0aec0; font-size: 12px; margin: 0;">
              © 2025 Jobly. All rights reserved.
            </p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully to:', email);
    return { success: true, message: 'Password reset email sent successfully' };
    
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, message: 'Failed to send password reset email', error: error.message };
  }
};

// Send password reset confirmation email
export const sendPasswordResetConfirmationEmail = async (email, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@jobly.com',
      to: email,
      subject: 'Password Reset Successful - Jobly',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">✅ Password Reset Successful</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Your password has been updated</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1a202c; margin-bottom: 20px;">Hi ${userName}!</h2>
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 25px;">
              Your password has been successfully reset. You can now sign in to your Jobly account using your new password.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/signin" 
                 style="display: inline-block; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); 
                        color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; 
                        font-weight: bold; font-size: 16px; transition: all 0.3s ease;">
                Sign In Now
              </a>
            </div>
            
            <div style="background: #fef2e2; border-left: 4px solid #f6ad55; padding: 15px; margin: 25px 0; border-radius: 4px;">
              <p style="color: #744210; margin: 0; font-size: 14px;">
                <strong>🔒 Security Note:</strong> If you didn't make this change, please contact our support team immediately.
              </p>
            </div>
            
            <p style="color: #718096; font-size: 14px; margin-bottom: 20px;">
              For your security, we recommend using a strong, unique password that you don't use for other accounts.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #a0aec0; font-size: 12px; margin: 0;">
              © 2025 Jobly. All rights reserved.
            </p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Password reset confirmation email sent successfully to:', email);
    return { success: true, message: 'Password reset confirmation email sent successfully' };
    
  } catch (error) {
    console.error('Error sending password reset confirmation email:', error);
    return { success: false, message: 'Failed to send password reset confirmation email', error: error.message };
  }
};