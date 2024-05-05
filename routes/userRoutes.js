import express from 'express';
import { verifyToken } from '../controllers/authMiddleware.js'; // Importing the authentication middleware
import { getTransactions , newPlanner } from '../controllers/userController.js'

const userRouter = express.Router();

// Create a new planner for the specified user
userRouter.get('/transactions', verifyToken , getTransactions);
userRouter.post('/newPlanner', verifyToken , newPlanner);
export default userRouter;
