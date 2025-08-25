const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.auth = function(required = true) {
  return async (req, res, next) => {
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      if (!token) {
        if (!required) return next();
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(payload.id).select('-password');
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      next();
    } catch (e) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}