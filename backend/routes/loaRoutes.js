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

//--- REPORTS ---//
//--- GET SCHOOLYEAR ---//
router.get('/get/schoolyear/loa', loaController.getSchoolyear)

//--- LOA SEARCH ---//
router.post('/get/report/loa', loaController.advLoaSearch)

module.exports = router