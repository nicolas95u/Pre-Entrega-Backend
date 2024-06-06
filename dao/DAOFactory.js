const UserManagerMongoDB = require('./mongoDb/UserManager');

class DAOFactory {
  static getUserDAO(persistenceType) {
    switch (persistenceType) {
      case 'mongodb':
        return UserManagerMongoDB;
      // Agregar otros DAOs según sea necesario
      // case 'filesystem':
      //   return UserManagerFileSystem;
      default:
        throw new Error('Unknown persistence type');
    }
  }
}

module.exports = DAOFactory;
