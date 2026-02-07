import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, handle } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { handle }] }
    });

    if (existingUser) {
      res.status(400).json({ 
        error: 'REGISTRATION FAILED: HANDLE OR EMAIL ALREADY EXISTS' 
      });
      return;
    }

    // Create user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        handle
      },
      select: { id: true, email: true, handle: true, createdAt: true }
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'REGISTRATION SUCCESSFUL',
      user,
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'SYSTEM ERROR: REGISTRATION FAILED' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !(await comparePassword(password, user.password))) {
      res.status(401).json({ 
        error: 'AUTHENTICATION FAILED: INVALID CREDENTIALS' 
      });
      return;
    }

    const token = generateToken(user.id);

    res.json({
      message: 'AUTHENTICATION SUCCESSFUL',
      user: {
        id: user.id,
        email: user.email,
        handle: user.handle,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'SYSTEM ERROR: AUTHENTICATION FAILED' });
  }
};