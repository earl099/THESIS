"use strict"

const db = require('../config/sequelize')
const feesModel = db.fees

const getFeesByCourseSemAdmittedYearAdmittedSemAndSY = async (req, res) => {
    const semesteradmitted = req.params.semesteradmitted
    const yearadmitted = req.params.yearadmitted
    const semester = req.params.semester
    const schoolyear = req.params.schoolyear
    const course = req.params.course

    const fee = feesModel.findOne({
        attributes: [
            'labAnSci',
            'labBioSci',
            'labCEMDS',
            'labCropSci',
            'labHRM',
            'labEng',
            'labPhySci',
            'labVetMed',
            'labSpeech',
            'labEnglish',
            'labNursing',
            'ccl',
            'internet',
            'NSTP',
            'ojt',
            'thesis',
            'studentTeaching',
            'lateReg',
            'residency',
            'foreignStudent',
            'addedSubj',
            'petitionSubj',
            'tuition',
            'identification',
            'sfdf',
            'srf',
            'athletic',
            'scuaa',
            'deposit',
            'other',
            'miscLibrary',
            'miscMedical',
            'miscPublication',
            'miscRegistration',
            'miscGuidance',
            'rle',
            'labcspear',
            'mwRLE',
            'edfs',
            'psyc',
            'rletwo',
            'rlethree',
            'mwrletwo',
            'mwrlethree',
            'trm',
            'fishery'
        ],
        where: {
            course: course,
            semester: semester,
            schoolyear: schoolyear,
            semesteradmitted: semesteradmitted,
            yearadmitted: yearadmitted
        }
    })

    if(fee) {
        res.status(200).send({ message: 'Fees found', fee: fee })
    }
    else {
        res.status(500).send({ message: 'Error fetching fees.' })
    }
}

module.exports = { getFeesByCourseSemAdmittedYearAdmittedSemAndSY }