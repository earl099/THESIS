"use strict"

const scholarshipController = require('../controllers/scholarshipController')
const router = require('express').Router()

//--- GET SCHOLAARSHIPS ROUTE ---//
router.get('/scholarship/list', scholarshipController.getScholarships)

//--- GET SCHOLARSHIP ROUTE ---//
router.get('/scholarship/:scholarship', scholarshipController.getScholarshipDetails)

module.exports = router