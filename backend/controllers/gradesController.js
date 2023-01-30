"use strict"

const db = require('../config/sequelize')
const gradesModel = db.grades
const gradeLogsModel = db.gradeLogs

//--- GET GRADES BY STUDENT NUMBER, SEMESTER, SCHOOLYEAR ---//
const getGradesByStudNumSemSY = async (req, res) => {
    const studentnumber = req.params.studentnumber
    const semester = req.params.semester
    const schoolyear = req.params.schoolyear

    const grades = await gradesModel.findAll({
        attributes: [
            'schedcode',
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

//--- GET GRADES BY SUBJ, SCHED AND STUD NUM ---//
const getGradeBySubjcodeSchedcodeAndStudNum = async (req, res) => {
    const subjectcode = req.params.subjectcode
    const schedcode = req.params.schedcode
    const studentnumber = req.params.studentnumber
    
    const grade = await gradesModel.findOne({
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
            subjectcode: subjectcode,
            schedcode: schedcode,
            studentnumber: studentnumber,
        }
    })

    if(grade) {
        res.status(200).send({ message: 'Grade found', grade: grade })
    }
    else {
        res.status(500).send({ message: 'Grade not found' })
    }
}

//--- GET UNIQUE SCHOOLYEAR BY STUDENTNUMBER ---//
const getSchoolyear = async (req, res) => {
    const studentnumber = req.params.studentnumber

    const schoolyear = await gradesModel.findAll({
        attributes: [
            [
                db.sequelize.fn(
                    'DISTINCT', 
                    db.sequelize.col('schoolyear')
                ), 
                'schoolyear'
            ]
        ],
        where: {
            studentnumber: studentnumber
        }
    })

    if(schoolyear.length > 0) {
        res.status(200).send({ schoolyear: schoolyear })
    }
}

//--- UPDATE GRADE ---//
const updateGrade = async (req, res) => {
    const studentnumber = req.params.studentnumber
    const schedcode = req.params.schedcode
    const subjectcode = req.params.subjectcode
    let transaction = await db.sequelize.transaction()

    const {
        mygrade,
        mygradeedit,
        mygradeeditdate,
        makeupgrade,
        makeupencoder,
        makeupdate,

        //logs data
        ipaddress,
        pcname,
        username,
        semester,
        schoolyear
    } = req.body

    const grade = {
        mygrade,
        mygradeedit,
        mygradeeditdate,
        makeupgrade,
        makeupencoder,
        makeupdate
    }

    try {
        let date = new Date()

        const updatedGrade = await gradesModel.update(grade, { where: { 
            studentnumber: studentnumber,
            schedcode: schedcode,
            subjectcode:subjectcode
        }}, { transaction })
        
        const gradeObject = {
            schedcode: schedcode,
            subjectcode: subjectcode,
            studentnumber: studentnumber,
            myprocess: 'UPDATE GRADE',
            mydate: date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate(),
            mytime: date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
            ipaddress,
            pcname,
            username,
            semester,
            schoolyear

        }

        const gradeLog = await gradeLogsModel.create(gradeObject, { transaction })

        transaction.commit()

        res.status(200).send({ message: 'Grade Updated Successfully', updatedGrade: updatedGrade, gradeLog: gradeLog })
    } catch (error) {
        transaction.rollback()
        res.status(500).send({ message: 'Grade Update Failed' })
    }
}

module.exports = {
    getGradesByStudNumSemSY,
    getGradeBySubjcodeSchedcodeAndStudNum,
    getSchoolyear,
    updateGrade
}