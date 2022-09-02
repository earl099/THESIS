"use strict"

require('dotenv').config();

module.exports = {
    user: process.env.USER,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    db: process.env.DATABASE,
    port: process.env.PORT,
    dialect: "mysql",
    pool: {
        max: 15,
        min: 0,
        acquire: 30000,        
        idle: 10000
    }
}