"use strict"

const db = require('../config/sequelize');
const currContentModel = db.currContent;

//--- ADDING SUBJECT ---//
const addCContent = async (req, res) => {
    const {
        refid,
        subjectcode,
        semester, 
        schoolyear,
        course,
        coursemajor,
        prerequisite,
        yearlevel
    } = req.body;

    const cContent = {
        refid: refid,
        subjectcode: subjectcode,
        semester: semester, 
        schoolyear: schoolyear,
        course: course,
        coursemajor: coursemajor,
        prerequisite: prerequisite,
        yearlevel: yearlevel
    }

    try {
        const createdCContent = await currContentModel.create(cContent)
        res.status(200).send({ message: 'Curriculum Content created.', createdCContent: createdCContent })
    } catch {
        res.status(500).send({ message: 'Error creating curriculum content.' })
    }
}

//--- EDITING SUBJECT ---//
const editCContent = async (req, res) => {
    const id = req.params.id;

    const {
        refid,
        subjectcode,
        semester, 
        schoolyear,
        course,
        coursemajor,
        prerequisite,
        yearlevel,
        active
    } = req.body;

    const cContent = {
        refid,
        subjectcode,
        semester, 
        schoolyear,
        course,
        coursemajor,
        prerequisite,
        yearlevel,
        active
    }

    const updatedCContent = await currContentModel.update(cContent, { where: { id: id }})

    if(updatedCContent[0] > 0) {
        res.status(200).send({ message: 'Curriculum content updated successfully.', updatedCContent: updatedCContent })
    }
    else {
        res.status(500).send({ message: 'Error updating curriculum content.' })
    }
}

//--- GETTING CURRICULA CONTENT BY REFID ---//
const getAllCContentbyRefID = async (req, res) => {
    const refid = req.params.refid;

    const cContents = await currContentModel.findAll({
        attributes: [
            'id',
            'refid',
            'subjectcode',
            'semester', 
            'schoolyear',
            'course',
            'coursemajor',
            'prerequisite',
            'yearlevel',
            'active'
        ],
        where: { refid: refid }
    });

    if(cContents.length > 0) {
        res.status(200).send({ message: 'Curricula content found', cContents: cContents })
    }
    else {
        res.status(404).send({ message: 'Curricula content not found.' })
    }
}

//--- GETTING A CURRICULUM CONTENT ---//
const getCContent = async (req, res) => {
    const id = req.params.id;

    const cContent = await currContentModel.findOne({
        attributes: [
            'id',
            'refid',
            'subjectcode',
            'semester', 
            'schoolyear',
            'course',
            'coursemajor',
            'prerequisite',
            'yearlevel',
            'active'
        ],
        where: { id: id }
    });

    if(cContent) {
        res.status(200).send({ message: 'Curriculum content found.', cContent: cContent })
    }
    else {
        res.status(500).send({ message: 'Curriculum content not found.' })
    }
}

//--- GETTING CURRICULUM CONTENT BY SEMESTER AND YEAR LEVEL
const getCContentbyRefIDYearAndSem = async (req, res) => {
    const refid = req.params.refid
    const semester = req.params.semester;
    const yearlevel = req.params.yearlevel;
    const cContent = await currContentModel.findAll({
        attributes: [
            'id',
            'refid',
            'subjectcode',
            'semester', 
            'schoolyear',
            'course',
            'coursemajor',
            'prerequisite',
            'yearlevel',
            'active'
        ],
        where: {
            refid: refid,
            semester: semester,
            yearlevel: yearlevel
        }
    });

    if(cContent) {
        res.status(200).send({ message: 'Curriculum content found.', cContent: cContent })
    }
    else {
        res.status(500).send({ message: 'Curriculum content not found.' })
    }
}

module.exports = {
    addCContent,
    editCContent,
    getCContent,
    getCContentbyRefIDYearAndSem
}