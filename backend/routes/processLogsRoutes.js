"use strict"

const processLogsController = require('../controllers/processLogsController')
const router = require('express').Router()

//--- ADD LOG ROUTE ---//
router.post('/log/process/add', processLogsController.addProcessLog)

module.exports = router