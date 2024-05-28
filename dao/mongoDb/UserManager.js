const User = require('../models/user');
const { isValidPassword } = require('../../utils/validator/authentication.utils');


class UserManager {
  async registerUser(firstName, lastName, email, age, password) {
    try {
      
      const newUser = new User({ firstName, lastName, email, age, password });
      
      await newUser.save();
      return newUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findUserByEmail(email) {
  
    try {
      return await User.findOne( email );
    } catch (error) {
      console.log (error.message)
      throw new Error('Error finding user by email');
    }
  }

  

  async findUserById(id) {
    try {
      return await User.findOne(id);
    } catch (error) {
      console.log (error.message)
      throw new Error('Error finding user by email');
    }
  }

  async verifyCredentials(email, password) {
    try {
      const user = await User.findOne({ email });

      return user !== null ? isValidPassword (user , password):false ;
    } catch (error) {
      throw new Error('Error verifying credentials');
    }
  }

  async updateUserRole(email, role) {
    try {
      const user = await User.findOneAndUpdate({ email }, { role }, { new: true });
      return user;
    } catch (error) {
      throw new Error('Error updating user role');
    }
  }
}

module.exports = UserManager;
