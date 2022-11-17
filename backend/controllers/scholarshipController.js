"use strict"

const db = require('../config/sequelize')
const scholarshipModel = db.scholarship

//--- GET SCHOLARSHIPS ---//
const getScholarships = async (req, res) => {
    const scholarships = await scholarshipModel.findAll({
        attributes: [
            'scholarship',
            'srf',
            'sfdf',
            'tuition',
            'lessAll',
            'active'
        ]
    })

    if(scholarships.length > 0) {
        res.status(200).send({ message: 'Scholarships found.', scholarships: scholarships })
    }
    else {
        res.status(500).send({ message: 'Scholarships not found.' })
    }
}

//--- GET SCHOLARSHIP ---//
const getScholarshipDetails = async (req, res) => {
    const scholarship = req.params.scholarship

    const scholarshipDetails = await scholarshipModel.findOne({
        attributes: [
            'scholarship',
            'srf',
            'sfdf',
            'tuition',
            'lessAll',
            'active'
        ],
        where: { scholarship: scholarship }
    })

    if(scholarshipDetails) {
        res.status(200).send({ message: 'Scholarship details found.', scholarshipDetails: scholarshipDetails })
    }
    else {
        res.status(500).send({ message: 'Scholarship details not found.' })
    }
}

module.exports = {
    getScholarships,
    getScholarshipDetails
}