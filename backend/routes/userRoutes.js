"use strict"

const { check, body, validationResult } = require('express-validator');
const userController = require('./../controllers/userController');
const router = require('express').Router();

//--- ADDING USER ROUTER ---//
router.post('/account/add', 
    [
        check('username').not().isEmpty().withMessage('Input a username.'),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    ],
    userController.addAccount
);

//--- LOGIN ROUTERS ---//
router.post('/login/user', userController.userLogin);
router.post('/login/admin', userController.adminLogin);

//-- USER LIST AND PROFILE ROUTER ---//
router.get('/admin/user/list', userController.getUsers);
router.get('/admin/user/:collegeID', userController.getUser);

//--- USER EDIT ROUTER ---//
router.put('/admin/user/edit/:collegeID', userController.editUser);

//--- USER DELETE ROUTER ---//
router.delete('/admin/user/delete/:collegeID', userController.deleteUser);

module.exports = router;