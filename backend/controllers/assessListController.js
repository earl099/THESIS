"use strict"

const db = require('../config/sequelize')
const assessListModel = db.assessList

//--- GET ALL ASSESSED STUDENTS BY SCHOOL YEAR AND SEMESTER ---//
const getAllAssessedBySemAndSY = async (req, res) => {
    const semester = req.params.semester
    const schoolyear = req.params.schoolyear

    const assessedStuds = await assessListModel.findAll({
        attributes: [
            'id',
            'studentnumber',
            'semester',
            'schoolyear',
            'scholarship',
            'yearLevel',
            'majorCourse',
            'statusII'
        ],
        where: { semester: semester, schoolyear: schoolyear }
    })

    if(assessedStuds.length > 0) {
        res.status(200).send({ message: 'Assessed Students Found.', assessedStuds: assessedStuds })
    }
    else {
        res.status(404).send({ message: 'Assessed Students not found.' })
    }
}

//--- GET ALL ASSESSED STUDENT RECORDS BY STUDENT NUMBER ---//
const getAllAssessedStudRecordsByStudNum = async (req, res) => {
    const studentnumber = req.params.studentnumber

    const assessedStudRecords = await assessListModel.findAll({
        attributes: [
            'id',
            'studentnumber',
            'semester',
            'schoolyear',
            'scholarship',
            'yearLevel',
            'majorCourse',
            'statusII'
        ],
        where: { studentnumber: studentnumber }
    })

    if(assessedStudRecords.length > 0) {
        res.status(200).send({ message: 'Assessed Student Records Found.', assessedStudRecords: assessedStudRecords })
    }
    else {
        res.status(404).send({ message: 'Assessed Student Records not found.' })
    }
}

//--- GET ASSESSED STUDENT BY STUDENT NUMBER, SEM, AND SCHOOL YEAR ---//
const getAssessedStudByStudNumSemAndSY = async (req, res) => {
    const studentnumber = req.params.studentnumber
    const semester = req.params.semester
    const schoolyear = req.params.schoolyear

    const assessedStud = await assessListModel.findOne({
        attributes: [
            'id',
            'studentnumber',
            'semester',
            'schoolyear',
            'scholarship',
            'yearLevel',
            'majorCourse',
            'statusII'
        ],
        where: { studentnumber: studentnumber, semester: semester, schoolyear: schoolyear }
    })

    if(assessedStud) {
        req.status(200).send({ message: 'Assessed Student found.', assessedStud: assessedStud })
    }
    else {
        res.status(500).send({ message: 'Error finding Assessed Student.' })
    }
}

module.exports = {
    getAllAssessedBySemAndSY,
    getAllAssessedStudRecordsByStudNum,
    getAssessedStudByStudNumSemAndSY
}