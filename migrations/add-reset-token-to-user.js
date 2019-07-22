"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users',
      'resetToken',
      {
        type: Sequelize.STRING,
        allowNull: true,
        after: "password"
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'resetToken')
  }
};