"use strict"

const { Op } = require('sequelize')
const db = require('../config/sequelize')
const collegeModel = db.college
const courseModel = db.course

const getColleges = async (req, res) => {
    const college = await collegeModel.findAll({
        attributes: [
            db.sequelize.fn(
                'DISTINCT',
                db.sequelize.col('collegeCode')
            ),
            'collegeCode'
        ]
    })

    if(college.length > 0) {
        res.status(200).send({ message: 'Colleges found', college: college })
    }
}

const getCourses = async (req, res) => {
    const collegeCode = req.params.collegeCode

    let collegeList = collegeCode.split('.')


    let course
    if(collegeCode != 'ALL'){
        if(collegeList.length > 1) {
            course = await courseModel.findAll({
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
        else {
            course = await courseModel.findAll({
                attributes: [
                    db.sequelize.fn(
                        'DISTINCT',
                        db.sequelize.col('courseCode')
                    ),
                    'courseCode',
                    'courseCollege'
                ],
                where: { courseCollege: collegeCode }
            })
        }
    }
    else {
        course = await courseModel.findAll({
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

    if(course.length > 0) {
        res.status(200).send({ message: 'Courses found.', course: course })
    }
}

module.exports = { 
    getColleges,
    getCourses
}