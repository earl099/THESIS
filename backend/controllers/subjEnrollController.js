"use strict"

const db = require('../config/sequelize')
const subjEnrollModel = db.subjEnroll

//--- ADD SUBJECT ENROLLED ---//
const addSubjEnrolled = async (req, res) => {
    const {
        studentnumber,
        schedcode,
        edate,
        status,
        semester,
        schoolyear,
        evaluate,
    } = req.body

    const subjEnrolled = {
        studentnumber:studentnumber,
        schedcode: schedcode,
        edate: edate,
        status: status,
        semester: semester,
        schoolyear: schoolyear,
        evaluate: evaluate,
    }

    try {
        const createdSubjEnrolled = subjEnrollModel.create(subjEnrolled)
        res.status(201).send({ message: 'Student\'s subject enrolled data added.', createdSubjEnrolled: createdSubjEnrolled })
    }
    catch {
        res.status(500).send({ message: 'Error adding data.' });
    }
}

//--- GET SUBJECTS ENROLLED ---//
const getSubjsEnrolled = async (req, res) => {
    const studentnumber = req.params.studentnumber
    const subjsEnrolled = await subjEnrollModel.findAll({
        attributes: [
            studentnumber,
            schedcode,
            edate,
            status,
            semester,
            schoolyear,
            evaluate
        ],
        where: { studentnumber: studentnumber }
    })

    if(subjsEnrolled.length > 0) {
        res.status(200).send({ message: `Subjects enrolled for student number ${studentnumber}`, subjsEnrolled: subjsEnrolled })
    } 
    else {
        res.status(404).send({ message: 'Data not found.' });
    }
}

//--- DELETE SUBJECT ENROLLED ---//
const deleteSubjEnrolled = async (req, res) => {
    const schedcode = req.params.schedcode
    const studentnumber = req.params.studentnumber
    const deletedSubjEnroll = await subjEnrollModel.destroy({ where: { schedcode: schedcode, studentnumber: studentnumber }})

    if(deletedSubjEnroll) {
        res.status(200).send({ message: 'Subject enrolled deleted successfully.', deletedSubjEnroll: deletedSubjEnroll })
    }
    else {
        res.status(404).send({ message: 'Data not found.' })
    }
}

module.exports = {
    addSubjEnrolled,
    getSubjsEnrolled,
    deleteSubjEnrolled
}