"use strict"

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

const getCourses = async (res, res) => {
    const collegeCode = req.params.collegeCode

    let course
    if(collegeCode != 'UNIV'){
        course = await courseModel.findAll({
            attributes: [
                db.sequelize.fn(
                    'DISTINCT',
                    db.sequelize.col('courseCode')
                ),
                'courseCode'
            ],
            where: { courseCollege: collegeCode }
        })
    }
    else {
        course = await courseModel.findAll({
            attributes: [
                db.sequelize.fn(
                    'DISTINCT',
                    db.sequelize.col('courseCode')
                ),
                'courseCode'
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