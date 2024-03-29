"use strict"

const { Op } = require('sequelize');
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

const getLoaBySemAndSY = async (req, res) => {
    const semester = req.params.semester
    const schoolyear = req.params.schoolyear

    const loa = await loaModel.findAll({
        attributes: [
            [
                db.Sequelize.fn(
                    'DISTINCT',
                    db.Sequelize.col('studentnumber')
                ),
                'studentnumber'
            ]
        ],
        where: {
            semester: semester,
            schoolyear: schoolyear
        }
    })

    if(loa.length > 0) {
        res.status(200).send({ message: 'Students with LOA found.', loa: loa })
    }
    else {
        res.status(500).send({ message: 'Students with LOA not found' })
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
        res.status(200).send({ message: 'Students with LOA not found', studsWithLoa: studsWithLoa })
    }
}

const userGetLoa = async (req, res) => {
    const collegeID = req.params.collegeID

    let courseArray = collegeID.split('.')
    let courseList
    
    if(courseArray.length > 1) {
        courseList = courseModel.findAll({
            attributes: [ 'courseCode' ],
            where: { 
                courseCollege: {
                    [Op.or]: courseArray
                }
            }
        })
    }
    else {
        courseList = courseModel.findAll({
            attributes: [ 'courseCode' ],
            where: { courseCollege: collegeID }
        })
    }
    
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
        res.status(200).send({ message: 'Students with LOA not found', studsWithLoa: studsWithLoa })
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
    
    let collegeList = collegeCode.split('.')

    //object for final response
    let objRes = []
    let studInfoResult = []

    let courseList
    let finalCourseList = []

    //list for checking if student is in course list
    if(collegeCode != 'ALL') {
        if(collegeList.length > 1) {
            if(courseCode != 'ALL') {
                courseList = await courseModel.findAll({
                    attributes: [
                        db.sequelize.fn(
                            'DISTINCT',
                            db.sequelize.col('courseCode')
                        ),
                        'courseCode',
                        'courseCollege'
                    ],
                    where: {
                        courseCollege: {
                            [Op.or]: collegeList
                        },
                        courseCode: courseCode
                    }
                })
            }
            else {
                courseList = await courseModel.findAll({
                    attributes: [
                        db.sequelize.fn(
                            'DISTINCT',
                            db.sequelize.col('courseCode')
                        ),
                        'courseCode',
                        'courseCollege'
                    ],
                    where: {
                        courseCollege: {
                            [Op.or]: collegeList
                        }
                    }
                })
            }
        }
        else {
            if(courseCode != 'ALL') {
                courseList = await courseModel.findAll({
                    attributes: [
                        db.sequelize.fn(
                            'DISTINCT',
                            db.sequelize.col('courseCode')
                        ),
                        'courseCode',
                        'courseCollege'
                    ],
                    where: {
                        courseCollege: collegeCode,
                        courseCode: courseCode
                    }
                })
            }
            else {
                courseList = await courseModel.findAll({
                    attributes: [
                        db.sequelize.fn(
                            'DISTINCT',
                            db.sequelize.col('courseCode')
                        ),
                        'courseCode',
                        'courseCollege'
                    ],
                    where: {
                        courseCollege: collegeCode
                    }
                })
            }
        }
    }
    else {
        courseList = await courseModel.findAll({
            attributes: [
                db.sequelize.fn(
                    'DISTINCT',
                    db.sequelize.col('courseCode')
                ),
                'courseCode',
                'courseCollege'
            ]
        })
    }

    for(let i = 0; i < courseList.length; i++) {
        finalCourseList.push(courseList[i].courseCode) 
    }

    let checkerData = await loaModel.findAll({
        attributes: [
            'studentnumber',
            'dateencoded',
            'semester',
            'schoolyear'
        ],
        where: { 
            semester: semester, 
            schoolyear: schoolyear,
            course: courseCode
        }
    })

    if(checkerData.length < 1) {
        objRes = checkerData
    }

    //specific college
    if(collegeCode != 'UNIV') {
        //specific course
        if(courseCode != 'ALL') {
            //specific college, course and gender
            if(gender != 'ALL') {
                let loaResult

                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    loaResult = await loaModel.findAll({
                        attributes: [
                            'studentnumber',
                            'dateencoded',
                            'semester',
                            'schoolyear'
                        ],
                        where: { 
                            semester: semester, 
                            schoolyear: schoolyear,
                            course: courseCode
                        }
                    })
                }
                else {
                    loaResult = await loaModel.findAll({
                        attributes: [
                            'studentnumber',
                            'dateencoded',
                            'semester',
                            'schoolyear'
                        ],
                        where: {
                            course: courseCode
                        }
                    })
                }

                for (let i = 0; i < loaResult.length; i++) {
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
                            studentNumber: loaResult[i].studentnumber,
                            course: courseCode,
                            gender: gender
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(loaResult[i])
                }
            }

            //college and course are specific but gender is not
            else {
                let loaResult 
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    loaResult = await loaModel.findAll({
                        attributes: [
                            'studentnumber',
                            'dateencoded',
                            'semester',
                            'schoolyear'
                        ],
                        where: { 
                            semester: semester, 
                            schoolyear: schoolyear,
                            course: courseCode
                        }
                    })
                }
                else {
                    loaResult = await loaModel.findAll({
                        attributes: [
                            'studentnumber',
                            'dateencoded',
                            'semester',
                            'schoolyear'
                        ],
                        where: {
                            course: courseCode
                        }
                    })
                }

                for (let i = 0; i < loaResult.length; i++) {
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
                            studentNumber: loaResult[i].studentnumber,
                            course: courseCode
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(loaResult[i])
                }
            }
        }
        else {
            //college and gender are specific, but course is not
            if(gender != 'ALL') {
                let loaResult
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    loaResult = await loaModel.findAll({
                        attributes: [
                            'studentnumber',
                            'dateencoded',
                            'semester',
                            'schoolyear'
                        ],
                        where: { 
                            semester: semester, 
                            schoolyear: schoolyear,
                            course: finalCourseList
                        }
                    })
                }
                else {
                    loaResult = await loaModel.findAll({
                        attributes: [
                            'studentnumber',
                            'dateencoded',
                            'semester',
                            'schoolyear'
                        ],
                        where: {
                            course: finalCourseList
                        }
                    })
                }

                for (let i = 0; i < loaResult.length; i++) {
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
                            studentNumber: loaResult[i].studentnumber,
                            gender: gender
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(loaResult[i])
                }
            }
            //college is specific, but course and gender are not
            else {
                let loaResult
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    loaResult = await loaModel.findAll({
                        attributes: [
                            'studentnumber',
                            'dateencoded',
                            'semester',
                            'schoolyear'
                        ],
                        where: { 
                            semester: semester, 
                            schoolyear: schoolyear,
                            course: finalCourseList
                        }
                    })
                }
                else {
                    loaResult = await loaModel.findAll({
                        attributes: [
                            'studentnumber',
                            'dateencoded',
                            'semester',
                            'schoolyear'
                        ],
                        where: {
                            course: finalCourseList
                        }
                    })
                }

                for (let i = 0; i < loaResult.length; i++) {
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
                            studentNumber: loaResult[i].studentnumber
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(loaResult[i])
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
                let loaResult
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    loaResult = await loaModel.findAll({
                        attributes: [
                            'studentnumber',
                            'dateencoded',
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
                    loaResult = await loaModel.findAll({
                        attributes: [
                            'studentnumber',
                            'semester',
                            'schoolyear'
                        ]
                    })
                }

                for (let i = 0; i < loaResult.length; i++) {
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
                            studentNumber: loaResult[i].studentnumber,
                            gender: gender,
                            course: courseCode
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(loaResult[i])
                }
            }
            //gender is not specific
            else {
                let loaResult
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    loaResult = await loaModel.findAll({
                        attributes: [
                            'studentnumber',
                            'dateencoded',
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
                    loaResult = await loaModel.findAll({
                        attributes: [
                            'studentnumber',
                            'dateencoded',
                            'semester',
                            'schoolyear'
                        ]
                    })
                }

                for (let i = 0; i < loaResult.length; i++) {
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
                            studentNumber: loaResult[i].studentnumber,
                            course: courseCode
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(loaResult[i])
                }
            }
        }
        //course not specific
        else {
            //gender is specific
            if(gender != 'ALL') {
                let loaResult
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    loaResult = await loaModel.findAll({
                        attributes: [
                            'studentnumber',
                            'dateencoded',
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
                    loaResult = await loaModel.findAll({
                        attributes: [
                            'studentnumber',
                            'dateencoded',
                            'semester',
                            'schoolyear'
                        ]
                    })
                }

                for (let i = 0; i < loaResult.length; i++) {
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
                            studentNumber: loaResult[i].studentnumber,
                            gender: gender
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(loaResult[i])
                }
            }
            //gender is not specific
            else {
                let loaResult
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    loaResult = await loaModel.findAll({
                        attributes: [
                            'studentnumber',
                            'dateencoded',
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
                    loaResult = await loaModel.findAll({
                        attributes: [
                            'studentnumber',
                            'dateencoded',
                            'semester',
                            'schoolyear'
                        ]
                    })
                }

                for (let i = 0; i < loaResult.length; i++) {
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
                            studentNumber: loaResult[i].studentnumber
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(loaResult[i])
                }
            }
        }
    }

    if(objRes.length > 0) {
        res.status(200).send({ message: 'Students loa found.', result: objRes, infoResult: studInfoResult })
    }
    else {
        res.status(200).send({ message: 'No Result.', result: objRes, infoResult: studInfoResult })
    }
}

module.exports = {
    addLoa,
    adminGetLoa,
    userGetLoa,
    getLoaBySemAndSY,
    deleteLoa,
    getSchoolyear,
    advLoaSearch
}