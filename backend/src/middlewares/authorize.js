/**
 * Grant access to specific roles
 * @param  {...string} roles - e.g. 'donor', 'volunteer', 'ngo', 'admin'
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role || 'guest'}' is not authorized to access this route.`,
      });
    }
    next();
  };
};
