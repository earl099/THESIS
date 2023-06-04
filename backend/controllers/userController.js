"use strict"

const db = require('../config/sequelize');
const jwt = require('jsonwebtoken');
const userModel = db.user;
const generalConfig = require('../config/generalConfig');
const { Sequelize } = require('../config/sequelize');

//--- ADD USER ---//
const addAccount = async (req, res) => {
    const { collegeID, username, email, password, isAdmin } = req.body;
    let passwordHash = generalConfig.encryptPassword(password);
    
    const user = {
        collegeID: collegeID,
        username: username,
        email: email,
        password: password,
        hashedPassword: passwordHash,
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

//--- USER LOGIN ---//
const userLogin = async (req, res) => {
    const { username, password } = req.body;

    if(username) {
        let passwordMatchFlag
        let Op = Sequelize.Op;
        const user = await userModel.findOne({
            attributes: [
                'collegeID',
                'username',
                'password',
                'hashedPassword'
            ],
            where: { [Op.not]: [{ collegeID: 'UNIV' }] , isAdmin: 0 }
        });

        if(user) {
            passwordMatchFlag = generalConfig.comparePassword(password, user.hashedPassword);
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

//--- ADMIN LOGIN ---//
const adminLogin = async (req, res) => {
    const { username, password } = req.body;

    if(username) {
        let passwordMatchFlag;

        try{
            const user = await userModel.findOne({
                attributes: [
                    'collegeID',
                    'username',
                    'password',
                    'hashedPassword'
                ],
                where: { collegeID: 'UNIV', isAdmin: 1 }
            });
            
            if(user) {
                passwordMatchFlag = generalConfig.comparePassword(password, user.hashedPassword);
            }
            
            if(!user) {
                return res.status(401).send({ message: 'Error Logging in.' });
            }
            else if(passwordMatchFlag) {
                const jwToken = jwt.sign({ username: user.username, collegeID: user.collegeID }, process.env.JWT_PRIVATE_KEY, { expiresIn: '30m' });
                user.password = undefined;
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

//--- EDIT USER ---//
const editUser = async (req, res) => {
    const collegeID = req.params.collegeID;
    const { username, password, email } = req.body;
    let passwordHash = generalConfig.encryptPassword(password);
    const user = {
        username, 
        password: passwordHash, 
        email
    }
    const updatedUser = await userModel.update(user, {where: {collegeID: collegeID}});

    if(updatedUser[0] > 0) {
        res.status(200).send({ message: 'User updated successfully.', updatedUser: updatedUser, user: user });
    }
    else {
        res.status(404).send({ message: 'Could not update user.' });
    }
}

//--- GET ALL USERS ---//
const getUsers = async (req, res) => {
    //if(!req.query.size || !req.query.page) { return res.status(500).send({ message: 'Page number and page size required.' }); }
    
    let pageSize = +req.query.size;
    if(pageSize > 100) {
        pageSize = 100;
    }

    let pageOffset = ((+req.query.page - 1) * +req.query.size);

    const users = await userModel.findAll({
        attributes: [ 'collegeID', 'username', 'email', 'isAdmin' ],
    });

    if(users.length > 0) {
        res.status(200).send({ message: 'Users found.', users: users })
    }
    else {
        res.status(404).send({ message: 'Users not found.' });
    }
}

//--- GET A USER ---//
const getUser = async (req, res) => {
    const collegeID = req.params.collegeID;
    const user = await userModel.findOne({
        attributes: [ 'collegeID', 'username', 'password', 'email', 'isAdmin' ],
        where: { collegeID: collegeID }
    });

    if(user) {
        res.status(200).send({ message: 'User found.', user: user });
    }
    else {
        res.status(404).send({ message: 'User not found.' });
    }
}

//--- DELETE USER ---//
const deleteUser = async (req, res) => {
    const collegeID = req.params.collegeID;
    const deletedUser = await userModel.destroy({ where: { collegeID: collegeID } });

    if(deletedUser) {
        res.status(200).send({ message: 'User deleted successfully.', deletedUser: deletedUser })
    }
    else {
        res.status(404).send({ message: 'User does not exist.' });
    }
}

module.exports = {
    addAccount,
    userLogin,
    adminLogin,
    editUser,
    getUsers,
    getUser,
    deleteUser
}