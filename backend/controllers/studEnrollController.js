"use strict"

const db = require('../config/sequelize')
const studEnrollModel = db.studEnroll

const addStudEnroll = async (req, res) => {
    const {
        studentnumber,
        semester,
        schoolyear,
        edate,
        status,
        scholarship,
        majorCourse,
        yearLevel,
        statusII,
        coursenow,
        notuitionenroll
    } = req.body;
    
    const studEnroll = {
        studentnumber: studentnumber,
        semester: semester,
        schoolyear: schoolyear,
        edate: edate,
        status: status,
        scholarship: scholarship,
        majorCourse: majorCourse,
        yearLevel: yearLevel,
        statusII: statusII,
        coursenow: coursenow,
        notuitionenroll: notuitionenroll
    }

    try {
        const createdStudEnroll = await studEnrollModel.create(studEnroll);
        res.status(201).send({ createdStudEnroll: createdStudEnroll, message: 'Enrolled Student Added.' })
    }
    catch {
        res.status(500).send({ message: 'Error Adding Enrolled Student.' })
    }
    
}

const editStudEnroll = async (req, res) => {
    const studentnumber = req.params.studentnumber;
    const {
        semester,
        schoolyear,
        edate,
        status,
        scholarship,
        majorCourse,
        yearLevel,
        statusII,
        coursenow,
        notuitionenroll
    } = req.body;

    const studEnroll = {
        semester,
        schoolyear,
        edate,
        status,
        scholarship,
        majorCourse,
        yearLevel,
        statusII,
        coursenow,
        notuitionenroll
    }

    const updatedStudEnroll = await studEnrollModel.update(studEnroll, { where: { studentnumber: studentnumber }})
}

const getStudsEnroll = async (req, res) => {
    const studsEnroll = await studEnrollModel.findAll({
        attributes: [
            'studentnumber',
            'semester',
            'schoolyear',
            'edate',
            'status',
            'scholarship',
            'majorCourse',
            'yearLevel',
            'statusII',
            'coursenow',
            'notuitionenroll'
        ]
    })

    if(studsEnroll.length > 0) {
        res.status(200).send({ message: 'Students enrolled list found.', studsEnroll: studsEnroll })
    }
    else {
        res.status(500).send({ message: 'Students enrolled list not found.' })
    }
}

const getStudEnroll = async (req, res) => {
    const studentNumber = req.params.studentnumber
    const studEnroll = await studEnrollModel.findOne({
        attributes: [
            'studentnumber',
            'semester',
            'schoolyear',
            'edate',
            'status',
            'scholarship',
            'majorCourse',
            'yearLevel',
            'statusII',
            'coursenow',
            'notuitionenroll'
        ],
        where: { studentnumber: studentNumber }
    })

    if(studEnroll) {
        res.status(200).send({ message: 'Student enrolled data found', studEnroll: studEnroll })
    }
    else {
        res.status(500).send({ message: 'Student enrolled data not found.' })
    }
}

module.exports = {
    addStudEnroll,
    editStudEnroll,
    getStudsEnroll,
    getStudEnroll
}