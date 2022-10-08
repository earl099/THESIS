"use strict"

const db = require('../config/sequelize');
const curriculumModel = db.curriculum;

//--- ADDING CURRICULUM ---//
const addCurriculum = async (req, res) => {
    const {
        course,
        schoolyear,
        coursemajor
    } = req.body;

    const curriculum = { 
        course: course,
        schoolyear: schoolyear,
        coursemajor: coursemajor
    }

    try {
        const createdCurriculum = await curriculumModel.create(curriculum);
        res.status(201).send({ createdCurriculum: createdCurriculum, message: 'Curriculum added.' })
    }
    catch {
        res.status(500).send({ message: 'Error adding curriculum.' })
    }
}

//--- EDITING CURRICULUM ---//
const editCurriculum = async (req, res) => {
    const id = req.params.id;

    const {
        course,
        schoolyear,
        coursemajor,
        activecurriculum
    } = req.body;

    const curriculum = {
        course,
        schoolyear,
        coursemajor,
        activecurriculum
    }

    const updatedCurriculum = await curriculumModel.update(curriculum, { where: { id: id }})

    if(updatedCurriculum[0] > 0) {
        res.status(200).send({ message: 'Curriculum updated succesfully.', updatedCurriculum: updatedCurriculum })
    }
    else {
        res.status(500).send({ message: 'Error updating curriculum.' })
    }
}

//--- GETTING ALL CURRICULA ---//
const getCurricula = async (req, res) => {
    const curricula = await curriculumModel.findAll({
        attributes: [
            'id',
            'course',
            'schoolyear',
            'coursemajor',
            'activecurriculum'
        ]
    });

    if(curricula.length > 0) {
        res.status(200).send({ message: 'Curricula found.', curricula: curricula })
    }
    else {
        res.status(404).send({ message: 'Curricula not found.' })
    }
}

//--- GETTING A CURRICULUM ---//
const getCurriculum = async (req, res) => {
    const id = req.params.id;

    const curriculum = await curriculumModel.findOne({
        attributes: [
            'id',
            'course',
            'schoolyear',
            'coursemajor',
            'activecurriculum',
        ],
        where: { id: id }
    });

    if(curriculum) {
        res.status(200).send({ message: 'Curriculum found.', curriculum: curriculum })
    }
    else {
        res.status(404).send({ message: 'Curriculum not found.' })
    }
}

module.exports = {
    addCurriculum,
    editCurriculum,
    getCurricula,
    getCurriculum
}