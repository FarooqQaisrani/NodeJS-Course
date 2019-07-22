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
    ).then(
      ()=> {
        queryInterface.addColumn(
          'users',
          'resetTokenExpiration',
          {
            type: Sequelize.DATE,
            allowNull: true,
            after: "resetToken"
          }
        )
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'resetToken').then(() => {
      queryInterface.removeColumn('users', 'resetTokenExpiration')
    })
  }
};