"use strict"

const { Op } = require('sequelize')
const db = require('../config/sequelize')
//validation models
const studEnrollModel = db.studEnroll
const subjEnrollModel = db.subjEnroll
const divOfFeesModel = db.divOfFees

//models needed for assessment
const assessListModel = db.assessList
const assessSubjModel = db.assessSubj
const courseModel = db.course
const scheduleModel = db.schedule
const feesModel = db.fees
const studentModel = db.student
const scholarshipModel = db.scholarship

const addStudEnroll = async (req, res) => {
    const {
        studentnumber,
        semester,
        schoolyear,
        edate,
        status,
        scholarship,
        majorCourse,
        yearLevel,
        statusII,
        coursenow,
        notuitionenroll
    } = req.body;
    
    const studEnroll = {
        studentnumber: studentnumber,
        semester: semester,
        schoolyear: schoolyear,
        edate: edate,
        status: status,
        scholarship: scholarship,
        majorCourse: majorCourse,
        yearLevel: yearLevel,
        statusII: statusII,
        coursenow: coursenow,
        notuitionenroll: notuitionenroll
    }

    try {
        const createdStudEnroll = await studEnrollModel.create(studEnroll);
        res.status(201).send({ createdStudEnroll: createdStudEnroll, message: 'Enrolled Student Added.' })
    }
    catch {
        res.status(500).send({ message: 'Error Adding Enrolled Student.' })
    }
    
}

const editStudEnroll = async (req, res) => {
    const studentnumber = req.params.studentnumber
    const Semester = req.params.semester
    const Schoolyear = req.params.schoolyear

    const {
        semester,
        schoolyear,
        edate,
        status,
        scholarship,
        majorCourse,
        yearLevel,
        statusII,
        coursenow,
        notuitionenroll
    } = req.body;

    const studEnroll = {
        semester,
        schoolyear,
        edate,
        status,
        scholarship,
        majorCourse,
        yearLevel,
        statusII,
        coursenow,
        notuitionenroll
    }

    const updatedStudEnroll = await studEnrollModel.update(studEnroll, { where: { studentnumber: studentnumber, semester: Semester, schoolyear: Schoolyear }})

    if(updatedStudEnroll[0] > 0) {
        res.status(200).send({ message: 'Student enrolled data updated successfully.', updatedStudEnroll: updatedStudEnroll })
    }
    else {
        res.status(500).send({ message: 'Student enrolled data could not be updated.' })
    }
}

const getStudsEnroll = async (req, res) => {
    const semester = req.params.semester
    const schoolyear = req.params.schoolyear
    const studsEnroll = await studEnrollModel.findAll({
        attributes: [
            'studentnumber',
            'semester',
            'schoolyear',
            'edate',
            'status',
            'scholarship',
            'majorCourse',
            'yearLevel',
            'statusII',
            'coursenow',
            'notuitionenroll'
        ],
        where: {
            semester: semester,
            schoolyear: schoolyear
        }
    })

    if(studsEnroll.length > 0) {
        res.status(200).send({ message: 'Students enrolled list found.', studsEnroll: studsEnroll })
    }
    else {
        res.status(500).send({ message: 'Students enrolled list not found.' })
    }
}

const getStudEnroll = async (req, res) => {
    const studentNumber = req.params.studentnumber
    const semester = req.params.semester
    const schoolyear = req.params.schoolyear
    const studEnroll = await studEnrollModel.findOne({
        attributes: [
            'studentnumber',
            'semester',
            'schoolyear',
            'edate',
            'status',
            'scholarship',
            'majorCourse',
            'yearLevel',
            'statusII',
            'coursenow',
            'notuitionenroll'
        ],
        where: { 
            studentnumber: studentNumber, 
            semester: semester, 
            schoolyear: schoolyear 
        }
    })

    if(studEnroll) {
        res.status(200).send({ message: 'Student enrolled data found', studEnroll: studEnroll })
    }
    else {
        res.status(500).send({ message: 'Student enrolled data not found.' })
    }
}

const addTransaction = async (req, res) => {
    //current date for assessment
    const currentDate = new Date()

    //parameters to put in routes
    const studentnumber = req.params.studentnumber
    const semester = req.params.semester
    const schoolyear = req.params.schoolyear
    
    //assessed student to student enroll
    const studentInfo = await studentModel.findOne({
        attributes: [
            'firstName',
            'lastName',
            'middleName',
            'course',
            'citizenship',
            'yearAdmitted',
            'SemesterAdmitted'
        ],
        where: { studentNumber: studentnumber }
    })  

    const assessedStud = await assessListModel.findOne({
        attributes: [
            'studentnumber',
            'StudentStatus',
            'scholarship',
            'yearLevel',
            'majorCourse',
            'statusII'
        ],
        where: { 
            studentnumber: studentnumber, 
            semester: semester, 
            schoolyear: schoolyear 
        }
    })

    const scholarship = await scholarshipModel.findOne({
        attributes: [
            'scholarship',
            'srf',
            'sfdf',
            'tuition',
            'lessAll',
            'active'
        ],
        where: { scholarship: assessedStud.scholarship }
    })

    //for creating the notuitionenroll field
    let notuitionenroll
    if(assessedStud.scholarship == 'RA 10931') {
        notuitionenroll = 'True'
    }
    else {
        notuitionenroll = 'FALSE'
    }

    //object for studentenroll
    const studEnrollObject = {
        studentnumber: studentnumber,
        semester: semester,
        schoolyear: schoolyear,
        edate: 
            currentDate.getFullYear() + '-' + 
            currentDate.getMonth() + '-' +
            currentDate.getDate() + ' ' +
            currentDate.getHours() + ':' +
            currentDate.getMinutes() + ':' +
            currentDate.getSeconds(),
        status: assessedStud.StudentStatus,
        scholarship: assessedStud.scholarship,
        majorCourse: assessedStud.majorCourse,
        yearLevel: assessedStud.yearLevel,
        statusII: assessedStud.statusII,
        coursenow: studentInfo.course,
        notuitionenroll: notuitionenroll
    }

    //assessed subject to subject enrolled
    const assessSubj = await assessSubjModel.findAll({
        attributes: [
            'studentNumber',
            'schedcode',
            'semester',
            'dateAssess',
            'schoolyear',
            'dateAssess',
            'id'
        ],
        where: {
            studentNumber: studentnumber,
            semester: semester,
            schoolyear: schoolyear
        }
    })
    
    
    
    //dividionoffees calculation
    //fetching base value for calculation of fees  
    const feesBase = await feesModel.findOne({
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
            course: studentInfo.course,
            semester: semester,
            schoolyear: schoolyear,
            semesteradmitted: studentInfo.SemesterAdmitted,
            yearadmitted: studentInfo.yearAdmitted
        }
    })

    //ANSCI, BIOSCI, CEMDS, HRM, CROPSCI, ENGINEERING, PHYSCI, VETMED, SPEECH, 
    //ENGLISH, NURSING, CCL, RLE, CSPEAR, EDFS, PSYC, TRM, FISHERY, STUDENT TEACHING, NSTP
    //--- ^^^MULTIPLIERS^^^ ---//
    const labFeeMultiplier = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

    //OJT, PETITION, THESIS, INTERNET, RESIDENCY, FOREIGN STUDENT CHECKER
    const otherFeeChecker = [0,0,0,0,0,0]

    //Total units
    let totalUnits = 0
    let slots = 0

    for(let i = 0; i < assessSubj.length; i++) {
        
        const schedcodeList = await scheduleModel.findOne({
            attributes: [
                'schedcode',
                'subjectype',
                'units',
                'labunits',
                'ojt',
                'petition',
                'thesis',
                'internet',
                'residency',
                'slots'
            ],
            where: {
                schedcode: assessSubj[i].schedcode,
                semester: semester, 
                schoolyear: schoolyear 
            }
        })

        switch (schedcodeList.subjectype) {
            case 'AN SCI':
                for(let i = 0; i < schedcodeList.labunits; i++ ) {
                    labFeeMultiplier[0]++
                }                
                break
            case 'BIO SCI':
                for(let i = 0; i < schedcodeList.labunits; i++ ) {
                    labFeeMultiplier[1]++
                }                
                break
            case 'CEMDS':
                for(let i = 0; i < schedcodeList.labunits; i++ ) {
                    labFeeMultiplier[2]++
                }                
                break
            case 'HRM':
                for(let i = 0; i < schedcodeList.labunits; i++ ) {
                    labFeeMultiplier[3]++
                }
                break
            case 'CROP SCI':
                for(let i = 0; i < schedcodeList.labunits; i++ ) {
                    labFeeMultiplier[4]++
                }                
                break
            case 'ENGINEERING':
                for(let i = 0; i < schedcodeList.labunits; i++ ) {
                    labFeeMultiplier[5]++
                }
                
                break
            case 'PHY SCI':
                for(let i = 0; i < schedcodeList.labunits; i++ ) {
                    labFeeMultiplier[6]++
                }                
                break
            case 'VET':
                for(let i = 0; i < schedcodeList.labunits; i++ ) {
                    labFeeMultiplier[7]++
                }
                
                break
            case 'SPEECH':
                for(let i = 0; i < schedcodeList.labunits; i++) {
                    labFeeMultiplier[8]++
                }
                
                break
            case 'ENGLISH LAB':
                for(let i = 0; i < schedcodeList.labunits; i++ ) {
                    labFeeMultiplier[9]++
                }
                
                break
            case 'NURSING LAB':
                for(let i = 0; i < schedcodeList.labunits; i++ ) {
                    labFeeMultiplier[10]++
                }                
                break
            case 'CCL':
                for(let i = 0; i < schedcodeList.labunits; i++ ) {
                    labFeeMultiplier[11]++
                }                
                break
            case 'RLE':
            case 'RLE 2':
            case 'RLE 3':
            case 'RLE 4':
            case 'MWRLE 2':
            case 'MWRLE 3':
                for(let i = 0; i < schedcodeList.labunits; i++ ) {
                    labFeeMultiplier[12]++
                }
                
                break
            case 'CSPEAR':
                for(let i = 0; i < schedcodeList.labunits; i++ ) {
                    labFeeMultiplier[13]++
                }
                
                break
            case 'EDFS':
                for(let i = 0; i < schedcodeList.labunits; i++ ) {
                    labFeeMultiplier[14]++
                }                
                break
            case 'PSYC':
                for(let i = 0; i < schedcodeList.labunits; i++ ) {
                    labFeeMultiplier[15]++
                }                
                break
            case 'TRM':
                for(let i = 0; i < schedcodeList.labunits; i++ ) {
                    labFeeMultiplier[16]++
                }                
                break
            case 'FISHERY':
                for(let i = 0; i < schedcodeList.labunits; i++ ) {
                    labFeeMultiplier[17]++
                }
                
                break
            case 'STUDENT TEACHING':
                for(let i = 0; i < schedcodeList.labunits; i++ ) {
                    labFeeMultiplier[18]++
                }
                
                break
            case 'NSTP':
                labFeeMultiplier[19]++
                break 
            default:
                break
        }
    }

    //OTHER FEES CHECKER AND CALCULATION OF TOTAL UNITS
    for(let i = 0; i < assessSubj.length; i++) {
        const schedcodeList = await scheduleModel.findOne({
            attributes: [
                'schedcode',
                'subjectype',
                'units',
                'labunits',
                'ojt',
                'petition',
                'thesis',
                'internet',
                'residency'
            ],
            where: {
                schedcode: assessSubj[i].schedcode,
                semester: semester, 
                schoolyear: schoolyear 
            }
        })

        //OTHER FEES
        switch (schedcodeList.ojt) {
            case 'Y':
                if (otherFeeChecker[0] > 0) {
                    break
                } else {
                    otherFeeChecker[0]++    
                }
                
                break;
        }
        switch (schedcodeList.petition) {
            case 'Y':
                otherFeeChecker[1]++
                break;
        }
        switch (schedcodeList.thesis) {
            case 'Y':
                if(otherFeeChecker[2] > 0) {
                    break
                }
                else {
                    otherFeeChecker[2]++
                }
                
                break;
        }
        switch (schedcodeList.internet) {
            case 'Y':
                if(otherFeeChecker[3] > 0) {
                    break
                }
                else {
                    otherFeeChecker[3]++
                }
                
                break;
        }
        switch (schedcodeList.residency) {
            case 'Y':
                if(otherFeeChecker[4] > 0) {
                    break
                }
                else {
                    otherFeeChecker[4]++
                }
                
                break;
        }

        //TOTAL UNITS
        totalUnits += Number(schedcodeList.units) + Number(schedcodeList.labunits)
    }

    //FOREIGN STUDENT CHECKER
    switch(studentInfo.citizenship) {
        case !'FILIPINO':
            otherFeeChecker[5]++
            break
    }

    //DIVIDIONOFFEES OBJECT CREATION
    const totalTuition = totalUnits * feesBase.tuition
    const rleFee = Number(feesBase.rle) + Number(feesBase.rletwo) + 
                Number(feesBase.rlethree) + Number(feesBase.mwRLE) + 
                Number(feesBase.mwrletwo) + Number(feesBase.mwrlethree)

    const divOfFeesObject = {
        studentnumber: studentnumber,
        semester: semester,
        schoolyear: schoolyear,
        ansci: labFeeMultiplier[0] * feesBase.labAnSci,
        biosci: labFeeMultiplier[1] * feesBase.labBioSci,
        cemds: labFeeMultiplier[2] * feesBase.labCEMDS,
        hrm: labFeeMultiplier[3] * feesBase.labHRM,
        cropsci: labFeeMultiplier[4] * feesBase.labCropSci,
        engineering: labFeeMultiplier[5] * feesBase.labEng,
        physci: labFeeMultiplier[6] * feesBase.labPhySci,
        vetmed: labFeeMultiplier[7] * feesBase.labVetMed,
        speech: labFeeMultiplier[8] * feesBase.labSpeech,
        english: labFeeMultiplier[9] * feesBase.labEnglish,
        nursing: labFeeMultiplier[10] * feesBase.labNursing,
        ccl: labFeeMultiplier[11] * feesBase.ccl,
        rle: labFeeMultiplier[12] * rleFee,
        internet: otherFeeChecker[3] * feesBase.internet,
        nstp: labFeeMultiplier[19] * feesBase.NSTP,
        ojt: otherFeeChecker[0] * feesBase.ojt,
        thesis: otherFeeChecker[2] * feesBase.thesis,
        student: labFeeMultiplier[18] * feesBase.studentTeaching,
        residency: otherFeeChecker[4] * feesBase.residency,
        foreignstudent: otherFeeChecker[5] * feesBase.foreignStudent,
        tuition: totalTuition - (totalTuition * (scholarship.tuition / 100)),
        library: feesBase.miscLibrary,
        medical: feesBase.miscMedical,
        publication: feesBase.miscPublication,
        registration: feesBase.miscRegistration,
        guidance: feesBase.miscGuidance,
        id: feesBase.identification,
        sfdf: feesBase.sfdf - (feesBase.sfdf * (scholarship.sfdf / 100)),
        srf: feesBase.srf - (feesBase.srf * (scholarship.srf / 100)),
        athletic: feesBase.athletic,
        scuaa: feesBase.scuaa,
        deposit: feesBase.deposit,
        cspear: labFeeMultiplier[13] * feesBase.labcspear,
        edfs: labFeeMultiplier[14] * feesBase.edfs,
        psyc: labFeeMultiplier[15] * feesBase.psyc,
        trm: labFeeMultiplier[16] * feesBase.trm,
        fishery: labFeeMultiplier[17] * feesBase.fishery,
    }

    //TRANSACTION
    let transaction
    try {
        transaction = await db.sequelize.transaction()
        
        //object for creating subject enrolled
        for(let i = 0; i < assessSubj.length; i++){
            const subjEnrollObject = {
                studentnumber: studentnumber,
                schedcode: assessSubj[i].schedcode,
                edate: 
                String(currentDate.getFullYear() + '-' + 
                currentDate.getMonth() + '-' +
                currentDate.getDate() + ' ' +
                currentDate.getHours() + ':' +
                currentDate.getMinutes() + ':' +
                currentDate.getSeconds()),
                semester: semester,
                schoolyear: schoolyear,
                evaluate: 'N'
            }

            slots = Number(schedcodeList.slots)--
            await scheduleModel.update({ slots: slots }, {
                where: {
                    schedcode: assessSubj[i].schedcode
                }
            }, { transaction })

            //creating subjectenrolled data
            try {
                await subjEnrollModel.create(subjEnrollObject)
            } catch (error) {
                res.status(500).send({ error: error, message: 'Error Adding Subject' })
            }
            
        }

        //CREATING STUDENROLL, SUBJENROLL, DIVIDIONOFFEES DATA
        let subjEnrollList
        let schedule = new Array()
        let studEnroll
        let divOfFees
        let scholarship
        try {
            studEnroll = await studEnrollModel.create(studEnrollObject, { transaction })
            
            subjEnrollList = await subjEnrollModel.findAll({
                attributes: [
                    'studentnumber',
                    'schedcode',
                    'edate',
                    'status',
                    'semester',
                    'schoolyear',
                    'evaluate'
                ],
                where: { 
                    studentnumber: studentnumber, 
                    semester: semester, 
                    schoolyear: schoolyear 
                }
            }, { transaction })

            for(let i = 0; i < subjEnrollList.length; i++) {
                let tmpData = await scheduleModel.findOne({
                    attributes: [
                        'schedcode',
                        'subjectCode',
                        'units',
                        'labunits',
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
                    where: { schedcode: subjEnrollList[i].schedcode }
                }, { transaction })

                schedule.push(tmpData)
            }

            divOfFees = await divOfFeesModel.create(divOfFeesObject, { transaction })
            
            scholarship = await scholarshipModel.findOne({
                attributes: [
                    'scholarship',
                    'srf',
                    'sfdf',
                    'tuition'
                ],
                where: { scholarship: studEnroll.scholarship }
            }, { transaction })

            res.status(200).send({ 
                message: 'Student Validation Success', 
                studEnroll: studEnroll, 
                subjEnrollList: subjEnrollList,
                schedule: schedule,
                scholarship: scholarship,
                divOfFees: divOfFees
                
            })
        } catch (error) {
            res.status(500).send({ error: error, message: 'Error Validating Student.' })
        }

        transaction.commit()
    }
    catch (error) {
        if(transaction){
            transaction.rollback()
            res.status(500).send({ message: 'Internal Server Error', error: error })
        }
    }
}

const addSubjTransaction = async (req, res) => {
    //PREPARING OBJECTS FOR TRANSACTION
    const studentnumber = req.params.studentnumber
    const semester = req.params.semester
    const schoolyear = req.params.schoolyear
    const { subjNum } = req.body
    
    let subjCounter = 0
    let transaction = await db.sequelize.transaction()

    //STUDENT INFO
    const studentInfo = await studentModel.findOne({
        attributes: [
            'firstName',
            'lastName',
            'middleName',
            'course',
            'citizenship',
            'yearAdmitted',
            'SemesterAdmitted'
        ],
        where: { studentNumber: studentnumber }
    })

    const assessedStud = await assessListModel.findOne({
        attributes: [ 'scholarship' ],
        where: { 
            studentnumber: studentnumber, 
            semester: semester, 
            schoolyear: schoolyear 
        }
    })

    const scholarship = await scholarshipModel.findOne({
        attributes: [
            'scholarship',
            'srf',
            'sfdf',
            'tuition',
            'lessAll',
            'active'
        ],
        where: { scholarship: assessedStud.scholarship }
    })

    //BASE FEES
    const feesBase = await feesModel.findOne({
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
            course: studentInfo.course,
            semester: semester,
            schoolyear: schoolyear,
            semesteradmitted: studentInfo.SemesterAdmitted,
            yearadmitted: studentInfo.yearAdmitted
        }
    })

    //CHECKER IF THE STUDENT HAS ADDED SUBJECTS IN CURRENT FEES
    const addedSubjValue = await divOfFeesModel.findOne({
        attributes: [ 'addedSubj' ],
        where: { studentnumber: studentnumber, semester: semester, schoolyear: schoolyear }
    })

    //CREATING THE ADDED SUBJECTS OBJECT
    const { schedcode, edate } = req.body

    let subjEnrollData = {
        studentnumber: studentnumber,
        schedcode: schedcode,
        edate: edate,
        semester: semester,
        schoolyear: schoolyear
    }

    if((addedSubjValue.addedSubj / feesBase.addedSubj) > 0) {
        subjCounter = (addedSubjValue.addedSubj / feesBase.addedSubj)
    }
    subjCounter++

    try {
        await subjEnrollModel.create(subjEnrollData, { transaction })
    }
    catch {
        res.status(500).send({ message: 'Error Adding Subject' })
    }

    //ANSCI, BIOSCI, CEMDS, HRM, CROPSCI, ENGINEERING, PHYSCI, VETMED, SPEECH, 
    //ENGLISH, NURSING, CCL, RLE, CSPEAR, EDFS, PSYC, TRM, FISHERY, STUDENT TEACHING, NSTP
    //--- ^^^MULTIPLIERS^^^ ---//
    const labFeeMultiplier = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

    //OJT, PETITION, THESIS, INTERNET, RESIDENCY, FOREIGN STUDENT, ADDED SUBJECT CHECKER
    const otherFeeChecker = [0,0,0,0,0,0,subjCounter]

    //Total units
    let totalUnits = 0
    
    const subjEnrolledObj = await subjEnrollModel.findAll({
        where: {
            studentnumber: studentnumber,
            semester: semester,
            schoolyear: schoolyear
        }
    })
    


    for(let i = 0; i < subjEnrolledObj.length; i++) {
        const schedcodeList = await scheduleModel.findOne({
            attributes: [
                'schedcode',
                'subjectype',
                'units',
                'labunits',
                'ojt',
                'petition',
                'thesis',
                'internet',
                'residency'
            ],
            where: {
                schedcode: subjEnrolledObj[i].schedcode,
                semester: semester, 
                schoolyear: schoolyear 
            }
        })

        switch (schedcodeList.subjectype) {
            case 'AN SCI':
                labFeeMultiplier[0]++
                break
            case 'BIO SCI':
                labFeeMultiplier[1]++
                break
            case 'CEMDS':
                labFeeMultiplier[2]++
                break
            case 'HRM':
                labFeeMultiplier[3]++
                break
            case 'CROP SCI':
                labFeeMultiplier[4]++
                break
            case 'ENGINEERING':
                labFeeMultiplier[5]++
                break
            case 'PHY SCI':
                labFeeMultiplier[6]++
                break
            case 'VET':
                labFeeMultiplier[7]++
                break
            case 'SPEECH':
                labFeeMultiplier[8]++
                break
            case 'ENGLISH LAB':
                labFeeMultiplier[9]++
                break
            case 'NURSING LAB':
                labFeeMultiplier[10]++
                break
            case 'CCL':
                labFeeMultiplier[11]++
                break
            case 'RLE':
            case 'RLE 2':
            case 'RLE 3':
            case 'RLE 4':
            case 'MWRLE 2':
            case 'MWRLE 3':
                labFeeMultiplier[12]++
                break
            case 'CSPEAR':
                labFeeMultiplier[13]++
                break
            case 'EDFS':
                labFeeMultiplier[14]++
                break
            case 'PSYC':
                labFeeMultiplier[15]++
                break
            case 'TRM':
                labFeeMultiplier[16]++
                break
            case 'FISHERY':
                labFeeMultiplier[17]++
                break
            case 'STUDENT TEACHING':
                labFeeMultiplier[18]++
                break
            case 'NSTP':
                labFeeMultiplier[19]++
                break 
            default:
                break
        }
    }

    //OTHER FEES CHECKER AND CALCULATION OF TOTAL UNITS
    for(let i = 0; i < subjEnrolledObj.length; i++) {
        const schedcodeList = await scheduleModel.findOne({
            attributes: [
                'schedcode',
                'subjectype',
                'units',
                'labunits',
                'ojt',
                'petition',
                'thesis',
                'internet',
                'residency'
            ],
            where: {
                schedcode: subjEnrolledObj[i].schedcode,
                semester: semester, 
                schoolyear: schoolyear 
            }
        })

        //OTHER FEES
        switch (schedcodeList.ojt) {
            case 'Y':
                otherFeeChecker[0]++
                break;
        }
        switch (schedcodeList.petition) {
            case 'Y':
                otherFeeChecker[1]++
                break;
        }
        switch (schedcodeList.thesis) {
            case 'Y':
                otherFeeChecker[2]++
                break;
        }
        switch (schedcodeList.internet) {
            case 'Y':
                otherFeeChecker[3]++
                break;
        }
        switch (schedcodeList.residency) {
            case 'Y':
                otherFeeChecker[4]++
                break;
        }

        //TOTAL UNITS
        totalUnits += Number(schedcodeList.units) + Number(schedcodeList.labunits)
    }

    //FOREIGN STUDENT CHECKER
    switch(studentInfo.citizenship) {
        case !'FILIPINO':
            otherFeeChecker[5]++
            break
    }

    //DIVIDIONOFFEES OBJECT CREATION
    const totalTuition = totalUnits * feesBase.tuition
    const rleFee = Number(feesBase.rle) + Number(feesBase.rletwo) + 
                Number(feesBase.rlethree) + Number(feesBase.mwRLE) + 
                Number(feesBase.mwrletwo) + Number(feesBase.mwrlethree)

    const updatedDivOfFeesObject = {
        studentnumber: studentnumber,
        semester: semester,
        schoolyear: schoolyear,
        ansci: labFeeMultiplier[0] * feesBase.labAnSci,
        biosci: labFeeMultiplier[1] * feesBase.labBioSci,
        cemds: labFeeMultiplier[2] * feesBase.labCEMDS,
        hrm: labFeeMultiplier[3] * feesBase.labHRM,
        cropsci: labFeeMultiplier[4] * feesBase.labCropSci,
        engineering: labFeeMultiplier[5] * feesBase.labEng,
        physci: labFeeMultiplier[6] * feesBase.labPhySci,
        vetmed: labFeeMultiplier[7] * feesBase.labVetMed,
        speech: labFeeMultiplier[8] * feesBase.labSpeech,
        english: labFeeMultiplier[9] * feesBase.labEnglish,
        nursing: labFeeMultiplier[10] * feesBase.labNursing,
        ccl: labFeeMultiplier[11] * feesBase.ccl,
        rle: labFeeMultiplier[12] * rleFee,
        internet: otherFeeChecker[3] * feesBase.internet,
        nstp: labFeeMultiplier[19] * feesBase.NSTP,
        ojt: otherFeeChecker[0] * feesBase.ojt,
        thesis: otherFeeChecker[2] * feesBase.thesis,
        student: labFeeMultiplier[18] * feesBase.studentTeaching,
        residency: otherFeeChecker[4] * feesBase.residency,
        foreignstudent: otherFeeChecker[5] * feesBase.foreignStudent,
        addedsubj: otherFeeChecker[6] * feesBase.addedSubj,
        tuition: totalTuition - (totalTuition * (scholarship.tuition / 100)),
        library: feesBase.miscLibrary,
        medical: feesBase.miscMedical,
        publication: feesBase.miscPublication,
        registration: feesBase.miscRegistration,
        guidance: feesBase.miscGuidance,
        id: feesBase.identification,
        sfdf: feesBase.sfdf - (feesBase.sfdf * (scholarship.sfdf / 100)),
        srf: feesBase.srf - (feesBase.srf * (scholarship.srf / 100)),
        athletic: feesBase.athletic,
        scuaa: feesBase.scuaa,
        deposit: feesBase.deposit,
        cspear: labFeeMultiplier[13] * feesBase.labcspear,
        edfs: labFeeMultiplier[14] * feesBase.edfs,
        psyc: labFeeMultiplier[15] * feesBase.psyc,
        trm: labFeeMultiplier[16] * feesBase.trm,
        fishery: labFeeMultiplier[17] * feesBase.fishery,
    }

    //TRANSACTION
    let updatedSubjEnrolled
    let updatedDivOfFees
    try {
        //GETTING ALL SUBJECTS ENROLLED
        try {
            updatedSubjEnrolled = await subjEnrollModel.findAll({
                attributes: [
                    'studentnumber',
                    'schedcode',
                    'edate',
                    'semester',
                    'schoolyear'
                ],
                where: {
                    studentnumber: studentnumber,
                    semester: semester,
                    schoolyear: schoolyear
                }
            },
            { transaction })
        } catch (error) {
            res.status(500).send({ error: error, message: 'Error in Updated Subject Enrolled' })
            return
        }


        //UPDATE DIVISION OF FEES
        try {
            updatedDivOfFees = await divOfFeesModel.update(
                updatedDivOfFeesObject, 
                { 
                    where: 
                    {
                        studentnumber: studentnumber,
                        semester: semester,
                        schoolyear: schoolyear
                    } 
                }, { transaction: transaction })
        } catch (error) {
            res.status(500).send({ error: error, message: 'Error in Updated Div of Fees' })
            return
        }




        res.status(200).send({
            message: 'Transaction Completed successfully.',
            updatedDivOfFees: updatedDivOfFees,
            updatedSubjEnrolled: updatedSubjEnrolled
        })
        transaction.commit()
    } catch (error) {
        transaction.rollback()
        res.status(500).send({ error: error, message: 'Error in Transaction' })
    }
}

const dropSubjTransaction = async (req, res) => {
    //--- INITIAL VARIABLES ---//
    const studentnumber = req.params.studentnumber
    const semester = req.params.semester
    const schoolyear = req.params.schoolyear
    let transaction = await db.sequelize.transaction()

    let slots = 0

    //--- STUDENT INFO FOR REEVALUATION OF DIVISION OF FEES ---//
    const studentInfo = await studentModel.findOne({
        attributes: [
            'firstName',
            'lastName',
            'middleName',
            'course',
            'citizenship',
            'yearAdmitted',
            'SemesterAdmitted'
        ],
        where: { studentNumber: studentnumber }
    })

    const assessedStud = await assessListModel.findOne({
        attributes: [ 'scholarship' ],
        where: { 
            studentnumber: studentnumber, 
            semester: semester, 
            schoolyear: schoolyear 
        }
    })

    const scholarship = await scholarshipModel.findOne({
        attributes: [
            'scholarship',
            'srf',
            'sfdf',
            'tuition',
            'lessAll',
            'active'
        ],
        where: { scholarship: assessedStud.scholarship }
    })

    //for creating the notuitionenroll field
    let notuitionenroll
    if(assessedStud.scholarship == 'RA 10931') {
        notuitionenroll = 'True'
    }
    else {
        notuitionenroll = 'FALSE'
    }

    //BASE FEES
    const feesBase = await feesModel.findOne({
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
            course: studentInfo.course,
            semester: semester,
            schoolyear: schoolyear,
            semesteradmitted: studentInfo.SemesterAdmitted,
            yearadmitted: studentInfo.yearAdmitted
        }
    })

    //SEARCH ALL ASSESSED SUBJECTS BY STUDENT FOR CHECKING IF THE DROPPED SUBJECT IS AN ADDED SUBJECT
    const assessSubjs =  await assessSubjModel.findAll({ 
        where: {
            studentnumber: studentnumber,
            semester: semester,
            schoolyear: schoolyear
        } 
    })

    //SEARCH ALL SUBJECTS ENROLLED BY STUDENT
    const subjEnrolled = await subjEnrollModel.findAll({
        where:{
            studentnumber: studentnumber,
            semester: semester,
            schoolyear: schoolyear
        }
    })

    const { schedcode } = req.body

    //CHECKS SCHEDCODE IN ASSESSED SUBJECTS
    let assessedCounter = 0
    for (let i = 0; i < assessSubjs.length; i++) {
        //CHANGES VALUE OF ASSESSEDCOUNTER TO I IF SCHEDCODE IS EQUAL TO ASSESSEDSUBJS SCHEDCODE
        if(schedcode == assessSubjs[i].schedcode) {
            assessedCounter = i
            break
        }
    }

    //CHECKS SCHEDCODE IN SUBJECTS ENROLLED
    let subjEnrolledCounter = 0
    for (let i = 0; i < subjEnrolled.length; i++) {
        //SETS SUBJENROLLEDCOUNTER TO I IF 
        if(schedcode == subjEnrolled[i].schedcode) {
            subjEnrolledCounter = i;
            break
        }
    }

    //CHECKS IF THE SUBJECT IS AN ADDED SUBJECT
    let divOfFeesObject
    if(assessedCounter > subjEnrolled.length) {
        //DROP SUBJECT INDEX SUBJENROLLEDCOUNTER
        await subjEnrollModel.destroy({ 
            where: { 
                schedcode: subjEnrolled[subjEnrolledCounter].schedcode, 
                studentnumber: studentnumber, 
                semester: semester,
                schoolyear: schoolyear
            }
        }, { transaction })
    }
    else {
        console.log(assessedCounter)
        //DROP SUBJECT INDEX ASSESSEDCOUNTER
        await subjEnrollModel.destroy({
            where: {
                schedcode: subjEnrolled[assessedCounter].schedcode,
                studentnumber: studentnumber, 
                semester: semester,
                schoolyear: schoolyear
            }
        }, { transaction })
    }

    //ANSCI, BIOSCI, CEMDS, HRM, CROPSCI, ENGINEERING, PHYSCI, VETMED, SPEECH, 
    //ENGLISH, NURSING, CCL, RLE, CSPEAR, EDFS, PSYC, TRM, FISHERY, STUDENT TEACHING, NSTP
    //--- ^^^MULTIPLIERS^^^ ---//
    const labFeeMultiplier = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

    //OJT, PETITION, THESIS, INTERNET, RESIDENCY, FOREIGN STUDENT, ADDED SUBJECT CHECKER
    const otherFeeChecker = [0,0,0,0,0,0]

    //Total units
    let totalUnits = 0
    
    const subjEnrolledObj = await subjEnrollModel.findAll({
        where: {
            studentnumber: studentnumber,
            semester: semester,
            schoolyear: schoolyear
        }
    }, { transaction })
    


    for(let i = 0; i < subjEnrolledObj.length; i++) {
        const schedcodeList = await scheduleModel.findOne({
            attributes: [
                'schedcode',
                'subjectype',
                'units',
                'labunits',
                'ojt',
                'petition',
                'thesis',
                'internet',
                'residency'
            ],
            where: {
                schedcode: subjEnrolledObj[i].schedcode,
                semester: semester, 
                schoolyear: schoolyear 
            }
        }, { transaction })

        //SLOTS
        let slots = 0
        slots = Number(schedcodeList.slots)
        await scheduleModel.update({ slots: slots }, {
            where: {
                studentnumber: studentnumber,
                schedcode: schedcodeList.schedcode
            }
        }, { transaction })

        switch (schedcodeList.subjectype) {
            case 'AN SCI':
                labFeeMultiplier[0]++
                break
            case 'BIO SCI':
                labFeeMultiplier[1]++
                break
            case 'CEMDS':
                labFeeMultiplier[2]++
                break
            case 'HRM':
                labFeeMultiplier[3]++
                break
            case 'CROP SCI':
                labFeeMultiplier[4]++
                break
            case 'ENGINEERING':
                labFeeMultiplier[5]++
                break
            case 'PHY SCI':
                labFeeMultiplier[6]++
                break
            case 'VET':
                labFeeMultiplier[7]++
                break
            case 'SPEECH':
                labFeeMultiplier[8]++
                break
            case 'ENGLISH LAB':
                labFeeMultiplier[9]++
                break
            case 'NURSING LAB':
                labFeeMultiplier[10]++
                break
            case 'CCL':
                labFeeMultiplier[11]++
                break
            case 'RLE':
            case 'RLE 2':
            case 'RLE 3':
            case 'RLE 4':
            case 'MWRLE 2':
            case 'MWRLE 3':
                labFeeMultiplier[12]++
                break
            case 'CSPEAR':
                labFeeMultiplier[13]++
                break
            case 'EDFS':
                labFeeMultiplier[14]++
                break
            case 'PSYC':
                labFeeMultiplier[15]++
                break
            case 'TRM':
                labFeeMultiplier[16]++
                break
            case 'FISHERY':
                labFeeMultiplier[17]++
                break
            case 'STUDENT TEACHING':
                labFeeMultiplier[18]++
                break
            case 'NSTP':
                labFeeMultiplier[19]++
                break 
            default:
                break
        }
    }

    //OTHER FEES CHECKER AND CALCULATION OF TOTAL UNITS
    for(let i = 0; i < subjEnrolledObj.length; i++) {
        const schedcodeList = await scheduleModel.findOne({
            attributes: [
                'schedcode',
                'subjectype',
                'units',
                'labunits',
                'ojt',
                'petition',
                'thesis',
                'internet',
                'residency'
            ],
            where: {
                schedcode: subjEnrolledObj[i].schedcode,
                semester: semester, 
                schoolyear: schoolyear 
            }
        }, { transaction })

        //OTHER FEES
        switch (schedcodeList.ojt) {
            case 'Y':
                otherFeeChecker[0]++
                break;
        }
        switch (schedcodeList.petition) {
            case 'Y':
                otherFeeChecker[1]++
                break;
        }
        switch (schedcodeList.thesis) {
            case 'Y':
                otherFeeChecker[2]++
                break;
        }
        switch (schedcodeList.internet) {
            case 'Y':
                otherFeeChecker[3]++
                break;
        }
        switch (schedcodeList.residency) {
            case 'Y':
                otherFeeChecker[4]++
                break;
        }

        //TOTAL UNITS
        totalUnits += Number(schedcodeList.units) + Number(schedcodeList.labunits)
    }

    //FOREIGN STUDENT CHECKER
    switch(studentInfo.citizenship) {
        case !'FILIPINO':
            otherFeeChecker[5]++
            break
    }

    //DIVIDIONOFFEES OBJECT CREATION
    const totalTuition = totalUnits * feesBase.tuition
    const rleFee = Number(feesBase.rle) + Number(feesBase.rletwo) + 
                Number(feesBase.rlethree) + Number(feesBase.mwRLE) + 
                Number(feesBase.mwrletwo) + Number(feesBase.mwrlethree)

    //CALCULATION OF DIVISION OF FEES
    divOfFeesObject = {
        studentnumber: studentnumber,
        semester: semester,
        schoolyear: schoolyear,
        ansci: labFeeMultiplier[0] * feesBase.labAnSci,
        biosci: labFeeMultiplier[1] * feesBase.labBioSci,
        cemds: labFeeMultiplier[2] * feesBase.labCEMDS,
        hrm: labFeeMultiplier[3] * feesBase.labHRM,
        cropsci: labFeeMultiplier[4] * feesBase.labCropSci,
        engineering: labFeeMultiplier[5] * feesBase.labEng,
        physci: labFeeMultiplier[6] * feesBase.labPhySci,
        vetmed: labFeeMultiplier[7] * feesBase.labVetMed,
        speech: labFeeMultiplier[8] * feesBase.labSpeech,
        english: labFeeMultiplier[9] * feesBase.labEnglish,
        nursing: labFeeMultiplier[10] * feesBase.labNursing,
        ccl: labFeeMultiplier[11] * feesBase.ccl,
        rle: labFeeMultiplier[12] * rleFee,
        internet: otherFeeChecker[3] * feesBase.internet,
        nstp: labFeeMultiplier[19] * feesBase.NSTP,
        ojt: otherFeeChecker[0] * feesBase.ojt,
        thesis: otherFeeChecker[2] * feesBase.thesis,
        student: labFeeMultiplier[18] * feesBase.studentTeaching,
        residency: otherFeeChecker[4] * feesBase.residency,
        foreignstudent: otherFeeChecker[5] * feesBase.foreignStudent,
        addedsubj: subjNum * feesBase.addedSubj,
        tuition: totalTuition - (totalTuition * (scholarship.tuition / 100)),
        library: feesBase.miscLibrary,
        medical: feesBase.miscMedical,
        publication: feesBase.miscPublication,
        registration: feesBase.miscRegistration,
        guidance: feesBase.miscGuidance,
        id: feesBase.identification,
        sfdf: feesBase.sfdf - (feesBase.sfdf * (scholarship.sfdf / 100)),
        srf: feesBase.srf - (feesBase.srf * (scholarship.srf / 100)),
        athletic: feesBase.athletic,
        scuaa: feesBase.scuaa,
        deposit: feesBase.deposit,
        cspear: labFeeMultiplier[13] * feesBase.labcspear,
        edfs: labFeeMultiplier[14] * feesBase.edfs,
        psyc: labFeeMultiplier[15] * feesBase.psyc,
        trm: labFeeMultiplier[16] * feesBase.trm,
        fishery: labFeeMultiplier[17] * feesBase.fishery,
    }
    

    //TRANSACTION
    let updatedDivOfFees
    try {
        updatedDivOfFees = await divOfFeesModel.update(
            divOfFeesObject,
            {
                where: 
                {
                    studentnumber: studentnumber,
                    semester: semester,
                    schoolyear: schoolyear
                }
            },
            { transaction }
        )

        res.status(200).send({
            message: 'Transaction Completed successfully.',
            updatedSubjEnrolled: subjEnrolledObj,
            updatedDivOfFees: updatedDivOfFees
        })
        transaction.commit()
    } catch (error) {
        res.status(500).send({ message: 'Error in Transaction' })
        transaction.rollback()
    }
}

const getSchoolyear = async (req, res) => {
    const schoolyear = await studEnrollModel.findAll({
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

const searchEnrolled = async (req, res) => {
    const {
        collegeCode,
        courseCode,
        semester,
        schoolyear,
        gender,
        scholarship
    } = req.body

    let collegeList = collegeCode.split('.')
    let courseList
    let finalCourseList = []

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

    //object for final response
    let objRes = []
    let studInfoResult = []

    //specific college
    if(collegeCode != 'UNIV') {

        //specific course
        if(courseCode != 'ALL') {

            //specific gender
            if(gender != 'ALL') {
                let enrolledResult

                //sem specific
                if(semester != 'ALL') {
                    //sy spcific
                    if(schoolyear != 'ALL') {
                        if(scholarship != 'ALL') {
                            enrolledResult = await studEnrollModel.findAll({
                                attributes: [
                                    'studentnumber',
                                    'semester',
                                    'schoolyear',
                                    'scholarship'
                                ],
                                where: { 
                                    semester: semester, 
                                    schoolyear: schoolyear,
                                    scholarship: scholarship,
                                    coursenow: courseCode
                                }
                            })
                        }
                        else {
                            enrolledResult = await studEnrollModel.findAll({
                                attributes: [
                                    'studentnumber',
                                    'semester',
                                    'schoolyear',
                                    'scholarship'
                                ],
                                where: { 
                                    semester: semester, 
                                    schoolyear: schoolyear,
                                    coursenow: courseCode
                                }
                            })
                        }
                    }
                    else {
                        if(scholarship != 'ALL') {
                            enrolledResult = await studEnrollModel.findAll({
                                attributes: [
                                    'studentnumber',
                                    'semester',
                                    'schoolyear',
                                    'scholarship'
                                ],
                                where: { 
                                    semester: semester,
                                    scholarship: scholarship, 
                                    coursenow: courseCode
                                }
                            })
                        }
                        else {
                            enrolledResult = await studEnrollModel.findAll({
                                attributes: [
                                    'studentnumber',
                                    'semester',
                                    'schoolyear',
                                    'scholarship'
                                ],
                                where: { 
                                    semester: semester, 
                                    coursenow: courseCode
                                }
                            })
                        }
                        
                    }
                }
                else {
                    if(schoolyear != 'ALL') {
                        if(scholarship != 'ALL') {
                            enrolledResult = await studEnrollModel.findAll({
                                attributes: [
                                    'studentnumber',
                                    'semester',
                                    'schoolyear',
                                    'scholarship'
                                ],
                                where: {
                                    schoolyear: schoolyear,
                                    scholarship: scholarship,
                                    coursenow: courseCode
                                }
                            })
                        }
                        else {
                            enrolledResult = await studEnrollModel.findAll({
                                attributes: [
                                    'studentnumber',
                                    'semester',
                                    'schoolyear',
                                    'scholarship'
                                ],
                                where: { 
                                    schoolyear: schoolyear,
                                    coursenow: courseCode
                                }
                            })
                        }
                    }
                    else {
                        if(scholarship != 'ALL') {
                            enrolledResult = await studEnrollModel.findAll({
                                attributes: [
                                    'studentnumber',
                                    'semester',
                                    'schoolyear',
                                    'scholarship'
                                ],
                                where: {
                                    scholarship: scholarship,
                                    coursenow: courseCode
                                }
                            })
                        }
                        else {
                            enrolledResult = await studEnrollModel.findAll({
                                attributes: [
                                    'studentnumber',
                                    'semester',
                                    'schoolyear',
                                    'scholarship'
                                ],
                                where: {
                                    coursenow: courseCode
                                }
                            })
                        }
                    }
                    
                }

                for (let i = 0; i < enrolledResult.length; i++) {
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
                            studentNumber: enrolledResult[i].studentnumber,
                            course: courseCode,
                            gender: gender
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(enrolledResult[i])
                }
            }

            //college and course are specific but gender is not
            else {
                let enrolledResult 
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    enrolledResult = await studEnrollModel.findAll({
                        attributes: [
                            'studentnumber',
                            'semester',
                            'schoolyear'
                        ],
                        where: { 
                            semester: semester, 
                            schoolyear: schoolyear,
                            coursenow: courseCode
                        }
                    })
                }
                else {
                    enrolledResult = await studEnrollModel.findAll({
                        attributes: [
                            'studentnumber',
                            'semester',
                            'schoolyear'
                        ],
                        where: {
                            coursenow: courseCode
                        }
                    })
                }

                for (let i = 0; i < enrolledResult.length; i++) {
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
                            studentNumber: enrolledResult[i].studentnumber,
                            course: courseCode
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(enrolledResult[i])
                }
            }
        }
        else {
            //college and gender are specific, but course is not
            if(gender != 'ALL') {
                let enrolledResult
                
                //sem specific
                if(semester != 'ALL') {
                    //sy specific
                    if(schoolyear != 'ALL') {
                        //scholarship specific
                        if(scholarship != 'ALL') {
                            enrolledResult = await studEnrollModel.findAll({
                                attributes: [
                                    'studentnumber',
                                    'semester',
                                    'schoolyear',
                                    'scholarship'
                                ],
                                where: { 
                                    semester: semester, 
                                    schoolyear: schoolyear,
                                    scholarship: scholarship,
                                    coursenow: finalCourseList
                                }
                            })
                        }
                        else {
                            enrolledResult = await studEnrollModel.findAll({
                                attributes: [
                                    'studentnumber',
                                    'semester',
                                    'schoolyear',
                                    'scholarship'
                                ],
                                where: { 
                                    semester: semester, 
                                    schoolyear: schoolyear,
                                    coursenow: finalCourseList
                                }
                            })
                        }
                    }
                    else {
                        if(scholarship != 'ALL') {
                            enrolledResult = await studEnrollModel.findAll({
                                attributes: [
                                    'studentnumber',
                                    'semester',
                                    'schoolyear',
                                    'scholarship'
                                ],
                                where: { 
                                    semester: semester,
                                    scholarship: scholarship,
                                    coursenow: finalCourseList
                                }
                            })
                        }
                        else {
                            enrolledResult = await studEnrollModel.findAll({
                                attributes: [
                                    'studentnumber',
                                    'semester',
                                    'schoolyear',
                                    'scholarship'
                                ],
                                where: { 
                                    semester: semester, 
                                    coursenow: finalCourseList
                                }
                            })
                        }
                    }
                    
                }
                else {
                    if(schoolyear != 'ALL') {
                        if(scholarship != 'ALL') {
                            enrolledResult = await studEnrollModel.findAll({
                                attributes: [
                                    'studentnumber',
                                    'semester',
                                    'schoolyear',
                                    'scholarship'
                                ],
                                where: {
                                    schoolyear: schoolyear,
                                    scholarship: scholarship,
                                    coursenow: finalCourseList
                                }
                            })
                        }
                        else {
                            enrolledResult = await studEnrollModel.findAll({
                                attributes: [
                                    'studentnumber',
                                    'semester',
                                    'schoolyear',
                                    'scholarship'
                                ],
                                where: {
                                    schoolyear: schoolyear,
                                    coursenow: finalCourseList
                                }
                            })
                        }
                    }
                    else {
                        if(scholarship != 'ALL') {
                            enrolledResult = await studEnrollModel.findAll({
                                attributes: [
                                    'studentnumber',
                                    'semester',
                                    'schoolyear',
                                    'scholarship'
                                ],
                                where: {
                                    scholarship: scholarship,
                                    coursenow: finalCourseList
                                }
                            })
                        }
                        else {
                            enrolledResult = await studEnrollModel.findAll({
                                attributes: [
                                    'studentnumber',
                                    'semester',
                                    'schoolyear',
                                    'scholarship'
                                ],
                                where: {
                                    coursenow: finalCourseList
                                }
                            })
                        }
                    }
                }

                for (let i = 0; i < enrolledResult.length; i++) {
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
                            studentNumber: enrolledResult[i].studentnumber,
                            gender: gender
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(enrolledResult[i])
                }
            }
            //college is specific, but course and gender are not
            else {
                let enrolledResult
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    enrolledResult = await studEnrollModel.findAll({
                        attributes: [
                            'studentnumber',
                            'semester',
                            'schoolyear'
                        ],
                        where: { 
                            semester: semester, 
                            schoolyear: schoolyear,
                            coursenow: finalCourseList
                        }
                    })
                }
                else {
                    enrolledResult = await studEnrollModel.findAll({
                        attributes: [
                            'studentnumber',
                            'semester',
                            'schoolyear'
                        ],
                        where: {
                            coursenow: finalCourseList
                        }
                    })
                }

                for (let i = 0; i < enrolledResult.length; i++) {
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
                            studentNumber: enrolledResult[i].studentnumber
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(enrolledResult[i])
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
                let enrolledResult
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    enrolledResult = await studEnrollModel.findAll({
                        attributes: [
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
                    enrolledResult = await studEnrollModel.findAll({
                        attributes: [
                            'studentnumber',
                            'semester',
                            'schoolyear'
                        ]
                    })
                }

                for (let i = 0; i < enrolledResult.length; i++) {
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
                            studentNumber: enrolledResult[i].studentnumber,
                            gender: gender,
                            course: courseCode
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(enrolledResult[i])
                }
            }
            //gender is not specific
            else {
                let enrolledResult
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    enrolledResult = await studEnrollModel.findAll({
                        attributes: [
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
                    enrolledResult = await studEnrollModel.findAll({
                        attributes: [
                            'studentnumber',
                            'semester',
                            'schoolyear'
                        ]
                    })
                }

                for (let i = 0; i < enrolledResult.length; i++) {
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
                            studentNumber: enrolledResult[i].studentnumber,
                            course: courseCode
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(enrolledResult[i])
                }
            }
        }
        //course not specific
        else {
            //gender is specific
            if(gender != 'ALL') {
                let enrolledResult
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    enrolledResult = await studEnrollModel.findAll({
                        attributes: [
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
                    enrolledResult = await studEnrollModel.findAll({
                        attributes: [
                            'studentnumber',
                            'semester',
                            'schoolyear'
                        ]
                    })
                }

                for (let i = 0; i < enrolledResult.length; i++) {
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
                            studentNumber: enrolledResult[i].studentnumber,
                            gender: gender
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(enrolledResult[i])
                }
            }
            //gender is not specific
            else {
                let enrolledResult
                
                //sem and sy specific
                if(semester != 'ALL' && schoolyear != 'ALL') {
                    enrolledResult = await studEnrollModel.findAll({
                        attributes: [
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
                    enrolledResult = await studEnrollModel.findAll({
                        attributes: [
                            'studentnumber',
                            'semester',
                            'schoolyear'
                        ]
                    })
                }

                for (let i = 0; i < enrolledResult.length; i++) {
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
                            studentNumber: enrolledResult[i].studentnumber
                        }
                    })
                    
                    studInfoResult.push(infoRes)
                    objRes.push(enrolledResult[i])
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
    addStudEnroll,
    editStudEnroll,
    getStudsEnroll,
    getStudEnroll,
    addTransaction,
    addSubjTransaction,
    dropSubjTransaction,
    getSchoolyear,
    searchEnrolled
}