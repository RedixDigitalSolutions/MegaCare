const jwt = require("jsonwebtoken");
const { isBlacklisted } = require("./tokenBlacklist");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET environment variable is not set");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  if (isBlacklisted(token))
    return res.status(401).json({ message: "Token revoked" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    req.token = token;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;

