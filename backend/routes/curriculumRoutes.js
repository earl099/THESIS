"use strict"

const curriculumController = require('../controllers/curriculumController');
const router = require('express').Router();

//--- CURRICULUM ADDING ROUTER ---//
router.post('/curriculum/add', curriculumController.addCurriculum);

//--- CURRICULUM MODIFICATION ROUTER ---//
router.put('/curriculum/edit/:id', curriculumController.editCurriculum);

//--- CURRICULA LIST ROUTER ---//
router.get('/curriculum/list', curriculumController.getCurricula);

//--- CURRICULUM PROFILE ROUTER ---//
router.get('/curriculum/profile/:id', curriculumController.getCurriculum);

module.exports = router;