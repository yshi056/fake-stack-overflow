import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface JwtPayload {
  userId: string;
  username: string;
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
      req.user = { userId: payload.userId, username: payload.username };
      next();
    } catch (err) {
        console.error('JWT verification error:', err);
      return res.status(403).json({ message: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'Missing token' });
  }
};
