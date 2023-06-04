"use strict"

const assessListController = require('../controllers/assessListController')
const router = require('express').Router()

//--- GET ALL ASSESSED STUDENTS BY SEM AND SY ROUTE ---//
router.get('/assess_list/:semester/:schoolyear', assessListController.getAllAssessedBySemAndSY)

//--- GET ALL ASSESSED STUDENT RECORDS BY STUDNUM ---//
router.get('/assess_list/records/:studentnumber', assessListController.getAllAssessedStudRecordsByStudNum)

//--- GET CURRENT ASSESSED STUDENT RECORD BY STUDNUM, SEM AND SY ---//
router.get('/assess_list/current/:studentnumber/:semester/:schoolyear', assessListController.getAssessedStudByStudNumSemAndSY)

module.exports = router