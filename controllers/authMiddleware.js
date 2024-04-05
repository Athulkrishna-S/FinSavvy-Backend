const jwt = require('jsonwebtoken');


async function verifyToken(req, res, next) {
  const token = req.headers.authorization; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ status: 401, message: 'Unauthorized: Missing token' });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    
    // Check if user exists
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ status: 401, message: 'Unauthorized: Invalid token' });
    }

    // Attach userId to request object for later use
    req.userId = decoded.userId;
    next(); // Call next middleware or route handler
  } catch (error) {
    console.error(error);
    return res.status(401).json({ status: 401, message: 'Unauthorized: Invalid token' });
  }
}

module.exports = { verifyToken };
