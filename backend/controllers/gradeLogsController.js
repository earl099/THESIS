"use strict"

const db = require('../config/sequelize')
const gradeLogsModel = db.gradeLogs

const addGradeLog = async (req, res) => {
    const {
        schedcode,
        subjectcode,
        studentnumber,
        myprocess,
        mydate,
        mytime,
        ipaddress,
        pcname,
        username,
        semester,
        schoolyear
    } = req.body

    const gradeLog = {
        schedcode: schedcode,
        subjectcode: subjectcode,
        studentnumber: studentnumber,
        myprocess: myprocess,
        mydate: mydate,
        mytime: mytime,
        ipaddress: ipaddress,
        pcname: pcname,
        username: username,
        semester: semester,
        schoolyear: schoolyear
    }

    try {
        const createdGradeLog = await gradeLogsModel.create(gradeLog)
        res.status(200).send({ createdGradeLog: createdGradeLog, message: 'Grade Log Added.' })
    }
    catch {
        res.status(500).send({ message: 'Error Adding Grade Log.' })
    }
}

module.exports = {
    addGradeLog
}