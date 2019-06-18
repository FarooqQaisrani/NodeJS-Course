// const mysql = require('mysql2');
//
// const pool = mysql.createPool({
//     host: 'localhost',
//     port: "8083",
//     user: 'root',
//     database: 'node-complete',
//     password: 'root'
// });
//
// module.exports = pool.promise();

const Sequelize = require('sequelize');

const sequqlize = new Sequelize('node-complete', 'root', 'root', {
    dialect: 'mysql',
    host: 'localhost',
    port: '8083',
    logging: false
});

module.exports = sequqlize;