const DAOFactory = require('../dao/DAOFactory');
const UserDTO = require('../dtos/UserDTO');

class UserRepository {
  constructor(persistenceType) {
    this.userDAO = DAOFactory.getUserDAO(persistenceType);
  }

  async createUser(userData) {
    const user = await this.userDAO.registerUser(userData.firstName, userData.lastName, userData.email, userData.age, userData.password);
    return new UserDTO(user);
  }

  async findUserByEmail(email) {
    const user = await this.userDAO.findUserByEmail(email);
    return new UserDTO(user);
  }

  async findUserById(id) {
    const user = await this.userDAO.findUserById(id);
    return new UserDTO(user);
  }

  async verifyCredentials(email, password) {
    return await this.userDAO.verifyCredentials(email, password);
  }

  async updateUserRole(email, role) {
    const user = await this.userDAO.updateUserRole(email, role);
    return new UserDTO(user);
  }
}

module.exports = UserRepository;
