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

//--- SEARCH SCHEDULE BY SEM, SY ---//
router.get('/schedule/search/:semester/:schoolyear', scheduleController.getSchedulesBySemSY)

//--- GET SCHOOLYEAR ---//
router.get('/schedule/get/schoolyear', scheduleController.getSchoolyear)

//--- DELETE SCHEDULE ---//
router.delete('/schedule/delete/:schedcode', scheduleController.deleteSchedule)

module.exports = router;