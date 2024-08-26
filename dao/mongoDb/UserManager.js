import User from '../../models/user.js';
import { isValidPassword } from '../../utils/validator/authentication.utils.js';
import logger  from "../../config/logger.js"

class UserManager {
  async registerUser(firstName, lastName, email, password) {
    try { 
      const newUser = new User({ firstName, lastName, email, password });
  await newUser.save()
      return newUser;
    } catch (error) {console.log (error.message)
      throw new Error(error.message);
    }
  }

  async findUserByEmail(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      logger.info(error.message);
      throw new Error('Error finding user by email');
    }
  }

  async findUserById(id) {
    try {
      return await User.findById(id);
    } catch (error) {
      logger.info(error.message);
      throw new Error('Error finding user by id');
    }
  }

  async verifyCredentials(email, password) {
    try {
      const user = await User.findOne({ email });
      if (user) {
        return isValidPassword(user, password);
      }
      return false;
    } catch {
      throw new Error('Error verifying credentials');
    }
  }

  async updateUserRole(email, role) {
    try {
      const user = await User.findOneAndUpdate({ email }, { role }, { new: true });
      return user;
    } catch {
      throw new Error('Error updating user role');
    }
  }
}

export default new UserManager();
