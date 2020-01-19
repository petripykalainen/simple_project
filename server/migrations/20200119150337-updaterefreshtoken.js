'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      // queryInterface.removeColumn('Users', 'tokencount'),
      queryInterface.changeColumn('Users', 'refreshtoken', Sequelize.STRING(1024))
    ])
  },  

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      // queryInterface.addColumn('Users', 'tokencount', Sequelize.INTEGER),
      queryInterface.changeColumn('Users', 'refreshtoken', Sequelize.STRING)
    ])
  }
};
