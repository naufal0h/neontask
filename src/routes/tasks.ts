import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';

const router = Router();

router.use(authenticate); // Protect all task routes

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;