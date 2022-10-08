"use strict"

const currContentController = require('../controllers/currContentController');
const router = require('express').Router();

//--- CURRICULUM CONTENT ADDING ROUTER ---//
router.post('/curriculum/content/add', currContentController.addCContent);

//--- CURRICULUM CONTENT MODIFICATION ROUTER ---//
router.put('/curriculum/content/edit/:refid/:id', currContentController.editCContent);

//--- CURRICULUM CONTENT PAGE ROUTER ---//
router.get('/curriculum/content/page/:id', currContentController.getCContent);

//---CURRICULUM CONTENT LIST BY REFID, YEAR AND SEM ROUTER
router.get('/curriculum/content/list/:refid/:yearlevel/:semester', currContentController.getCContentbyRefIDYearAndSem)

module.exports = router;