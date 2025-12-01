import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../shared/jwt';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    organizationId: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
