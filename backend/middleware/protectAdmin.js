// Simple middleware to protect admin routes
const protectAdminRoutes = (req, res, next) => {
  // Simple check - in a real app you'd use JWT tokens
  // For now, we'll check if admin header is present
  const adminAuth = req.headers['x-admin-auth'];
  
  if (adminAuth === 'admin-authenticated') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin authentication required.'
    });
  }
};

export default protectAdminRoutes;