"use strict"

const assessListController = require('../controllers/assessListController')
const router = require('express').Router()

//--- GET ALL ASSESSED STUDENTS BY SEM AND SY ROUTE ---//
router.get('/assess_list/:semester/:schoolyear', assessListController.getAllAssessedBySemAndSY)

//--- GET ALL ASSESSED STUDENT RECORDS BY STUDNUM ---//
router.get('/assess_list/records/:studentnumber', assessListController.getAllAssessedStudRecordsByStudNum)

//--- GET CURRENT ASSESSED STUDENT RECORD BY STUDNUM, SEM AND SY ---//
router.get('/assess_list/current/:studentnumber/:semester/:schoolyear', assessListController.getAssessedStudByStudNumSemAndSY)

//--- EDIT SCHOLARSHIP ---//
router.put('/assess_list/edit/scholarship/:studentNumber/:semester/:schoolyear', assessListController.editScholarship)

//--- ASSESSED LIST REPORT ---//
router.post('/report/get/type/assessed', assessListController.assessedReport)

//--- GET SCHOOLYEAR ---//
router.get('/report/get/assessed/schoolyear', assessListController.getSchoolyear)

module.exports = router