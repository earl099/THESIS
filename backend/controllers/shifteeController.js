"use strict"

const db = require('../config/sequelize');
const shifteeModel = db.shiftee;
const studentModel = db.student

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

const getShifteesBySemAndSY = async (req, res) => {
    const semester = req.params.semester
    const schoolyear = req.params.schoolyear

    const shiftees = await shifteeModel.findAll({
        attributes: [
            [
                db.Sequelize.fn(
                    'DISTINCT',
                    db.Sequelize.col('studentnumber')
                ),
                'studentnumber',
            ]
        ],
        where: {
            semester: semester,
            schoolyear: schoolyear
        }
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
            [
                db.Sequelize.fn(
                    'DISTINCT',
                    db.Sequelize.col('schoolyear')
                ),
                'schoolyear'
            ]
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
    
    //object for final response
    let objRes = []
    let studInfoResult = []

    //specific college
    if(collegeCode != 'UNIV') {
        //specific course
        if(courseCode != 'ALL') {
            //specific college, course and gender
            if(gender != 'ALL') {
                let shifteeResult

                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    shifteeResult = await shifteeModel.findAll({
                        attributes: [
                            db.Sequelize.fn(
                                'DISTINCT',
                                db.Sequelize.col('coursefrom')
                            ),
                            'coursefrom',
                            'studentnumber',
                            'semester',
                            'schoolyear'
                        ],
                        where: { 
                            semester: semester, 
                            schoolyear: schoolyear 
                        }
                    })
                }
                else {
                    shifteeResult = await shifteeModel.findAll({
                        attributes: [
                            db.Sequelize.fn(
                                'DISTINCT',
                                db.Sequelize.col('coursefrom')
                            ),
                            'coursefrom',
                            'studentnumber',
                            'semester',
                            'schoolyear'
                        ]
                    })
                }

                for (let i = 0; i < shifteeResult.length; i++) {
                    let infoRes = await studentModel.findOne({
                        attributes: [
                            'studentNumber',
                            'firstName',
                            'middleName',
                            'lastName',
                            'suffix',
                            'course',
                            'gender'
                        ],
                        where: {
                            studentNumber: shifteeResult[i].studentnumber,
                            course: courseCode,
                            gender: gender
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(shifteeResult[i])
                }
            }

            //college and course are specific but gender is not
            else {
                let shifteeResult 
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    shifteeResult = await shifteeModel.findAll({
                        attributes: [
                            db.Sequelize.fn(
                                'DISTINCT',
                                db.Sequelize.col('coursefrom')
                            ),
                            'coursefrom',
                            'studentnumber',
                            'semester',
                            'schoolyear'
                        ],
                        where: { 
                            semester: semester, 
                            schoolyear: schoolyear 
                        }
                    })
                }
                else {
                    shifteeResult = await shifteeModel.findAll({
                        attributes: [
                            db.Sequelize.fn(
                                'DISTINCT',
                                db.Sequelize.col('coursefrom')
                            ),
                            'coursefrom',
                            'studentnumber',
                            'semester',
                            'schoolyear'
                        ]
                    })
                }

                for (let i = 0; i < shifteeResult.length; i++) {
                    let infoRes = await studentModel.findOne({
                        attributes: [
                            'studentNumber',
                            'firstName',
                            'middleName',
                            'lastName',
                            'suffix',
                            'course',
                            'gender'
                        ],
                        where: {
                            studentNumber: shifteeResult[i].studentnumber,
                            course: courseCode
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(shifteeResult[i])
                }
            }
        }
        else {
            //college and gender are specific, but course is not
            if(gender != 'ALL') {
                let shifteeResult
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    shifteeResult = await shifteeModel.findAll({
                        attributes: [
                            db.Sequelize.fn(
                                'DISTINCT',
                                db.Sequelize.col('coursefrom')
                            ),
                            'coursefrom',
                            'studentnumber',
                            'semester',
                            'schoolyear'
                        ],
                        where: { 
                            semester: semester, 
                            schoolyear: schoolyear 
                        }
                    })
                }
                else {
                    shifteeResult = await shifteeModel.findAll({
                        attributes: [
                            db.Sequelize.fn(
                                'DISTINCT',
                                db.Sequelize.col('coursefrom')
                            ),
                            'coursefrom',
                            'studentnumber',
                            'semester',
                            'schoolyear'
                        ]
                    })
                }

                for (let i = 0; i < shifteeResult.length; i++) {
                    let infoRes = await studentModel.findOne({
                        attributes: [
                            'studentNumber',
                            'firstName',
                            'middleName',
                            'lastName',
                            'suffix',
                            'course',
                            'gender'
                        ],
                        where: {
                            studentNumber: shifteeResult[i].studentnumber,
                            gender: gender
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(shifteeResult[i])
                }
            }
            //college is specific, but course and gender are not
            else {
                let shifteeResult
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    shifteeResult = await shifteeModel.findAll({
                        attributes: [
                            db.Sequelize.fn(
                                'DISTINCT',
                                db.Sequelize.col('coursefrom')
                            ),
                            'coursefrom',
                            'studentnumber',
                            'semester',
                            'schoolyear'
                        ],
                        where: { 
                            semester: semester, 
                            schoolyear: schoolyear 
                        }
                    })
                }
                else {
                    shifteeResult = await shifteeModel.findAll({
                        attributes: [
                            db.Sequelize.fn(
                                'DISTINCT',
                                db.Sequelize.col('coursefrom')
                            ),
                            'coursefrom',
                            'studentnumber',
                            'semester',
                            'schoolyear'
                        ]
                    })
                }

                for (let i = 0; i < shifteeResult.length; i++) {
                    let infoRes = await studentModel.findOne({
                        attributes: [
                            'studentNumber',
                            'firstName',
                            'middleName',
                            'lastName',
                            'suffix',
                            'course',
                            'gender'
                        ],
                        where: {
                            studentNumber: shifteeResult[i].studentnumber
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(shifteeResult[i])
                }
            }
        }
    }
    //college not specific
    else {
        //course is specific
        if(courseCode != 'ALL') {
            //gender is specific
            if(gender != 'ALL') {
                let shifteeResult
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    shifteeResult = await shifteeModel.findAll({
                        attributes: [
                            db.Sequelize.fn(
                                'DISTINCT',
                                db.Sequelize.col('coursefrom')
                            ),
                            'coursefrom',
                            'studentnumber',
                            'semester',
                            'schoolyear'
                        ],
                        where: { 
                            semester: semester, 
                            schoolyear: schoolyear 
                        }
                    })
                }
                else {
                    shifteeResult = await shifteeModel.findAll({
                        attributes: [
                            db.Sequelize.fn(
                                'DISTINCT',
                                db.Sequelize.col('coursefrom')
                            ),
                            'coursefrom',
                            'studentnumber',
                            
                            'semester',
                            'schoolyear'
                        ]
                    })
                }

                for (let i = 0; i < shifteeResult.length; i++) {
                    let infoRes = await studentModel.findOne({
                        attributes: [
                            'studentNumber',
                            'firstName',
                            'middleName',
                            'lastName',
                            'suffix',
                            'course',
                            'gender'
                        ],
                        where: {
                            studentNumber: shifteeResult[i].studentnumber,
                            gender: gender,
                            course: courseCode
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(shifteeResult[i])
                }
            }
            //gender is not specific
            else {
                let shifteeResult
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    shifteeResult = await shifteeModel.findAll({
                        attributes: [
                            'studentnumber',
                            db.Sequelize.fn(
                                'DISTINCT',
                                db.Sequelize.col('coursefrom')
                            ),
                            'coursefrom',
                            'semester',
                            'schoolyear'
                        ],
                        where: { 
                            semester: semester, 
                            schoolyear: schoolyear 
                        }
                    })
                }
                else {
                    shifteeResult = await shifteeModel.findAll({
                        attributes: [
                            db.Sequelize.fn(
                                'DISTINCT',
                                db.Sequelize.col('coursefrom')
                            ),
                            'coursefrom',
                            'studentnumber',
                            'semester',
                            'schoolyear'
                        ]
                    })
                }

                for (let i = 0; i < shifteeResult.length; i++) {
                    let infoRes = await studentModel.findOne({
                        attributes: [
                            'studentNumber',
                            'firstName',
                            'middleName',
                            'lastName',
                            'suffix',
                            'course',
                            'gender'
                        ],
                        where: {
                            studentNumber: shifteeResult[i].studentnumber,
                            course: courseCode
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(shifteeResult[i])
                }
            }
        }
        //course not specific
        else {
            //gender is specific
            if(gender != 'ALL') {
                let shifteeResult
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    shifteeResult = await shifteeModel.findAll({
                        attributes: [
                            'studentnumber',
                            db.Sequelize.fn(
                                'DISTINCT',
                                db.Sequelize.col('coursefrom')
                            ),
                            'coursefrom',
                            'semester',
                            'schoolyear'
                        ],
                        where: { 
                            semester: semester, 
                            schoolyear: schoolyear 
                        }
                    })
                }
                else {
                    shifteeResult = await shifteeModel.findAll({
                        attributes: [
                            db.Sequelize.fn(
                                'DISTINCT',
                                db.Sequelize.col('coursefrom')
                            ),
                            'coursefrom',
                            'studentnumber',
                            'semester',
                            'schoolyear'
                        ]
                    })
                }

                for (let i = 0; i < shifteeResult.length; i++) {
                    let infoRes = await studentModel.findOne({
                        attributes: [
                            'studentNumber',
                            'firstName',
                            'middleName',
                            'lastName',
                            'suffix',
                            'course',
                            'gender'
                        ],
                        where: {
                            studentNumber: shifteeResult[i].studentnumber,
                            gender: gender
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(shifteeResult[i])
                }
            }
            //gender is not specific
            else {
                let shifteeResult
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    shifteeResult = await shifteeModel.findAll({
                        attributes: [
                            db.Sequelize.fn(
                                'DISTINCT',
                                db.Sequelize.col('coursefrom')
                            ),
                            'coursefrom',
                            'studentnumber',
                            'semester',
                            'schoolyear'
                        ],
                        where: { 
                            semester: semester, 
                            schoolyear: schoolyear 
                        }
                    })
                }
                else {
                    shifteeResult = await shifteeModel.findAll({
                        attributes: [
                            db.Sequelize.fn(
                                'DISTINCT',
                                db.Sequelize.col('coursefrom')
                            ),
                            'coursefrom',
                            'studentnumber',
                            'semester',
                            'schoolyear'
                        ]
                    })
                }

                for (let i = 0; i < shifteeResult.length; i++) {
                    let infoRes = await studentModel.findOne({
                        attributes: [
                            'studentNumber',
                            'firstName',
                            'middleName',
                            'lastName',
                            'suffix',
                            'course',
                            'gender'
                        ],
                        where: {
                            studentNumber: shifteeResult[i].studentnumber
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(shifteeResult[i])
                }
            }
        }
    }

    if(objRes.length > 0) {
        res.status(200).send({ message: 'Students Enrolled found.', result: objRes, infoResult: studInfoResult })
    }
    else {
        res.status(500).send({ message: 'No Result.' })
    }
}

module.exports = {
    addShiftee,
    editShiftee,
    getShiftee,
    getShiftees,
    getShifteesBySemAndSY,
    getSchoolyear,
    advShifteeSearch
}