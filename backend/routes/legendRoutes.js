"use strict"

const legendController = require('../controllers/legendController');
const router = require('express').Router();

//--- LEGEND ADDING ROUTER ---//
router.post('/legend/add', legendController.addLegend);

//--- LEGEND FETCHING ROUTER ---//
router.get('/legend/list', legendController.getLegend);

//--- LEGEND MODIFICATION ROUTER ---//
router.put('/legend/edit', legendController.editLegend);

module.exports = router;