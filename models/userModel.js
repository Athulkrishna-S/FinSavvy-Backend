const bcrypt = require('bcrypt');
const {User} = require('./database'); 
const { v4: uuidv4 } = require('uuid');

async function signup(username, email, password, phone) {
  // Hash the password before storing it in the database
  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
  
  // Save the user details in the database
  const newUser = await User.insertOne({
    userId: uuidv4(),
    username,
    email,
    password: hashedPassword, // Save the hashed password
    phone
  });

  return newUser.userId; // Return the user ID
}

async function login(username, password) {
  // Find the user in the database based on the username
  const user = await User.findOne({ where: { username } });

  if (!user) {
    throw new Error('User not found');
  }

  // Compare the provided password with the hashed password stored in the database
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  return {
    userId: user.userId,
    username: user.username,
    phone: user.phone
  };
}

module.exports = { signup, login };
