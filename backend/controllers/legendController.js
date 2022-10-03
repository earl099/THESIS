"use strict"

const db = require('../config/sequelize');
const scheduleModel = require('../models/scheduleModel');
const legendModel = db.legend;

//--- ADDING GLOBAL VARIABLES FOR INSTALLATION ---//
const addLegend = async (req, res) => {
    const {
        semester,
        schoolyear,
        hrmohead,
        hrmodesignation,
        registrar,
        registrar_designation,
        ksemester,
        kschoolyear,
        mycampus,
        limitunits,
        internetpayment
    } = req.body;

    const legend = {
        semester: semester,
        schoolyear: schoolyear,
        hrmohead: hrmohead,
        hrmodesignation: hrmodesignation,
        registrar: registrar,
        registrar_designation: registrar_designation,
        ksemester: ksemester,
        kschoolyear: kschoolyear,
        mycampus: mycampus,
        limitunits: limitunits,
        internetpayment: internetpayment
    }

    try {
        const createdLegend = await legendModel.create(legend);
        res.status(201).send({ createdLegend: createdLegend, message: 'Global Variables Added.' });
    } catch (err) {
        res.status(500).send({ message: 'Global Variables could not be added.', error: err })
    }
}

//--- GETTING LEGEND FOR VALIDATION IF NEWLY INSTALLED ---//
const getLegend = async (req, res) => {
    const legend = await legendModel.findAll({
        attributes: [
            'semester',
            'schoolyear',
            'hrmohead',
            'hrmodesignation',
            'registrar',
            'registrar_designation',
            'lastupdate',
            'ksemester',
            'kschoolyear',
            'mycampus',
            'myversion',
            'limitunits',
            'internetpayment'   
        ]
    });

    if(legend.length > 0) {
        res.status(200).send({ message: 'Global Variables found.', legend: legend })
    }
    else {
        res.status(404).send({ message: 'Global Variables not found.' })
    }
}

//--- MODIFICATION OF GLOBAL VARIABLES ---//
const editLegend = async (req, res) => {
    const id = 1;

    const {
        semester,
        schoolyear,
        hrmohead,
        hrmodesignation,
        registrar,
        registrar_designation,
        lastupdate,
        ksemester,
        kschoolyear,
        mycampus,
        myversion,
        limitunits,
        internetpayment
    } = req.body;

    const legend = {
        semester,
        schoolyear,
        hrmohead,
        hrmodesignation,
        registrar,
        registrar_designation,
        lastupdate,
        ksemester,
        kschoolyear,
        mycampus,
        myversion,
        limitunits,
        internetpayment
    }

    const updatedLegend = await legendModel.update(legend, { where: { id: id } });

    if(updatedLegend[0] > 0) {
        res.status(200).send({ message: 'Schedule updated successfully.', updatedLegend: updatedLegend })
    }
    else {
        res.status(500).send({ message: 'Schedule could not be updated.' });
    }
}

module.exports = {
    addLegend,
    getLegend,
    editLegend
}