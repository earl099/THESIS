"use strict"

const db = require('../config/sequelize');
const jwt = require('jsonwebtoken');
const userModel = db.user;
const generalConfig = require('../config/generalConfig');
const { Sequelize } = require('../config/sequelize');

const addAccount = async (req, res, next) => {
    const { collegeID, username, email, password, isAdmin } = req.body;
    let passwordHash = generalConfig.encryptPassword(password);
    
    const user = {
        collegeID: collegeID,
        username: username,
        email: email,
        password: passwordHash,
        isAdmin: isAdmin
    }

    try {
        const createdUser = await userModel.create(user);

        res.status(201).send({ createdUser: createdUser, message: 'Account Added.' });
    }
    catch {
        res.status(500).send({ message: 'Account already exists.' })
    }
}

const userLogin = async (req, res, next) => {
    const { username, password } = req.body;

    if(username) {
        let passwordMatchFlag
        let Op = Sequelize.Op;
        const user = await userModel.findOne({
            attributes: [
                'username',
                'password'
            ],
            where: { [Op.not]: [{ collegeID: 'UNIV' }] , isAdmin: 0 }
        });

        if(user) {
            passwordMatchFlag = generalConfig.comparePassword(password, user.password);
        }

        if(passwordMatchFlag) {
            const jwToken = jwt.sign({ username: user.username, collegeID: user.collegeID }, process.env.JWT_PRIVATE_KEY, { expiresIn: '30m' });
            user.password = undefined;
            return res.status(200).send({ message: 'Logged in successfully', user, jwToken, expirationDuration: 1800 });
        }
        else {
            return res.status(401).send({ message: 'Error Logging in.' });
        }
    }
}

const adminLogin = async (req, res, next) => {
    const { username, password } = req.body;

    if(username) {
        let passwordMatchFlag;

        try{
            const user = await userModel.findOne({
                attributes: [
                    'username',
                    'password'
                ],
                where: { collegeID: 'UNIV', isAdmin: 1 }
            });
            
            if(user) {
                passwordMatchFlag = generalConfig.comparePassword(password, user.password);
            }
            
            if(!user) {
                return res.status(401).send({ message: 'Error Logging in.' });
            }
            else if(passwordMatchFlag) {
                const jwToken = jwt.sign({ username: user.username, collegeID: user.collegeID }, process.env.JWT_PRIVATE_KEY, { expiresIn: '30m' });
                return res.status(200).send({ message: 'Logged in successfully', user, jwToken, expirationDuration: 1800 });
            }
            else {
                return res.status(401).send({ message: 'Error Logging in.' });
            }
        }
        catch(e) {
            console.log('Error');
        }
        
        
       
    }
}

module.exports = {
    addAccount,
    userLogin,
    adminLogin
}