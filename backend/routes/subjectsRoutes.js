"use strict"

const subjectsController = require('../controllers/subjectsController')
const router = require('express').Router()

//--- ADD SUBJECT ROUTE ---//
router.post('/subject/add', subjectsController.addSubject)

//--- EDIT SUBJECT ROUTE ---//
router.put('/subject/edit/:subjectcode', subjectsController.editSubject)

//--- GET SUBJECT ROUTE ---//
router.get('/subject/get/:subjectcode', subjectsController.getSubject)

//--- GET SUBJECT TITLE ROUTE ---//
router.get('/subject/get/title/:subjectcode', subjectsController.getSubjTitle)

//--- GET SCHOOLYEAR ---//
router.get('/subject/get/schoolyear', subjectsController.getSchoolyear)

//--- DELETE SUBJECT ROUTE ---//
router.delete('/subject/delete/:subjectcode', subjectsController.deleteSubject)

module.exports = router;