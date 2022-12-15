"use strict"

const feesController = require('../controllers/feesController')
const router = require('express').Router()

router.get(
    '/fees/course/:course/admitted/:semesteradmitted_:yearadmitted/current/:semester_:schoolyear', 
    feesController.getFeesByCourseSemAdmittedYearAdmittedSemAndSY
)

module.exports = router