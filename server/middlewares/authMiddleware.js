import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  console.log('Inside authenticate middleware');
  if (!token) {
    console.log("No token found");
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Token decoded:", decoded);
    next();
  } catch (err) {
    console.error("Token validation error:", err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

