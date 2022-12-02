"use strict"

const gradeLogController = require('../controllers/gradeLogsController')
const router = require('express').Router()

//--- GRADE LOG ADDING ROUTE ---//
router.post('/logs/grade/add', gradeLogController.addGradeLog)

module.exports = router