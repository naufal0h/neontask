import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, priority } = req.query;
    const userId = req.user!.id;
    
    const tasks = await prisma.task.findMany({
      where: {
        userId: userId,
        ...(status && { status: status as any }),
        ...(priority && { priority: priority as any })
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({
      count: tasks.length,
      operations: tasks
    });
  } catch (error) {
    res.status(500).json({ error: 'SYSTEM ERROR: FAILED TO RETRIEVE OPERATIONS' });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, priority, dueDate } = req.body;
    const userId = req.user!.id;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || 'LOW',
        userId: userId,
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });

    res.status(201).json({
      message: 'OPERATION CREATED SUCCESSFULLY',
      operation: task
    });
  } catch (error) {
    res.status(500).json({ error: 'SYSTEM ERROR: OPERATION CREATION FAILED' });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;  // <-- FIXED: Explicit cast
    const { title, description, status, priority, dueDate } = req.body;
    const userId = req.user!.id;

    // Verify ownership
    const existingTask = await prisma.task.findFirst({
      where: { id, userId: userId }
    });

    if (!existingTask) {
      res.status(404).json({ error: 'OPERATION NOT FOUND OR ACCESS DENIED' });
      return;
    }

    const task = await prisma.task.update({
      where: { id },  // <-- Now id is string
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(dueDate && { dueDate: new Date(dueDate) })
      }
    });

    res.json({
      message: 'OPERATION UPDATED SUCCESSFULLY',
      operation: task
    });
  } catch (error) {
    res.status(500).json({ error: 'SYSTEM ERROR: OPERATION UPDATE FAILED' });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;  // <-- FIXED: Explicit cast
    const userId = req.user!.id;

    const existingTask = await prisma.task.findFirst({
      where: { id, userId: userId }
    });

    if (!existingTask) {
      res.status(404).json({ error: 'OPERATION NOT FOUND OR ACCESS DENIED' });
      return;
    }

    await prisma.task.delete({ where: { id } });  // <-- Now id is string

    res.json({
      message: 'OPERATION TERMINATED SUCCESSFULLY',
      id
    });
  } catch (error) {
    res.status(500).json({ error: 'SYSTEM ERROR: OPERATION TERMINATION FAILED' });
  }
}