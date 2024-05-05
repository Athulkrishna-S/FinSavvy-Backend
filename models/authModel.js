import bcrypt from 'bcrypt';
import { User } from './database.js';
import { v4 as uuidv4 } from 'uuid';

const authsignup = async (username, email, password, phone) => {
  // Hash the password before storing it in the database
  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
  
  // Save the user details in the database
  const newUserId = uuidv4()
  const res = await User.insertOne({
    userId: newUserId,
    username,
    email,
    password: hashedPassword, // Save the hashed password
    phone
  });
 
  return newUserId; // Return the user ID
};

const authlogin = async (username, password) => {
  // Find the user in the database based on the username
  const user = await User.findOne({  username  });

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
};

export { authsignup, authlogin };
