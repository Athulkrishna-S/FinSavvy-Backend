const express = require('express');
const app = express();
const session = require('express-session');

const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const cron = require('node-cron');

const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');

// prevent brute force attack
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
});


app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Apply rate limiter only to the login route
app.use('/login', limiter);

app.use(mongoSanitize()); // prevent mongoDB Injection
app.use('/auth', authRouter); // Routes for authentication: signup, login, logout
app.use('/api/:username', userRouter); // Routes for specific user operations

// Schedule a task to run daily
cron.schedule('0 0 * * *', () => {
  const currentDay = new Date().getDate();

  // Call the installmentController for the current day
  installmentController.handleInstallmentsForDay(currentDay);
}, {
  timezone: 'Asia/Kolkata', // Set the timezone for India
});

// Testing code for daily check for installments
app.get('/test-installments', (req, res) => {
  // const currentDay = new Date().getDate();

  // Call the installmentController for the current day
  installmentController.handleInstallmentsForDay(1);

  res.send('Test successful!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
