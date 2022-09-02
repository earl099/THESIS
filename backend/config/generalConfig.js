const bcrypt = require('bcryptjs');
const { password } = require('./dbConfig');
const saltRounds = bcrypt.genSaltSync(10);

const encryptPassword = function (password) {
    return bcrypt.hashSync(password, saltRounds);
}

const comparePassword = function (password, userPassword) {
    return bcrypt.compareSync(password, userPassword);
}

module.exports = {
    encryptPassword,
    comparePassword
}