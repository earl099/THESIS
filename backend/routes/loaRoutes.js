"use strict"

const loaController = require('../controllers/loaController')
const router = require('express').Router()

//--- ADDING LOA RECORD ---//
router.post('/loa/add', loaController.addLoa)

//--- ADMIN LOA SEARCH ---//
router.get('/loa/get/all', loaController.adminGetLoa)

//--- USER LOA SEARCH ---//
router.get('/loa/get/:collegeID', loaController.userGetLoa)

//--- LOA DELETION ---//
router.post('/loa/delete/:studentnumber', loaController.deleteLoa)

module.exports = router