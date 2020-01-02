'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      times: {
        type: Sequelize.JSON
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Rooms');
  }
};