import express from 'express';
import { verifyToken } from '../controllers/authMiddleware.js'; // Importing the authentication middleware
import { getTransactions } from '../controllers/userController.js'

const userRouter = express.Router();

// Create a new planner for the specified user
userRouter.get('/transactions', verifyToken , getTransactions);

export default userRouter;
