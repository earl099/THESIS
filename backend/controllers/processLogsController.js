"use strict"

const db = require('../config/sequelize')
const processLogsModel = db.processLogs

const addProcessLog = async (req, res) => {
    const {
        username,
        ipaddress,
        pcname,
        studentnumber,
        type,
        description
    } = req.body

    const processLog = {
        username: username,
        ipaddress: ipaddress,
        pcname: pcname,
        studentnumber: studentnumber,
        type: type,
        description: description
    }

    try {
        const createdProcessLog = processLogsModel.create(processLog)
        res.status(200).send({ message: 'Log Added.', createdProcessLog: createdProcessLog })
    } 
    catch {
        res.status(500).send({ message: 'Error Adding Log.' })
    }
}

module.exports = { addProcessLog }