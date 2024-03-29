"use strict"

const db = require('../config/sequelize');
const scheduleModel = db.schedule;

//--- ADD SCHEDULE ---//
const addSchedule = async (req, res) => {
    const {
        schedcode,
        subjectCode,
        units,
        semester,
        schoolyear,
        slots,
        subjectype,
        section,
        instructor,
        tuition,
        graded,
        gradeddate,
        timein1,
        timeout1,
        day1,
        room1,
        timein2,
        timeout2,
        day2,
        room2,
        timein3,
        timeout3,
        day3,
        room3,
        timein4,
        timeout4,
        day4,
        room4,
        ojt,
        petition,
        thesis,
        labunits,
        internet,
        residency,
        encodegrade,
        gradingpart
    } = req.body;

    const schedule = {
        schedcode: schedcode,
        subjectCode: subjectCode,
        units: units,
        semester: semester,
        schoolyear: schoolyear,
        slots: slots,
        subjectype: subjectype,
        section: section,
        instructor: instructor,
        tuition: tuition,
        graded: graded,
        gradeddate: gradeddate,
        timein1: timein1,
        timeout1: timeout1,
        day1: day1,
        room1: room1,
        timein2: timein2,
        timeout2: timeout2,
        day2: day2,
        room2: room2,
        timein3: timein3,
        timeout3: timeout3,
        day3: day3,
        room3: room3,
        timein4: timein4,
        timeout4: timeout4,
        day4: day4,
        room4: room4,
        ojt: ojt,
        petition: petition,
        thesis: thesis,
        labunits: labunits,
        internet: internet,
        residency: residency,
        encodegrade: encodegrade,
        gradingpart: gradingpart
    }

    try {
        if(schedule.timein1 != null || ""){
            scheduleModel.ok1 = 'Y';
        }
        if(schedule.timein2 != null || ""){
            scheduleModel.ok2 = 'Y';
        }
        if(schedule.timein3 != null || ""){
            scheduleModel.ok3 = 'Y';
        }
        if(schedule.timein4 != null || ""){
            scheduleModel.ok4 = 'Y';
        }
        const createdSchedule = await scheduleModel.create(schedule);
        res.status(201).send({
            createdSchedule: createdSchedule, message: 'Schedule Added.'
        });
    } 
    catch {
        res.status(500).send({ message: 'Schedule already exists.' });
    }
}

//--- EDIT SCHEDULE ---//
const editSchedule = async (req, res) => {
    const schedCode = req.params.schedcode;

    const {
        timein1,
        timeout1,
        day1,
        room1,
        timein2,
        timeout2,
        day2,
        room2,
        timein3,
        timeout3,
        day3,
        room3,
        timein4,
        timeout4,
        day4,
        room4,
    } = req.body

    const schedule = {
        timein1,
        timeout1,
        day1,
        room1,
        timein2,
        timeout2,
        day2,
        room2,
        timein3,
        timeout3,
        day3,
        room3,
        timein4,
        timeout4,
        day4,
        room4,
    }

    const updatedSchedule = await scheduleModel.update(schedule, { where: { schedCode: schedCode }});

    if(updatedSchedule[0] > 0) { 
        res.status(200).send({ message: 'Schedule updated successfully.', updatedSchedule: updatedSchedule })
    }
    else {
        res.status(500).send({ message: 'Schedule could not be updated.' })
    }
}

//--- GET ALL SCHEDULES ---//
const getSchedules = async (req, res) => {
    const schedules = await scheduleModel.findAll({
        attributes: [
            'schedcode',
            'subjectCode',
            'units',
            'semester',
            'schoolyear',
            'slots',
            'subjectype',
            'section',
            'instructor',
            'tuition',
            'graded',
            'gradeddate',
            'timein1',
            'timeout1',
            'day1',
            'room1',
            'timein2',
            'timeout2',
            'day2',
            'room2',
            'timein3',
            'timeout3',
            'day3',
            'room3',
            'timein4',
            'timeout4',
            'day4',
            'room4',
            'ojt',
            'petition',
            'thesis',
            'labunits',
            'internet',
            'residency',
            'encodegrade',
            'gradingpart'
        ]
    });

    if(schedules.length > 0) {
        res.status(200).send({ message: 'Schedules found.', schedules: schedules })
    }
    else {
        res.status(404).send({ message: 'Schedules not found.' })
    }
}

//--- GET A SCHEDULE ---//
const getSchedule = async (req, res) => {
    const schedCode = req.params.schedcode;

    const schedule = await scheduleModel.findOne({
        attributes: [
            'schedcode',
            'subjectCode',
            'units',
            'labunits',
            'semester',
            'schoolyear',
            'section',
            'timein1',
            'timeout1',
            'day1',
            'room1',
            'timein2',
            'timeout2',
            'day2',
            'room2',
            'timein3',
            'timeout3',
            'day3',
            'room3',
            'timein4',
            'timeout4',
            'day4',
            'room4',
            'oras'
        ],
        where: { schedcode: schedCode }
    });

    if(schedule) {
        res.status(200).send({ message: 'Schedule found.', schedule: schedule })
    }
    else {
        res.status(500).send({ message: 'Schedule not found.' })
    }
}

//--- GET SCHEDULES BY SEMESTER AND SCHOOL YEAR ---//
const getSchedulesBySemSY = async (req, res) => {
    const semester = req.params.semester
    const schoolyear = req.params.schoolyear

    const schedules = await scheduleModel.findAll({
        attributes: [
            'schedcode',
            'subjectCode',
            'semester',
            'schoolyear',
            'slots',
            'subjectype',
            'units',
            'section',
            'instructor',
            'timein1',
            'timeout1',
            'day1',
            'room1',
            'timein2',
            'timeout2',
            'day2',
            'room2',
            'timein3',
            'timeout3',
            'day3',
            'room3',
            'timein4',
            'timeout4',
            'day4',
            'room4',
            'oras'
        ],
        where: {
            semester: semester,
            schoolyear: schoolyear
        }
    })

    if(schedules) {
        res.status(200).send({ message: 'Schedule found.', schedules: schedules })
    }
    else {
        res.status(500).send({ message: 'Schedule not found.' })
    }
}

//--- GET SCHOOLYEAR ---//
const getSchoolyear = async (req, res) => {
    const schoolyear = await scheduleModel.findAll({
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

//--- DELETE SCHEDULE ---//
const deleteSchedule = async (req, res) => {
    const schedcode = req.params.schedcode

    const deletedSchedule = await scheduleModel.destroy({ where: { schedcode: schedcode }})

    if(deletedSchedule) {
        res.status(200).send({ message: 'Schedule deleted successfully.', deletedSchedule: deletedSchedule })
    }
    else {
        res.status(404).send({ message: 'Schedule does not exist.' })
    }
}

module.exports = {
    addSchedule,
    editSchedule,
    getSchedules,
    getSchedule,
    getSchedulesBySemSY,
    getSchoolyear,
    deleteSchedule
}