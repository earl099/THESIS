"use strict"

const dbConfig = require('./dbConfig');
const { Sequelize, DataTypes } = require('sequelize');

const db = { }

const sequelize = new Sequelize(
    dbConfig.db,
    dbConfig.user,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        operatorAliases: 0,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

sequelize.authenticate()
.then(() => {
    console.log('Connected.');
}).catch(err => {
    console.log('Error:' + err);
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('../models/userModel')(sequelize, DataTypes);
db.student = require('../models/studentModel')(sequelize, DataTypes);

db.sequelize.sync({ force: false})
.then(() => {
    console.log('Re-sync done.');
});

module.exports = db;