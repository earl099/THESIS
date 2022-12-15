"use strict"

const studEnrollController = require('../controllers/studEnrollController')
const router = require('express').Router()

//--- STUDENT ENROLLED ADDING ROUTE ---//
router.post('/student_enroll/add', studEnrollController.addStudEnroll)

//--- STUDENT ENROLLED MODIFICATION ROUTE ---//
router.put('/student_enroll/edit/:studentnumber/:semester/:schoolyear', studEnrollController.editStudEnroll)

//--- STUDENT ENROLLED LIST ROUTE ---//
router.get('/student_enroll/list/:semester/:schoolyear', studEnrollController.getStudsEnroll)

//--- STUDENT ENROLLED DATA ROUTE ---//
router.get('/student_enroll/:studentnumber/:semester/:schoolyear', studEnrollController.getStudEnroll)

//--- TRANSACTION ROUTE ---//
router.post('/validate/:studentnumber/:semester/:schoolyear', studEnrollController.fullTransaction)

module.exports = router