"use strict"

const studEnrollController = require('../controllers/studEnrollController')
const router = require('express').Router()

//--- STUDENT ENROLLED ADDING ROUTE ---//
router.post('/student_enroll/add', studEnrollController.addStudEnroll)

//--- STUDENT ENROLLED MODIFICATION ROUTE ---//
router.put('/student_enroll/edit/studentnumber', studEnrollController.editStudEnroll)

//--- STUDENT ENROLLED LIST ROUTE ---//
router.get('/student_enroll/list', studEnrollController.getStudsEnroll)

//--- STUDENT ENROLLED DATA ROUTE ---//
router.get('/student_enroll/:studentnumber', studEnrollController.getStudEnroll)

module.exports = router