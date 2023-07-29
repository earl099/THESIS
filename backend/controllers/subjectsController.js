"use strict"

const db = require('../config/sequelize')
const subjectsModel = db.subjects

//--- ADD SUBJECT ---//
const addSubject = async (req, res) => {
    const {
        subjectcode,
        description,
        lectUnits,
        pr1,
        pr2,
        pr3,
        pr4,
        pr5,
        pr6,
        pr7,
        pr8,
        pr9,
        pr10,
        subjectTitle
    } = req.body

    const subject = {
        subjectcode: subjectcode,
        description: description,
        lectUnits: lectUnits,
        pr1: pr1,
        pr2: pr2,
        pr3: pr3,
        pr4: pr4,
        pr5: pr5,
        pr6: pr6,
        pr7: pr7,
        pr8: pr8,
        pr9: pr9,
        pr10: pr10,
        subjectTitle: subjectTitle
    }

    try {
        const createdSubject = await subjectsModel.create(subject)
        res.status(201).send({ message: 'Subject created successfully.', createdSubject: createdSubject })
    }
    catch {
        res.status(500).send({ message: 'Error adding data.' });
    }
}

//--- EDIT SUBJECT ---//
const editSubject = async (req, res) => {
    const subjectcode = req.params.subjectcode

    const {
        description,
        lectUnits,
        pr1,
        pr2,
        pr3,
        pr4,
        pr5,
        pr6,
        pr7,
        pr8,
        pr9,
        pr10,
        subjectTitle
    } = req.body

    const subject = {
        description,
        lectUnits,
        pr1,
        pr2,
        pr3,
        pr4,
        pr5,
        pr6,
        pr7,
        pr8,
        pr9,
        pr10,
        subjectTitle
    }

    const updatedSubject = await subjectsModel.update(subject, { where: { subjectcode: subjectcode }})

    if(updatedSubject[0] > 0) {
        res.status(200).send({ message: 'Subject modified successfully.', updatedSubject: updatedSubject })
    }
    else {
        res.status(500).send({ message: 'Error modifying data.' })
    }
}

//--- GET SUBJECT ---//
const getSubject = async (req, res) => {
    const subjectcode = req.params.subjectcode

    const subject = await subjectsModel.findOne({
        attributes: [
            'description',
            'lectUnits',
            'pr1',
            'pr2',
            'pr3',
            'pr4',
            'pr5',
            'pr6',
            'pr7',
            'pr8',
            'pr9',
            'pr10',
            'subjectTitle'
        ],
        where: { subjectcode: subjectcode }
    })

     if(subject) {
        res.status(200).send({ message: 'Subject found.', subject: subject })
     }
     else {
        res.status(500).send({ message: 'Error fetching data.' })
     }
}

//--- GET ALL SUBJECTS ---//
const getSubjects = async (req, res) => {
    const subjects = await subjectsModel.findAll({
        attributes: [
            'subjectcode',
            'subjectTitle'
        ]
    })

    if(subjects.length > 0) {
        res.status(200).send({ message: 'Subjects found.', subjects: subjects })
    }
    else {
        res.status(500).send({ message: 'Subjects not found.' })
    }
}

//--- GET SUBJECT TITLE ---//
const getSubjTitle = async (req, res) => {
    const subjectcode = req.params.subjectcode
    let newsubjCode = ''
    let subject

    if(subjectcode.includes('.')) {
        newsubjCode = subjectcode.replaceAll('.', '/')

        subject = await subjectsModel.findOne({
            attributes: ['subjectTitle'],
            where: { subjectcode: newsubjCode }
        })
    }
    else {
        subject = await subjectsModel.findOne({
            attributes: ['subjectTitle'],
            where: { subjectcode: subjectcode }
        })
    }

    

    if(subject) {
        res.status(200).send({ message: 'Subject title found.', subject: subject })
     }
     else {
        res.status(500).send({ message: 'Error fetching data.' })
     }
}

//--- GET SCHOOLYEAR ---//
const getSchoolyear = async (req, res) => {
    const schoolyear = await subjectsModel.findAll({
        attributes: [
            [
                db.sequelize.fn(
                    'DISTINCT', 
                    db.sequelize.col('schoolyear')
                ), 
                'schoolyear'
            ]
        ]
    })

    if(schoolyear.length > 0) {
        res.status(200).send({ schoolyear: schoolyear })
    }
}

//--- DELETE SUBJECT ---//
const deleteSubject = async (req, res) => {
    const subjectcode = req.params.subjectcode
    const deletedSubject = await subjectsModel.destroy({ where: { subjectcode: subjectcode }})

    if(deletedSubject) {
        res.status(200).send({ message: 'Subject deleted successfully.', deletedSubject: deletedSubject })
    }
    else {
        res.status(404).send({ message: 'Subject does not exist.' })
    }
}

module.exports = {
    addSubject,
    editSubject,
    getSubject,
    getSubjects,
    getSubjTitle,
    getSchoolyear,
    deleteSubject
}