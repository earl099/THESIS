"use strict"

const db = require('../config/sequelize')
//validation models
const studEnrollModel = db.studEnroll
const subjEnrollModel = db.subjEnroll
const divOfFeesModel = db.divOfFees

//models needed for assessment
const assessListModel = db.assessList
const assessSubjModel = db.assessSubj
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
        ]
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

    const schedcodeList = await scheduleModel.findAll({
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
            semester: semester, 
            schoolyear: schoolyear 
        }
    })

    
    for(let i = 0; i < schedcodeList.length; i++) {
        switch (schedcodeList[i].subjectype) {
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
    for(let i = 0; i < schedcodeList.length; i++) {
        //OTHER FEES
        switch (schedcodeList[i].ojt) {
            case 'Y':
                otherFeeChecker[0]++
                break;
        }
        switch (schedcodeList[i].petition) {
            case 'Y':
                otherFeeChecker[1]++
                break;
        }
        switch (schedcodeList[i].thesis) {
            case 'Y':
                otherFeeChecker[2]++
                break;
        }
        switch (schedcodeList[i].internet) {
            case 'Y':
                otherFeeChecker[3]++
                break;
        }
        switch (schedcodeList[i].residency) {
            case 'Y':
                otherFeeChecker[4]++
                break;
        }

        //TOTAL UNITS
        totalUnits += Number(schedcodeList[i].units) + Number(schedcodeList[i].labunits)
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
    let subjCounter
    let transaction = await db.sequelize.transaction()


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
    const { schedcode, edate, subjNum } = req.body
    
    let subjEnrollData = {
        studentnumber: studentnumber,
        schedcode: schedcode,
        edate: edate,
        semester: semester,
        schoolyear: schoolyear
    }

    subjCounter = subjNum

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

    const schedcodeList = await scheduleModel.findAll({
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
            semester: semester, 
            schoolyear: schoolyear 
        }
    })

    
    for(let i = 0; i < schedcodeList.length; i++) {
        switch (schedcodeList[i].subjectype) {
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
    for(let i = 0; i < schedcodeList.length; i++) {
        //OTHER FEES
        switch (schedcodeList[i].ojt) {
            case 'Y':
                otherFeeChecker[0]++
                break;
        }
        switch (schedcodeList[i].petition) {
            case 'Y':
                otherFeeChecker[1]++
                break;
        }
        switch (schedcodeList[i].thesis) {
            case 'Y':
                otherFeeChecker[2]++
                break;
        }
        switch (schedcodeList[i].internet) {
            case 'Y':
                otherFeeChecker[3]++
                break;
        }
        switch (schedcodeList[i].residency) {
            case 'Y':
                otherFeeChecker[4]++
                break;
        }

        //TOTAL UNITS
        totalUnits += Number(schedcodeList[i].units) + Number(schedcodeList[i].labunits)
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

        //UPDATE DIVISION OF FEES
        updatedDivOfFees = await divOfFeesModel.update(
            updatedDivOfFeesObject, 
            { 
                where: 
                {
                    studentnumber: studentnumber,
                    semester: semester,
                    schoolyear: schoolyear
                } 
            }, { transaction: transaction }
        )
        

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

    //--- STUDENT INFO ---//
    const studentInfo = studentModel.findOne({
        attributes: [
            'studentnumber',
            
        ]
    })
}

const changeSubjTransaction = async (req, res) => {

}

module.exports = {
    addStudEnroll,
    editStudEnroll,
    getStudsEnroll,
    getStudEnroll,
    addTransaction,
    addSubjTransaction,
    dropSubjTransaction,
    changeSubjTransaction
}