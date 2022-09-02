"use strict"

const { check, body, validationResult } = require('express-validator');
const userController = require('./../controllers/userController');
const router = require('express').Router();

router.post('/account/add', 
    [
        check('username').not().isEmpty().withMessage('Input a username.'),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    ],
    userController.addAccount
);

router.post('/login/user', userController.userLogin);
router.post('/login/admin', userController.adminLogin);

module.exports = router;