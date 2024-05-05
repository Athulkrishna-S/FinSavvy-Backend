import jwt from 'jsonwebtoken';
import authController from './authController.js';

async function verifyToken(req, res, next) {
  const token = req.headers.authorization; // Extract token from Authorization header
  const invalidToken = await authController.isTokenBlacklisted(token);

  if (!token) {
    return res.status(401).json({ status: 401, message: 'Unauthorized: Missing token' });
  }

  if (invalidToken) {
    return res.status(403).json({ status: 403, message: 'Invalid token' });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    // Attach userId to request object for later use
    req.userId = decoded.userId;
    next(); // Call next middleware or route handler
  } catch (error) {
    console.error(error);
    return res.status(401).json({ status: 401, message: 'Unauthorized: Invalid token' });
  }
}

export { verifyToken };
