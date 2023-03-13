"use strict"

const reportController = require('../controllers/reportController')
const router = require('express').Router()

//--- GET ALL COLLEGES ---//
router.get('/report/colleges/get', reportController.getColleges)

//--- GET ALL COURSES BY COLLEGE ---//
router.get('/report/courses/get/:collegeCode', reportController.getCourses)

module.exports = router