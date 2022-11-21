"use strict"

const gradesController = require('../controllers/gradesController')
const router = require('express').Router()

//--- GET GRADES BY STUDENT NUMBER SEM AND SY ROUTE ---//
router.get('/grades/:studentnumber/:semester/:schoolyear', gradesController.getGradesByStudNumSemSY)

module.exports = router