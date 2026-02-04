// ...existing code...
import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  // allow CORS preflight and public auth routes to bypass middleware
  const publicPaths = [
    "/auth/login",
    "/auth/signup",
    "/login",
    "/signup",
    "/api/auth/login",
    "/api/auth/signup"
  ];
  if (req.method === "OPTIONS" || publicPaths.some(p => req.path.startsWith(p))) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // support "Bearer <token>" and raw token
  const parts = authHeader.split(" ");
  const token = parts.length === 1 ? parts[0] : parts[1];
  if (!token) {
    return res.status(401).json({ message: "Token format invalid" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET not set");
    return res.status(500).json({ message: "Server configuration error" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verify error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default auth;
