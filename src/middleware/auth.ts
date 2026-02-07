import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Express Request type properly
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        handle: string;
      };
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ error: 'ACCESS DENIED: NO TOKEN PROVIDED' });
      return;
    }

    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, handle: true }
    });

    if (!user) {
      res.status(401).json({ error: 'ACCESS DENIED: INVALID TOKEN' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'ACCESS DENIED: TOKEN VERIFICATION FAILED' });
  }
};