"use strict"

const { check, body, validationResult } = require('express-validator');
const userController = require('./../controllers/userController');
const router = require('express').Router();

//--- ADDING USER FUNCTION ---//
router.post('/account/add', 
    [
        check('username').not().isEmpty().withMessage('Input a username.'),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    ],
    userController.addAccount
);

//--- LOGIN FUNCTIONS ---//
router.post('/login/user', userController.userLogin);
router.post('/login/admin', userController.adminLogin);

//-- GET FUNCTION ---//
router.get('/admin/user/list', userController.getUsers);
router.get('/admin/user/:collegeID', userController.getUser);

//--- EDIT FUNCTION ---//
router.put('/admin/user/edit/:collegeID', userController.editUser);

//--- DELETE FUNCTION ---//
router.delete('/admin/user/delete/:collegeID', userController.deleteUser);

module.exports = router;