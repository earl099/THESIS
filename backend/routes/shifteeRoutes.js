"use strict"

const shifteeController = require('../controllers/shifteeController')
const router = require('express').Router()

//--- SHIFTEE ADDING ROUTE ---//
router.post('/shiftee/add', shifteeController.addShiftee);

//--- SHIFTEE MODIFICATION ROUTE ---//
router.put('/shiftee/edit/:studentnumber', shifteeController.editShiftee);

//--- SHIFTEE LIST ROUTE ---//
router.get('/shiftee/list', shifteeController.getShiftees);

//--- SHIFTEE PROFILE ROUTE ---//
router.get('/shiftee/:studentnumber', shifteeController.getShiftee);

//--- REPORTS ---//
//--- GET SCHOOLYEAR ---//
router.get('/shiftee/get/schoolyear', shifteeController.getSchoolyear)

//--- SHIFTEE SEARCH ---//
router.post('/report/shiftee', shifteeController.advShifteeSearch)

module.exports = router;