"use strict"

const divOfFeesController = require('../controllers/divOfFeesController')
const router = require('express').Router()

//--- ADD FEES ROUTE ---//
router.post('/fees/add', divOfFeesController.addFees)

//--- GET FEES ROUTE ---//
router.get('/fees/:studentnumber/:semester/:schoolyear', divOfFeesController.getFees)

//--- GET PAID FEES ROUTE ---//
router.get('/fees/paid/:studentnumber/:semester/:schoolyear', divOfFeesController.getPaidFees)

//--- EDIT FEES ROUTE ---//
router.put('/fees/edit/:studentnumber/:semester/:schoolyear', divOfFeesController.editFees)

//--- EDIT PAID FEES ROUTE ---//
router.put('/fees/edit/paid/:studentnumber/:semester/:schoolyear', divOfFeesController.editPaidFees)

module.exports = router;