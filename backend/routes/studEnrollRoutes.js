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

//--- GET SCHOOLYEAR OF STUDS ENROLLED ---//
router.get('/student_enroll/get/schoolyear', studEnrollController.getSchoolyear)

//--- ADDING AND DROPPING ROUTES WILL BE USED FOR CHANGING SUBJECTS ---//
//--- ADD SUBJECT ROUTE ---//
router.post('/validate/add/:studentnumber/:semester/:schoolyear', studEnrollController.addSubjTransaction)

//--- DROP SUBJECT ROUTE ---//
router.post('/validate/drop/:studentnumber/:semester/:schoolyear', studEnrollController.dropSubjTransaction)

//--- REPORTS ---//
//--- GET SCHOOLYEAR ---//
router.get('/stud_enroll/get/schoolyear', studEnrollController.getSchoolyear)

//--- SEARCH STUDENTS ENROLLED ---//
router.post('/report/stud_enroll', studEnrollController.searchEnrolled)

module.exports = router