"use strict"

const db = require('../config/sequelize');
const shifteeModel = db.shiftee;
const studentModel = db.student
const courseModel = db.course

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

const getSchoolyear = async (req, res) => {
    const schoolyear = await shifteeModel.findAll({
        attributes: [
            db.Sequelize.fn(
                'DISTINCT',
                db.Sequelize.col('schoolyear')
            ),
            'schoolyear'
        ]
    })

    if(schoolyear.length > 0) {
        res.status(200).send({ schoolyear: schoolyear })
    }
}

const advShifteeSearch = async (req, res) => {
    const {
        collegeCode,
        courseCode,
        semester,
        schoolyear,
        gender
    } = req.body
    let searchResult
    //specific college
    if (collegeCode != 'UNIV') {
        let courseList = await courseModel.findAll({
            attributes: [
                db.sequelize.fn(
                    'DISTINCT',
                    db.sequelize.col('courseCode')
                ),
                'courseCode'
            ],
            where: { courseCollege: collegeCode }
        })
        
        //specific course
        if (courseCode != 'ALL') {
            //specific gender
            if (gender != 'BOTH') {
                searchResult = await shifteeModel.findAll({
                    attributes: [
                        'studentnumber'
                    ],
                    where: {
                        semester: semester,
                        schoolyear: schoolyear
                    },
                    include: [{
                        model: studentModel,
                        attributes: [
                            'firstName',
                            'middleName',
                            'lastName',
                            'gender',
                            'course'
                        ],
                        where: {
                            gender: gender,
                            course: courseCode
                        }
                    }]
                }) 
            } 
            //non-specific gender
            else {
                searchResult = await shifteeModel.findAll({
                    attributes: [
                        'studentnumber'
                    ],
                    where: {
                        semester: semester,
                        schoolyear: schoolyear
                    },
                    include: [{
                        model: studentModel,
                        attributes: [
                            'firstName',
                            'middleName',
                            'lastName',
                            'gender',
                            'course'
                        ],
                        where: {
                            gender: gender,
                            course: courseCode
                        }
                    }]
                })
            }
        } 
        //non-specific course
        else {

            //specific gender
            if (gender != 'BOTH') {
                searchResult = await shifteeModel.findAll({
                    attributes: [
                        'studentnumber'
                    ],
                    include: [{
                        model: studentModel,
                        attributes: [
                            'firstName',
                            'middleName',
                            'lastName',
                            'gender',
                            'course'
                        ],
                        where: {
                            gender: gender,
                            [Op.or]: [{
                                course: [{ 
                                    [Op.in]: { courseList }
                                }]
                            }]
                        },
                    }],
                    where: { 
                        semester: semester, 
                        schoolyear: schoolyear 
                    }
                })
            } 
            //non-specific gender
            else {
                searchResult = await shifteeModel.findAll({
                    attributes: [
                        'studentnumber'
                    ],
                    include: [{
                        model: studentModel,
                        attributes: [
                            'firstName',
                            'middleName',
                            'lastName',
                            'gender',
                            'course'
                        ],
                        where: {
                            [Op.or]: [{
                                course: [{ 
                                    [Op.in]: { courseList }
                                }]
                            }]
                        },
                    }],
                    where: { 
                        semester: semester, 
                        schoolyear: schoolyear 
                    }
                })
            }
        }
    } 
    //non-specific college
    else {
        let courseList = await courseModel.findAll({
            attributes: [
                db.sequelize.fn(
                    'DISTINCT',
                    db.sequelize.col('courseCode')
                ),
                'courseCode'
            ]
        })

        //course specific
        if (courseCode != 'ALL') {
            //gender specific
            if (gender != 'BOTH') {
                searchResult = await shifteeModel.findAll({
                    attributes: [
                        'studentnumber'
                    ],
                    where: {
                        semester: semester,
                        schoolyear: schoolyear
                    },
                    include: [{
                        model: studentModel,
                        attributes: [
                            'firstName',
                            'middleName',
                            'lastName',
                            'gender',
                            'course'
                        ],
                        where: {
                            gender: gender,
                            course: courseCode
                        }
                    }]
                })
            } 
            //gender non-specific
            else {
                searchResult = await shifteeModel.findAll({
                    attributes: [
                        'studentnumber'
                    ],
                    where: {
                        semester: semester,
                        schoolyear: schoolyear
                    },
                    include: [{
                        model: studentModel,
                        attributes: [
                            'firstName',
                            'middleName',
                            'lastName',
                            'gender',
                            'course'
                        ],
                        where: {
                            course: courseCode
                        }
                    }]
                })
            }
        } 
        //course non-specific
        else {
            //gender specific
            if (gender != 'BOTH') {
                searchResult = await shifteeModel.findAll({
                    attributes: [
                        'studentnumber'
                    ],
                    include: [{
                        model: studentModel,
                        attributes: [
                            'firstName',
                            'middleName',
                            'lastName',
                            'gender',
                            'course'
                        ],
                        where: {
                            gender: gender,
                            [Op.or]: [{
                                course: [{ 
                                    [Op.in]: { courseList }
                                }]
                            }]
                        },
                    }],
                    where: { 
                        semester: semester, 
                        schoolyear: schoolyear 
                    }
                })
            } 
            //gender non-specific
            else {
                searchResult = await shifteeModel.findAll({
                    attributes: [
                        'studentnumber'
                    ],
                    include: [{
                        model: studentModel,
                        attributes: [
                            'firstName',
                            'middleName',
                            'lastName',
                            'gender',
                            'course'
                        ],
                        where: {
                            [Op.or]: [{
                                course: [{ 
                                    [Op.in]: { courseList }
                                }]
                            }]
                        },
                    }],
                    where: { 
                        semester: semester, 
                        schoolyear: schoolyear 
                    }
                })
            }
        }
    }

    if(searchResult.length > 0) {
        res.status(200).send({ message: 'Shiftees found.', searchResult: searchResult })
    }
    else {
        res.status(500).send({ message: 'No Results found.' })
    }
}

module.exports = {
    addShiftee,
    editShiftee,
    getShiftee,
    getShiftees,
    getSchoolyear,
    advShifteeSearch
}