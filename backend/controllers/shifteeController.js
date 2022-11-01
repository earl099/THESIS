"use strict"

const db = require('../config/sequelize');
const shifteeModel = db.shiftee;

const addShiftee = async (req, res) => {
    const {
        studentnumber,
        coursefrom,
        courseto,
        semester,
        schoolyear
    } = req.body;

    const shiftee = {
        studentnumber: studentnumber,
        coursefrom: coursefrom,
        courseto: courseto,
        semester: semester,
        schoolyear: schoolyear
    }

    try {
        const createdShiftee = await shifteeModel.create(shiftee);
        res.status(201).send({ createdShift: createdShiftee, message: 'Shiftee Added.' });
    }
    catch {
        res.status(500).send({ message: 'Shiftee already exists.' })
    }
}

const editShiftee = async (req, res) => {
    const studentnumber = req.params.studentnumber;

    const {
        coursefrom,
        courseto,
        semester,
        schoolyear
    } = req.body;

    const shift = {
        coursefrom,
        courseto,
        semester,
        schoolyear
    }

    const updatedShift = await shiftModel.update(shift, { where: { studentnumber: studentnumber }})

    if(updatedShift[0] > 0) {
        res.status(200).send({ message: 'Shiftee data updated successfully.', updatedShift: updatedShift })
    }
    else {
        res.status(500).send({ message: 'Could not update shiftee data.' })
    }
}

const getShiftees = async (req, res) => {
    const shiftees = await shifteeModel.findAll({
        attributes: [
            'studentnumber',
            'coursefrom',
            'courseto',
            'semester',
            'schoolyear'
        ]
    })

    if(shiftees.length > 0) {
        res.status(200).send({ message: 'Shiftees found.', shiftees: shiftees })
    }
    else {
        res.status(404).send({ message: 'Shiftees not found.' })
    }
}

const getShiftee = async (req, res) => {
    const studentnumber = req.params.studentnumber;

    const shiftee = await shifteeModel.findOne({
        attributes: [
            'studentnumber',
            'coursefrom',
            'courseto',
            'semester',
            'schoolyear'
        ],
        where: { studentnumber: studentnumber }
    })

    if(shiftee) {
        res.status(200).send({ message: 'Shiftee found.', shiftee: shiftee })
    }
    else {
        res.status(500).send({ message: 'Shiftee not found.' })
    }
}

module.exports = {
    addShiftee,
    editShiftee,
    getShiftee,
    getShiftees
}