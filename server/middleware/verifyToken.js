require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/tempUser');  // ✅ FIXED (Capital U)

module.exports = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || req.headers.Authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    req.user = user;
    next();
  } catch (err) {
    console.error('Token verify error:', err);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
