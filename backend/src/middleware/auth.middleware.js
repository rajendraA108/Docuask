const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// This middleware runs BEFORE your route handlers — it protects private routes
const protect = async (req, res, next) => {
  try {
    // 1. Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided. Please log in.' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify the token — throws error if expired or tampered
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check user still exists in DB (handles deleted accounts)
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists.' });
    }

    // 4. Attach user to request — available in all subsequent route handlers
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    }
    next(error);
  }
};

module.exports = { protect };
