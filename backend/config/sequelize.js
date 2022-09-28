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
db.schedule = require('../models/scheduleModel')(sequelize, DataTypes);

try{
    //--- SYNC DB ---//
    db.student.sync({ alter: true }).catch(err  => {
        console.log(err);
    });
    db.user.sync({ alter: true }).catch(err => {
        console.log(err);
    });
    db.schedule.sync({ alter: true }).catch(err => {
        console.log(err);
    })

    db.sequelize.sync({ force: false })
    .then(() => {
        console.log('Re-sync done.');
    }).catch(err => {
        console.log(err)
    });
}
catch(e) {
    console.log(e);
}


module.exports = db;