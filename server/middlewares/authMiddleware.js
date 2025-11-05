const { verifyToken } = require("../services/jwtService");

// Middleware to protect routes
module.exports = (req, res, next) => {
  // Step 1: Get Authorization header
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  // Step 2: Extract token from format 'Bearer <token>'
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Malformed token" });

  try {
    // Step 3: Verify token using jwtService
    const decoded = verifyToken(token);

    // Step 4: Attach decoded user info to request object
    req.user = decoded;

    // Proceed to next middleware or route handler
    next();
  } catch (err) {
    // If token is invalid or expired
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
