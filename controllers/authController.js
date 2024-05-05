import jwt from 'jsonwebtoken';
import { authsignup, authlogin } from '../models/authModel.js'
import { User } from '../models/database.js';
const blacklist = new Set();

async function isTokenBlacklisted(token) {
  return blacklist.has(token);
}
console.log("black list ",blacklist);
// Token creator
function createToken(id, username, phone) {
  let tok = jwt.sign({ userId: id, username, phone }, process.env.JWT_TOKEN, { expiresIn: '7d' });

  return tok;
}

// Password validator
function isPasswordValid(password) {
  return /[A-Z]/.test(password) && /[a-z]/.test(password) && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) && /\d/.test(password) && password.length >= 8;
}

// Email validator
function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function signup(req, res) {
  const { username, email, password, phone } = req.body;
  try {
    // Validate password
    if (!isPasswordValid(password)) {
      throw new Error('Invalid password');
    }

    // Validate email
    if (!isEmailValid(email)) {
      throw new Error('Invalid email');
    }
    const user = await User.findOne({username});
    if(user)
    {
        res.status(409).json({ status: 409, success: false, message: 'username already exists' });
    }
    else
    {

      const userId = await authsignup(username, email, password, phone);
      //const token = createToken(userId, username, phone);
      console.log('userId ',userId);
      res.status(201).json({ status: 201, success: true, message: 'Signup successful', id : userId});
    }
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: error.message });
  }
}

async function login(req, res) {
  const { username, password } = req.body;
  try {
    if (!isPasswordValid(password)) {
      throw new Error('Invalid password');
    }

    // Call the login function from UserModel to verify user credentials
    const user = await authlogin(username, password);

    // Generate JWT token
    const token = createToken(user.userId, user.username);

    // Respond with success message and token
    res.status(200).json({ status: 200, success: true, message: 'Login successful', token : token , id : user.userId  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: error.message });
  }
}

async function logout(req, res) {
  try {
    const userId = req.userId;
    const token = req.headers.authorization;
    if (token) {
      blacklist.add(token);
      res.status(200).json({ status: 200, message: 'Logout successful', token: '' });

    } else {
      res.status(401).json({ message: 'No token provided' });
    }

    // Respond with success message
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: error.message });
  }
}

const authController = { signup, login, logout, isTokenBlacklisted };
export default authController;
