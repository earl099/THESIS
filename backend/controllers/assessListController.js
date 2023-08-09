"use strict"

const db = require('../config/sequelize')
const assessListModel = db.assessList
const studentModel = db.student
const courseModel = db.course

//--- GET ALL ASSESSED STUDENTS BY SCHOOL YEAR AND SEMESTER ---//
const getAllAssessedBySemAndSY = async (req, res) => {
    const semester = req.params.semester
    const schoolyear = req.params.schoolyear

    const assessedStuds = await assessListModel.findAll({
        attributes: [
            'id',
            'studentnumber',
            'semester',
            'schoolyear',
            'scholarship',
            'yearLevel',
            'majorCourse',
            'statusII'
        ],
        where: { semester: semester, schoolyear: schoolyear }
    })

    if(assessedStuds.length > 0) {
        res.status(200).send({ message: 'Assessed Students Found.', assessedStuds: assessedStuds })
    }
    else {
        res.status(404).send({ message: 'Assessed Students not found.' })
    }
}

//--- GET ALL ASSESSED STUDENT RECORDS BY STUDENT NUMBER ---//
const getAllAssessedStudRecordsByStudNum = async (req, res) => {
    const studentnumber = req.params.studentnumber

    const assessedStudRecords = await assessListModel.findAll({
        attributes: [
            'id',
            'studentnumber',
            'semester',
            'schoolyear',
            'scholarship',
            'yearLevel',
            'majorCourse',
            'statusII'
        ],
        where: { studentnumber: studentnumber }
    })

    if(assessedStudRecords.length > 0) {
        res.status(200).send({ message: 'Assessed Student Records Found.', assessedStudRecords: assessedStudRecords })
    }
    else {
        res.status(404).send({ message: 'Assessed Student Records not found.' })
    }
}

//--- GET ASSESSED STUDENT BY STUDENT NUMBER, SEM, AND SCHOOL YEAR ---//
const getAssessedStudByStudNumSemAndSY = async (req, res) => {
    const studentnumber = req.params.studentnumber
    const semester = req.params.semester
    const schoolyear = req.params.schoolyear

    const assessedStud = await assessListModel.findOne({
        attributes: [
            'id',
            'studentnumber',
            'semester',
            'schoolyear',
            'scholarship',
            'yearLevel',
            'majorCourse',
            'statusII'
        ],
        where: { studentnumber: studentnumber, semester: semester, schoolyear: schoolyear }
    })

    if(assessedStud) {
        res.status(200).send({ message: 'Assessed Student found.', assessedStud: assessedStud })
    }
    else {
        res.status(500).send({ message: 'Error finding Assessed Student.' })
    }
}

const editScholarship = async (req, res) => {
    const studentNumber = req.params.studentNumber
    const semester = req.params.semester
    const schoolyear = req.params.schoolyear

    const { scholarship } = req.body

    const newScholarship = { scholarship }

    const updatedCourse = await assessListModel.update(newScholarship, {
        where: {
            studentNumber: studentNumber,
            semester: semester,
            schoolyear: schoolyear
        }
    })

    if(updatedCourse[0] > 0) {
        res.status(200).send({ message: 'Scholarship updated successfully', newScholarship })
    }
    else {
        res.status(500).send({ message: 'Update Scholarship failed.' })
    }
}

const getSchoolyear = async (req, res) => {
    const schoolyear = await assessListModel.findAll({
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

const assessedReport = async (req, res) => {
    const {
        collegeCode,
        courseCode,
        semester,
        schoolyear,
        gender,
        scholarship
    } = req.body
    
    //object for final response
    let objRes = []
    let studInfoResult = []

    let courseList
    let finalCourseList = []

    //list for checking if student is in course list
    if(collegeCode != 'ALL') {
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

    //specific college
    if(collegeCode != 'UNIV') {
        //specific course
        if(courseCode != 'ALL') {
            //specific college, course and gender
            if(gender != 'ALL') {
                let assessedResult

                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    //specific scholarship
                    if(scholarship != 'ALL') {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ],
                            where: { 
                                semester: semester, 
                                schoolyear: schoolyear,
                                scholarship: scholarship
                            }
                        })
                    }
                    else {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ],
                            where: { 
                                semester: semester, 
                                schoolyear: schoolyear
                            }
                        })
                    }
                    
                }
                else {
                    if(scholarship != 'ALL') {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ],
                            where: { 
                                scholarship: scholarship
                            }
                        })
                    }
                    else {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ]
                        })
                    }
                }

                for (let i = 0; i < assessedResult.length; i++) {
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
                            studentNumber: assessedResult[i].studentNumber,
                            course: courseCode,
                            gender: gender
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(assessedResult[i])
                }
            }

            //college and course are specific but gender is not
            else {
                let assessedResult 
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    //specific scholarship
                    if(scholarship != 'ALL') {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ],
                            where: { 
                                semester: semester, 
                                schoolyear: schoolyear,
                                scholarship: scholarship
                            }
                        })
                    }
                    else {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ],
                            where: { 
                                semester: semester, 
                                schoolyear: schoolyear
                            }
                        })
                    }
                }
                else {
                    if(scholarship != 'ALL') {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ],
                            where: { 
                                scholarship: scholarship
                            }
                        })
                    }
                    else {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ]
                        })
                    }
                }

                for (let i = 0; i < assessedResult.length; i++) {
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
                            studentNumber: assessedResult[i].studentNumber,
                            course: courseCode
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(assessedResult[i])
                }
            }
        }
        else {
            //college and gender are specific, but course is not
            if(gender != 'ALL') {
                let assessedResult
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    if(scholarship != 'ALL') {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ],
                            where: { 
                                semester: semester, 
                                schoolyear: schoolyear,
                                scholarship: scholarship
                            }
                        })
                    }
                    else {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ],
                            where: { 
                                semester: semester, 
                                schoolyear: schoolyear
                            }
                        })
                    }
                }
                else {
                    if(scholarship != 'ALL') {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ],
                            where: { 
                                scholarship: scholarship
                            }
                        })
                    }
                    else {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ]
                        })
                    }
                }

                for (let i = 0; i < assessedResult.length; i++) {
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
                            studentNumber: assessedResult[i].studentNumber,
                            gender: gender
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(assessedResult[i])
                }
            }
            //college is specific, but course and gender are not
            else {
                let assessedResult
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    if(scholarship != 'ALL') {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ],
                            where: { 
                                semester: semester, 
                                schoolyear: schoolyear,
                                scholarship: scholarship
                            }
                        })
                    }
                    else {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ],
                            where: { 
                                semester: semester, 
                                schoolyear: schoolyear
                            }
                        })
                    }
                }
                else {
                    if(scholarship != 'ALL') {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ],
                            where: { 
                                scholarship: scholarship
                            }
                        })
                    }
                    else {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ]
                        })
                    }
                }

                for (let i = 0; i < assessedResult.length; i++) {
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
                            studentNumber: assessedResult[i].studentNumber
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(assessedResult[i])
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
                let assessedResult
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    if(scholarship != 'ALL') {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ],
                            where: { 
                                semester: semester, 
                                schoolyear: schoolyear,
                                scholarship: scholarship
                            }
                        })
                    }
                    else {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ],
                            where: { 
                                semester: semester, 
                                schoolyear: schoolyear
                            }
                        })
                    }
                }
                else {
                    if(scholarship != 'ALL') {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ],
                            where: { 
                                scholarship: scholarship
                            }
                        })
                    }
                    else {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ]
                        })
                    }
                }

                for (let i = 0; i < assessedResult.length; i++) {
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
                            studentNumber: assessedResult[i].studentNumber,
                            gender: gender,
                            course: courseCode
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(assessedResult[i])
                }
            }
            //gender is not specific
            else {
                let assessedResult
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    if(scholarship != 'ALL') {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ],
                            where: { 
                                semester: semester, 
                                schoolyear: schoolyear,
                                scholarship: scholarship
                            }
                        })
                    }
                    else {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ],
                            where: { 
                                semester: semester, 
                                schoolyear: schoolyear
                            }
                        })
                    }
                }
                else {
                    if(scholarship != 'ALL') {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ],
                            where: { 
                                scholarship: scholarship
                            }
                        })
                    }
                    else {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ]
                        })
                    }
                }

                for (let i = 0; i < assessedResult.length; i++) {
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
                            studentNumber: assessedResult[i].studentNumber,
                            course: courseCode
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(assessedResult[i])
                }
            }
        }
        //course not specific
        else {
            //gender is specific
            if(gender != 'ALL') {
                let assessedResult
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    if(scholarship != 'ALL') {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ],
                            where: { 
                                semester: semester, 
                                schoolyear: schoolyear,
                                scholarship: scholarship
                            }
                        })
                    }
                    else {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ],
                            where: { 
                                semester: semester, 
                                schoolyear: schoolyear
                            }
                        })
                    }
                }
                else {
                    if(scholarship != 'ALL') {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ],
                            where: { 
                                scholarship: scholarship
                            }
                        })
                    }
                    else {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ]
                        })
                    }
                }

                for (let i = 0; i < assessedResult.length; i++) {
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
                            studentNumber: assessedResult[i].studentNumber,
                            gender: gender
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(assessedResult[i])
                }
            }
            //gender is not specific
            else {
                let assessedResult
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    if(scholarship != 'ALL') {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ],
                            where: { 
                                semester: semester, 
                                schoolyear: schoolyear,
                                scholarship: scholarship
                            }
                        })
                    }
                    else {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ],
                            where: { 
                                semester: semester, 
                                schoolyear: schoolyear
                            }
                        })
                    }
                }
                else {
                    if(scholarship != 'ALL') {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ],
                            where: { 
                                scholarship: scholarship
                            }
                        })
                    }
                    else {
                        assessedResult = await assessListModel.findAll({
                            attributes: [
                                'studentNumber',
                                'StudentStatus',
                                'scholarship'
                            ]
                        })
                    }
                }

                for (let i = 0; i < assessedResult.length; i++) {
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
                            studentNumber: assessedResult[i].studentNumber
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(assessedResult[i])
                }
            }
        }
    }

    if(objRes.length > 0) {
        res.status(200).send({ message: 'Students assessed found.', result: objRes, infoResult: studInfoResult })
    }
    else {
        res.status(500).send({ message: 'No Result.' })
    }
}

module.exports = {
    getAllAssessedBySemAndSY,
    getAllAssessedStudRecordsByStudNum,
    getAssessedStudByStudNumSemAndSY,
    editScholarship,
    getSchoolyear,
    assessedReport
}