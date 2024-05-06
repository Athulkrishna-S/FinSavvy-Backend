import express from 'express';
import { verifyToken } from '../controllers/authMiddleware.js'; // Importing the authentication middleware
import { getTransactions , newPlanner, getPlanner ,deletePlanner } from '../controllers/userController.js'
import { getAnalysisData , getMonthlyData } from '../analysis/dataVisualization.js';
const userRouter = express.Router();

// Create a new planner for the specified user
userRouter.get('/transactions', verifyToken , getTransactions);
userRouter.post('/newPlanner', verifyToken , newPlanner);
userRouter.get('/planner' ,  verifyToken , getPlanner);
userRouter.get('/analyzer', verifyToken , getAnalysisData);
userRouter.get('/monthly' , verifyToken , getMonthlyData);
userRouter.delete('/planner' , verifyToken , deletePlanner);

export default userRouter;
