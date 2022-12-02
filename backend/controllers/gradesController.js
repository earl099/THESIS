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

module.exports = {
    getGradesByStudNumSemSY
}