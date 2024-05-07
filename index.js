import express from 'express';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import cron from 'node-cron';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRouter from './routes/authRoutes.js'; 
import userRouter from './routes/userRoutes.js'; 
import { getTopStocks } from './services/stock.js';
import dailyInstallments from './utils/dailyInstallements.js';
import { createLinkToken , exchangePublicToken }  from './utils/plaidConnection.js';


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

app.get('/api/stock',getTopStocks);

app.post('/create_link_token', createLinkToken);
app.post('/exchange_public_token' , exchangePublicToken);
// scheduled to run daily on 8:00 AM
cron.schedule('0 8 * * * ' , () => {
  dailyInstallments();
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
