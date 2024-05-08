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

import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': '660c26f5fad8e1001c8826a2',
            'PLAID-SECRET': '3bbd3b891f4068b1e027f64509e260',
        },
    },
});

const plaidClient = new PlaidApi(configuration);
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

//app.post('/create_link_token', createLinkToken);
//app.post('/exchange_public_token' , exchangePublicToken);
// scheduled to run daily on 8:00 AM

app.post('/create_link_token', async function (request, response) {
  const plaidRequest = {
      user: {
          client_user_id: 'user',
      },
      client_name: 'Plaid Test App',
      products: ['auth','transactions'],
      language: 'en',
      redirect_uri: 'http://localhost:5176/',
      country_codes: ['US'],
  };
  try {
      const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
      response.json(createTokenResponse.data);
  } catch (error) {
      response.status(500).send("failure");
      // handle error
  }
});

app.post("/auth", async function(request, response) {
  try {
      const access_token = request.body.access_token;
      const plaidRequest = {
          access_token: access_token,
      };
      const plaidResponse = await plaidClient.authGet(plaidRequest);
      response.json(plaidResponse.data);
  } catch (e) {
      response.status(500).send("failed");
  }
});

app.post('/exchange_public_token', async function (
   request,
   response,
   next,
) {
   const publicToken = request.body.public_token;
   try {
       const plaidResponse = await plaidClient.itemPublicTokenExchange({
           public_token: publicToken,
       });
       // These values should be saved to a persistent database and
       // associated with the currently signed-in user
       const accessToken = plaidResponse.data.access_token;
       response.json({ accessToken });
   } catch (error) {
       response.status(500).send("failed");
   }
});





cron.schedule('0 8 * * * ' , () => {
  dailyInstallments();
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
