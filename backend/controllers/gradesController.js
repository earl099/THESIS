"use strict"

const db = require('../config/sequelize')
const gradesModel = db.grades

//--- GET GRADES BY STUDENT NUMBER, SEMESTER, SCHOOLYEAR ---//
const getGradesByStudNumSemSY = async (req, res) => {
    const studentnumber = req.params.studentnumber
    const semester = req.params.semester
    const schoolyear = req.params.schoolyear

    const grades = await gradesModel.findAll({
        attributes: [
            'subjectcode',
            'mygrade',
            'mygradeedit',
            'mygradeeditdate',
            'makeupgrade',
            'makeupencoder',
            'makeupdate',
            'units'
        ],
        where: { 
            studentnumber: studentnumber, 
            semester: semester, 
            schoolyear: schoolyear
        }
    })

    if(grades.length > 0) {
        res.status(200).send({ message: 'Grades found', grades: grades })
    }
    else {
        res.status(404).send({ message: 'Grades not found' })
    }
}

const getGradeBySubjcodeSchedcodeAndStudNum = async (req, res) => {
    const subjectcode = req.params.subjectcode
    const schedcode = req.params.schedcode
    const studentnumber = req.params.studentnumber
    
    const grade = await gradesModel.findOne({
        where: {
            subjectcode: subjectcode,
            schedcode: schedcode,
            studentnumber: studentnumber
        }
    })

    if(grade) {
        res.status(200).send({ message: 'Grade found', grade: grade })
    }
    else {
        res.status(500).send({ message: 'Grade not found' })
    }
}

const updateGrade = async (req, res) => {
    const studentnumber = req.params.studentnumber
    const schedcode = req.params.schedcode
    const subjectcode = req.params.subjectcode

    const {
        mygrade,
        mygradeedit,
        mygradeeditdate,
        makeupgrade,
        makeupencoder,
        makeupdate
    } = req.body

    const grade = {
        mygrade,
        mygradeedit,
        mygradeeditdate,
        makeupgrade,
        makeupencoder,
        makeupdate
    }

    const updatedGrade = await gradesModel.update(grade, { where: { 
        studentnumber: studentnumber,
        schedcode: schedcode,
        subjectcode:subjectcode
    }})

    if(grade) {
        res.status(200).send({ message: 'Grade updated', updatedGrade: updatedGrade })
    }
    else {
        res.status(500).send({ message: 'Grade not updated' })
    }
}

module.exports = {
    getGradesByStudNumSemSY,
    getGradeBySubjcodeSchedcodeAndStudNum,
    updateGrade
}