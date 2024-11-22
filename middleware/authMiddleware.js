import jwt from "jsonwebtoken";
export const protect = (req, res, next) => {
  const token =
    req.header("Authorization") && req.header("Authorization").split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach decoded token data to the request object
    next(); // Moving to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
