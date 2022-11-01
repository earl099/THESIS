"use strict"

const studentController = require('../controllers/studentController');
const router = require('express').Router();

//--- STUDENT ADDING ROUTER ---//
router.post('/student/add', studentController.addStudent);

//--- STUDENT EDITING ROUTER ---//
router.put('/student/edit/:studentNumber', studentController.editStudent);

//--- STUDENT LIST ROUTER ---//
router.get('/student/list', studentController.getStudents);

//--- STUDENT PROFILE ROUTER ---//
router.get('/student/profile/:studentNumber', studentController.getStudent)

//--- COURSE MODIFICATION ROUTER ---//
router.put('/student/edit/course/:studentNumber', studentController.editCourse)

module.exports = router;