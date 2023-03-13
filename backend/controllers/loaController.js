"use strict"

const db = require('../config/sequelize')
const os = require('os')
const loaModel = db.loa
const studentModel = db.student
const processLogModel = db.processLogs
const courseModel = db.course

const addLoa = async (req, res) => {
    let transaction = await db.sequelize.transaction()
    let pcname = os.hostname()
    let date = new Date()
    let timestamp = String(
        date.getFullYear() + '-' +
        (date.getMonth() + 1) + '-' +
        date.getDate() + ' ' + 
        date.getHours() + ':' +
        date.getMinutes() + ':' +
        date.getSeconds()
    )

    const {
        //loa data
        studentnumber,
        course,
        semester,
        schoolyear,
        encoder,

        //process log data
        username,
        ipaddress,        
    } = req.body

    const loaObject = {
        studentnumber,
        course,
        semester,
        schoolyear,
        encoder,
        dateencoded: timestamp
    }

    const processLogObject = {
        username,
        ipaddress,
        pcname: pcname,
        studentnumber,
        type: 'Add LOA',
        description: `Added ${studentnumber} to students with Leave of Absence`
    }

    try {
        
        const createdLoa = await loaModel.create(loaObject, { transaction })
        const createdProcessLog = await processLogModel.create(processLogObject, { transaction })
        
        res.status(200).send({ message: 'LOA created successfully', createdLoa: createdLoa, createdProcessLog: createdProcessLog })
        transaction.commit()
    } catch (error) {
        
        res.status(500).send({ error: error, message: 'LOA creation failed'})
        transaction.rollback()
    }
}

const adminGetLoa = async (req, res) => {
    const studsWithLoa = await loaModel.findAll({
        attributes: [
            'studentnumber',
            'course',
            'semester',
            'schoolyear',
            'isActive',
            'encoder',
            'dateencoded'
        ]
    })

    if(studsWithLoa.length > 0) {
        res.status(200).send({ message: 'Students with LOA found.', studsWithLoa: studsWithLoa })
    }
    else {
        res.status(500).send({ message: 'Students with LOA not found' })
    }
}

const userGetLoa = async (req, res) => {
    const collegeID = req.params.collegeID

    const courseList = courseModel.findAll({
        attributes: [ 'courseCode' ],
        where: { courseCollege: collegeID }
    })

    const studsWithLoa = await loaModel.findAll({
        attributes: [
            'studentnumber',
            'course',
            'semester',
            'schoolyear',
            'isActive',
            'encoder',
            'dateencoded'
        ],
        where: db.sequelize.or({ course: courseList })
    })

    if(studsWithLoa.length > 0) {
        res.status(200).send({ message: 'Students with LOA found.', studsWithLoa: studsWithLoa })
    }
    else {
        res.status(500).send({ message: 'Students with LOA not found' })
    }
}

const deleteLoa = async (req, res) => {
    let transaction = await db.sequelize.transaction()
    let pcname = os.hostname()
    const studentnumber = req.params.studentnumber
    const { username, ipaddress } = req.body

    let processLogObject = {
        username,
        ipaddress,
        pcname: pcname,
        studentnumber,
        type: 'Delete LOA',
        description: `Deleted ${studentnumber}'s record to students with Leave of Absence`
    }

    try {
        const deletedLoa = await loaModel.destroy({ where: { studentnumber: studentnumber }}, { transaction })
        const createdProcessLog = await processLogModel.create(processLogObject, { transaction })
        
        
        res.status(200).send({ message: `${studentnumber}'s LOA Record deleted successfully`, deletedLoa: deletedLoa, createdProcessLog: createdProcessLog })
        transaction.commit()
    } catch (error) {
        res.status(500).send({ message: 'Record not deleted' })
        transaction.rollback()
    }
    
}

const getSchoolyear = async (req, res) => {
    const schoolyear = await loaModel.findAll({
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

const advLoaSearch = async (req, res) => {
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
                searchResult = await loaModel.findAll({
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
                searchResult = await loaModel.findAll({
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
                searchResult = await loaModel.findAll({
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
                searchResult = await loaModel.findAll({
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
                searchResult = await loaModel.findAll({
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
                searchResult = await loaModel.findAll({
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
                searchResult = await loaModel.findAll({
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
                searchResult = await loaModel.findAll({
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
        res.status(200).send({ message: 'Students with LOA found.', searchResult: searchResult })
    }
    else {
        res.status(500).send({ message: 'No Results found.' })
    }
}

module.exports = {
    addLoa,
    adminGetLoa,
    userGetLoa,
    deleteLoa,
    getSchoolyear,
    advLoaSearch
}