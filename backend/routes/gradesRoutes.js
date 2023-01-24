"use strict"

const gradesController = require('../controllers/gradesController')
const router = require('express').Router()

//--- GET GRADES BY STUDENT NUMBER SEM AND SY ROUTE ---//
router.get('/grades/:studentnumber/:semester/:schoolyear', gradesController.getGradesByStudNumSemSY)

//--- GET GRADE BY SCHEDCODE, SUBJCODE AND STUDENT NUMBER ROUTE ---//
router.get('/grades/get/:schedcode/:subjectcode/:studentnumber', gradesController.getGradeBySubjcodeSchedcodeAndStudNum)

//--- UPDATE AND COMPLETION GRADE ROUTE ---//
router.put('/grades/update/:studentnumber/:schedcode/:subjectcode/', gradesController.updateGrade)

module.exports = router