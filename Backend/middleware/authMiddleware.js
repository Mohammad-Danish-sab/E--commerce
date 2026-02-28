import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
     const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "No token, authorization denied" });
  }
};
export const isAdmin = (req, res, next) => {
  const adminKey = req.headers["x-admin-key"];

  if (adminKey !== "danish123") {
    return res.status(401).json({ message: "Not authorized" });
  }

  next();
};

export default protect;
