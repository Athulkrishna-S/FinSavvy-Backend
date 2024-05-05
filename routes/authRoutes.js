import express from 'express';
import authController from '../controllers/authController.js'; // Assuming authController is in authController.js

const authRouter = express.Router();

authRouter.route('/signup')
  .post(authController.signup);

authRouter.route('/login')
  .post(authController.login);

authRouter.route('/logout')
  .get(authController.logout);

export default authRouter;
