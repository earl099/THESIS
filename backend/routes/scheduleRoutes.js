"use strict"

const scheduleController = require('../controllers/scheduleController');
const router = require('express').Router();

//--- SCHEDULE ADDING ROUTER ---//
router.post('/schedule/add', scheduleController.addSchedule);

//--- SCHEDULE MODIFICATION ROUTER ---//
router.put('/schedule/edit/:schedcode', scheduleController.editSchedule);

//--- SCHEDULE LIST ROUTER ---//
router.get('/schedule/list', scheduleController.getSchedules);

//--- SCHEDULE PROFILE ROUTER ---//
router.get('/schedule/:schedcode', scheduleController.getSchedule);

module.exports = router;