const jwt = require('jsonwebtoken');

// This middleware checks if the request has a valid JWT token
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token should come as: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // attach userId to request
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token. Please login again.' });
  }
};

module.exports = authMiddleware;
