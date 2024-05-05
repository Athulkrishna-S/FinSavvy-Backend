import express from 'express';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRouter from './routes/authRoutes.js'; 
import userRouter from './routes/userRoutes.js'; 

// prevent brute force attack
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Apply rate limiter only to the login route
app.use('/login', limiter);

app.use(mongoSanitize()); // prevent mongoDB Injection
app.use('/auth', authRouter); // Routes for authentication: signup, login, logout
app.use('/api/:id', userRouter); // Routes for specific user operations

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
