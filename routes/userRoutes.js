import express from 'express';
import { verifyToken } from '../controllers/authMiddleware.js'; // Importing the authentication middleware
import { getTransactions , newPlanner, getPlanner } from '../controllers/userController.js'
import { Analyzer } from '../analysis/dataVisualization.js';
const userRouter = express.Router();

// Create a new planner for the specified user
userRouter.get('/transactions', verifyToken , getTransactions);
userRouter.post('/newPlanner', verifyToken , newPlanner);
userRouter.get('/planner' ,  verifyToken , getPlanner);
userRouter.get('/analyzer', verifyToken , Analyzer);


export default userRouter;
