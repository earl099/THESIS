"use strict"

const subjEnrollController = require('../controllers/subjEnrollController')
const router = require('express').Router()

//--- ADD SUBJECTS ENROLLED ROUTE ---//
router.post('/validation/add', subjEnrollController.addSubjEnrolled)

//--- GET SUBJECTS ENROLLED ROUTE BY STUDENT NUMBER ---//
router.get('/validation/get/:studentnumber/:semester/:schoolyear', subjEnrollController.getSubjsEnrolled)

//--- DELETE SUBJECT ENROLLED ROUTE ---//
router.delete('/validation/drop/:studentnumber/:schedcode', subjEnrollController.deleteSubjEnrolled)

module.exports = router;