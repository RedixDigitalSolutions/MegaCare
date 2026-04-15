const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET environment variable is not set");

const adminAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Non autorisé" });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== "admin") {
            return res
                .status(403)
                .json({ message: "Accès réservé aux administrateurs" });
        }
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Token invalide" });
    }
};

module.exports = adminAuth;
