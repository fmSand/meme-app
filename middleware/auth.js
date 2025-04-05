/**
 * Middleware to ensure user is authenticated
 * Verifies that the user has been authenticated before allowing access to protected routes
 */
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

module.exports = { ensureAuthenticated };
