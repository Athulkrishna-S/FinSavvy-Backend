const express = require('express');
const userRouter = express.Router();
const dashboardController = require('../controllers/dashboardController');
const newPlannerController = require('../controllers/newPlannerController');
const stockController = require('../controllers/stockController');
const { verifyToken } = require('../middleware/authMiddleware'); // Importing the authentication middleware

// Create a new planner for the specified user
userRouter.post('/new_planner', verifyToken, newPlannerController.createNewPlanner); // Protecting the route with authentication middleware

userRouter.get('/dashboard', verifyToken, dashboardController.renderDashboardPage); // Protecting the route with authentication middleware

userRouter.get('/stock', verifyToken, stockController.getTopStocks); // Protecting the route with authentication middleware

module.exports = userRouter;
