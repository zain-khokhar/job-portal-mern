import User from '../models/User.js';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendPasswordResetConfirmationEmail } from '../services/emailService.js';

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      emailVerificationToken,
      emailVerificationExpiry,
      isEmailVerified: false
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, emailVerificationToken, name);
      console.log('Verification email sent to:', email);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully! Please check your email to verify your account.',
      data: { 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
      }
    });

  } catch (error) {
    console.error('Signup error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/signin
// @access  Public
export const signin = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for admin credentials first if role is admin or if trying admin credentials
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminUsername = process.env.ADMIN_USERNAME;

    if (email === adminEmail && password === adminPassword) {
      return res.status(200).json({
        success: true,
        message: 'Admin logged in successfully',
        data: { 
          user: {
            id: 'admin',
            name: adminUsername,
            email: adminEmail,
            role: 'admin'
          }
        }
      });
    }

    // Check if user exists and get password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if email is verified (allow admin to bypass this check)
    if (!user.isEmailVerified && user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email address before signing in. Check your inbox for the verification link.',
        emailVerificationRequired: true,
        email: user.email
      });
    }

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: { 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
      }
    });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Admin login
// @route   POST /api/auth/admin-signin
// @access  Public (but restricted to admin credentials)
export const adminSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check against hardcoded admin credentials from .env
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminUsername = process.env.ADMIN_USERNAME;

    if (email === adminEmail && password === adminPassword) {
      res.status(200).json({
        success: true,
        message: 'Admin logged in successfully',
        data: { 
          user: {
            id: 'admin',
            name: adminUsername,
            email: adminEmail,
            role: 'admin'
          }
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

  } catch (error) {
    console.error('Admin signin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.body;

    if (!token || !email) {
      return res.status(400).json({
        success: false,
        message: 'Token and email are required'
      });
    }

    // Find user with matching token and email
    const user = await User.findOne({
      email: email,
      emailVerificationToken: token,
      emailVerificationExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Verify the user
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpiry = null;
    await user.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! Welcome to Jobly!',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpiry = emailVerificationExpiry;
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(user.email, emailVerificationToken, user.name);
      
      res.status(200).json({
        success: true,
        message: 'Verification email sent successfully! Please check your inbox.'
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, resetToken, user.name);
      console.log('Password reset email sent to:', user.email);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // Reset the token if email fails
      user.resetToken = null;
      user.resetTokenExpiry = null;
      await user.save();
      
      return res.status(500).json({
        success: false,
        message: 'Failed to send password reset email'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset link has been sent to your email!'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password and clear reset token
    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    // Send password reset confirmation email
    try {
      await sendPasswordResetConfirmationEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Failed to send password reset confirmation email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Password reset successfully! You can now sign in with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Verify reset token
// @route   POST /api/auth/verify-reset-token
// @access  Public
export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Token is valid',
      data: {
        email: user.email
      }
    });

  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Export functions - already exported individually with export keyword
