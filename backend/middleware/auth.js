const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
exports.protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer '))
    return res.status(401).json({ message: 'Not authorised, no token' });

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, "voguevision2026secret");
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    if (req.user.status === 'inactive')
      return res.status(403).json({ message: 'Account deactivated' });
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Role-based access
exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: `Role '${req.user.role}' is not allowed` });
  next();
};
