const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


// token creater
function createToken(id, username, phone) {
  let tok = jwt.sign({ userId: id, username, phone }, process.env.JWT_TOKEN, { expiresIn: '7d' });
  addToken(id, tok);
  return tok;
}



//password validator

function isPasswordValid(password) {
  return /[A-Z]/.test(password) && /[a-z]/.test(password) && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) && /\d/.test(password) && password.length >= 8;
}


 // email validator

 function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


async function signup(req, res) {
  const { username, email, password ,phone} = req.body;
  try {

    // validate password
    if(!isPasswordValid(password))
    {
      throw new Error('Invalid password');
    }
 
    //validate email
    if(!isEmailValid(email))
    {
        throw new Error('Invalid email');
    }
    const userId = await User.signup(username, email, password,phone);
    const token = createToken(userId, username,phone);
    res.status(201).json({ status: 201,success: true, message: 'Signup successful', token });
     // res.cookie('jwt', token, { maxAge: 7 * 24 * 60 * 60 * 1000 });//max 7 days

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500,error: error.message });
  } 
}

async function login(req, res) {
  const { username, password } = req.body;
  try {

    if(!isPasswordValid(password))
    {
      throw new Error('Invalid password');
    }
    // Call the login function from UserModel to verify user credentials
    const user = await User.login(username, password);

    // Generate JWT token
    const token = createToken(user.userId, user.username);

    // Respond with success message and token
    res.status(200).json({ status: 200,success: true, message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({status: 500, error: error.message });
  }
}

async function logout(req, res) {
  try {
    const userId = req.userId;
    // Call removeToken function from manageSession to remove the token associated with userId
    await removeToken(userId);
    // Respond with success message
    res.status(200).json({ status: 200, message: 'Logout successful', token: '' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: error.message });
  }
}

module.exports = { signup, login, logout };