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
router.post('/validate/:studentnumber/:semester/:schoolyear', studEnrollController.addTransaction)

//--- ADD SUBJECT ROUTE ---//
router.post('/validate/add/:studentnumber/:semester/:schoolyear', studEnrollController.addSubjTransaction)

//--- DROP SUBJECT ROUTE ---//
router.post('/validate/drop/:studentnumber/:semester/:schoolyear', studEnrollController.dropSubjTransaction)

//--- CHANGE SUBJECT ROUTE ---//
router.post('/validate/change/:studentnumber/:semester/:schoolyear', studEnrollController.changeSubjTransaction)

module.exports = router