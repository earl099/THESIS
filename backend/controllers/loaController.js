"use strict"

const db = require('../config/sequelize')
const os = require('os')
const loaModel = db.loa
const processLogModel = db.processLogs
const courseModel = db.course

const addLoa = async (req, res) => {
    let transaction = await db.sequelize.transaction()
    let pcname = os.hostname()
    let date = new Date()
    let timestamp = String(
        date.getFullYear() + '-' +
        (date.getMonth() + 1) + '-' +
        date.getDate() + ' ' + 
        date.getHours() + ':' +
        date.getMinutes() + ':' +
        date.getSeconds()
    )

    const {
        //loa data
        studentnumber,
        course,
        semester,
        schoolyear,
        encoder,

        //process log data
        username,
        ipaddress,        
    } = req.body

    const loaObject = {
        studentnumber,
        course,
        semester,
        schoolyear,
        encoder,
        dateencoded: timestamp
    }

    const processLogObject = {
        username,
        ipaddress,
        pcname: pcname,
        studentnumber,
        type: 'Add LOA',
        description: `Added ${studentnumber} to students with Leave of Absence`
    }

    try {
        
        const createdLoa = await loaModel.create(loaObject, { transaction })
        const createdProcessLog = await processLogModel.create(processLogObject, { transaction })
        
        res.status(200).send({ message: 'LOA created successfully', createdLoa: createdLoa, createdProcessLog: createdProcessLog })
        transaction.commit()
    } catch (error) {
        
        res.status(500).send({ error: error, message: 'LOA creation failed'})
        transaction.rollback()
    }
}

const adminGetLoa = async (req, res) => {
    const studsWithLoa = await loaModel.findAll({
        attributes: [
            'studentnumber',
            'course',
            'semester',
            'schoolyear',
            'isActive',
            'encoder',
            'dateencoded'
        ]
    })

    if(studsWithLoa.length > 0) {
        res.status(200).send({ message: 'Students with LOA found.', studsWithLoa: studsWithLoa })
    }
    else {
        res.status(500).send({ message: 'Students with LOA not found' })
    }
}

const userGetLoa = async (req, res) => {
    const collegeID = req.params.collegeID

    const courseList = courseModel.findAll({
        attributes: [ 'courseCode' ],
        where: { courseCollege: collegeID }
    })

    const studsWithLoa = await loaModel.findAll({
        attributes: [
            'studentnumber',
            'course',
            'semester',
            'schoolyear',
            'isActive',
            'encoder',
            'dateencoded'
        ],
        where: db.sequelize.or({ course: courseList })
    })

    if(studsWithLoa.length > 0) {
        res.status(200).send({ message: 'Students with LOA found.', studsWithLoa: studsWithLoa })
    }
    else {
        res.status(500).send({ message: 'Students with LOA not found' })
    }
}

const deleteLoa = async (req, res) => {
    let transaction = await db.sequelize.transaction()
    let pcname = os.hostname()
    const studentnumber = req.params.studentnumber
    const { username, ipaddress } = req.body

    let processLogObject = {
        username,
        ipaddress,
        pcname: pcname,
        studentnumber,
        type: 'Delete LOA',
        description: `Deleted ${studentnumber}'s record to students with Leave of Absence`
    }

    try {
        const deletedLoa = await loaModel.destroy({ where: { studentnumber: studentnumber }}, { transaction })
        const createdProcessLog = await processLogModel.create(processLogObject, { transaction })
        
        
        res.status(200).send({ message: `${studentnumber}'s LOA Record deleted successfully`, deletedLoa: deletedLoa, createdProcessLog: createdProcessLog })
        transaction.commit()
    } catch (error) {
        res.status(500).send({ message: 'Record not deleted' })
        transaction.rollback()
    }
    
}

module.exports = {
    addLoa,
    adminGetLoa,
    userGetLoa,
    deleteLoa
}