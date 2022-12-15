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

const fullTransaction = async (req, res) => {
    try {
        await db.sequelize.transaction(async (t) => {
            
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
                    'yearAdmitted',
                    'SemesterAdmitted'
                ],
                where: { studentNumber: studentnumber }
            })
            
            const assessedStud = await assessListModel.findOne({
                attributes: [
                    'id',
                    'studentnumber',
                    'StudentStatus',
                    'semester',
                    'schoolyear',
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

            //for creating the notuitionenroll field
            let notuitionenroll = ''
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

            //creating student enroll data
            const studEnroll = await studEnrollModel.create(studEnrollObject, { t })

            //assessed subject to subject enrolled
            const assessSubj = await assessSubjModel.findAll({
                attributes: [
                    'studentNumber',
                    'schedcode',
                    'semester',
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

            //object for creating subject enrolled
            for(let i = 0; i < assessSubj.length; i++){
                const subjEnrollObject = {
                    studentnumber: studentnumber,
                    schedcode: assessSubj,
                    edate: 
                    currentDate.getFullYear() + '-' + 
                    currentDate.getMonth() + '-' +
                    currentDate.getDate() + ' ' +
                    currentDate.getHours() + ':' +
                    currentDate.getMinutes() + ':' +
                    currentDate.getSeconds(),
                    semester: semester,
                    schoolyear: schoolyear
                }

                //creating subjectenrolled data
                await subjEnrollModel.create(subjEnrollObject, { t })
            }
            
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
            //ENGLISH, NURSING, CCL, RLE, CSPEAR, EDFS, PSYC, TRM, FISHERY, 
            //--- ^^^MULTIPLIERS^^^ ---//
            const labFeeMultiplier = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

            //OJT, PETITION, THESIS, INTERNET, RESIDENCY CHECKER
            const otherFeeChecker = [0,0,0,0,0]

            //Total units
            const totalUnits = 0

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
                    studentnumber: studentnumber, 
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
                    default:
                        break
                }
            }

            //OTHER FEES CHECKER AND CALCULATION OF TOTAL UNITS
            for(let i = 0; i < schedcodeList.length; i++) {
                //OTHER FEES
                switch (schedcode[i].ojt) {
                    case 'Y':
                        otherFeeChecker[0]++
                        break;
                }
                switch (schedcode[i].petition) {
                    case 'Y':
                        otherFeeChecker[1]++
                        break;
                }
                switch (schedcode[i].thesis) {
                    case 'Y':
                        otherFeeChecker[2]++
                        break;
                }
                switch (schedcode[i].internet) {
                    case 'Y':
                        otherFeeChecker[3]++
                        break;
                }
                switch (schedcode[i].residency) {
                    case 'Y':
                        otherFeeChecker[4]++
                        break;
                }

                //TOTAL UNITS
                totalUnits += (schedcode[i].units + schedcode[i].labunits)
            }

            //DIVIDIONOFFEES OBJECT CREATION
            const totalTuition = totalUnits * feesBase.tuition

            const divOfFeesObject = {
                studentnumber: studentnumber,
                semester: semester,
                schoolyear: schoolyear,
                ansci: labFeeMultiplier[0] * feesBase.labAnSci,
                pansci: 0,
                biosci: labFeeMultiplier[1] * feesBase.labBioSci,
                pbiosci: 0,
                cemds: labFeeMultiplier[2] * feesBase.labCEMDS,
                pcemds: 0,
                hrm: labFeeMultiplier[3] * feesBase.labHRM,
                phrm: 0,
                cropsci: labFeeMultiplier[4] * feesBase.labCropSci,
                pcropsci: 0,
                engineering: labFeeMultiplier[5] * feesBase.labEng,
                pengineering: 0,
                physci: labFeeMultiplier[6] * feesBase.labPhySci,
                pphysci: 0,
                vetmed: labFeeMultiplier[7] * feesBase.labVetMed,
                pvetmed: 0,
                speech: labFeeMultiplier[8] * feesBase.labSpeech,
                pspeech: 0,
                english: labFeeMultiplier[9] * feesBase.labEnglish,
                penglish: 0,
                nursing: labFeeMultiplier[10] * feesBase.labNursing,
                pnursing: 0,
                ccl: labFeeMultiplier[11] * feesBase.ccl,
                pccl: 0,
                rle: labFeeMultiplier[12] * 
                    (
                        feesBase.rle + feesBase.rletwo + 
                        feesBase.rlethree + feesBase.mwRLE + 
                        feesBase.mwrletwo + feesBase.mwrlethree
                    ),
                prle: 0,
                internet: otherFeeChecker[3] * feesBase.internet,
                pinternet: 0,
                nstp: feesBase.NSTP,
                pnstp: 0,
                ojt: otherFeeChecker[0] * feesBase.ojt,
                pojt: 0,
                thesis: otherFeeChecker[2] * feesBase.thesis,
                pthesis: 0,
                student: feesBase.studentTeaching,
                pstudent: 0,
                late: 0,
                plate: 0,
                residency: otherFeeChecker[4] * feesBase.residency,
                presidency: 0,
                foreignstudent: feesBase.foreignStudent,
                pforeignstudent: 0,
                addedsubj: 0,
                paddedsubj: 0,
                petition: 0,
                ppetition: 0,
                tuition: totalTuition,
                ptuition: 0,
                library: feesBase.miscLibrary,
                plibrary: 0,
                medical: feesBase.miscMedical,
                pmedical: 0,
                publication: feesBase.miscPublication,
                ppublication: 0,
                registration: feesBase.miscRegistration,
                pregistration: 0,
                guidance: feesBase.miscGuidance,
                pguidance: 0,
                id: feesBase.identification,
                pid: 0,
                sfdf: feesBase.sfdf,
                psfdf: 0,
                srf: feesBase.srf,
                psrf: 0,
                athletic: feesBase.athletic,
                pathletic: 0,
                scuaa: feesBase.scuaa,
                pscuaa: 0,
                deposit: feesBase.deposit,
                pdeposit: 0,
                cspear: feesBase.labcspear,
                pcspear: 0,
                edfs: feesBase.edfs,
                pedfs: 0,
                psyc: feesBase.psyc,
                ppsyc: 0,
                trm: feesBase.trm,
                ptrm: 0,
                fishery: feesBase.fishery,
                pfishery: 0
            }

            //CREATING DIVIDIONOFFEES DATA
            const divOfFees = await divOfFeesModel.create(divOfFeesObject, { t })

            //CREATING SUBJECTENROLLED LIST
            const subjEnrollList = await subjEnrollModel.findAll({
                attributes: [
                    'schedcode',
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
            }, { t })

            if(studEnroll && divOfFees && subjEnrollList.length > 0) {
                res.status(200).send({ 
                    message: `Validation of Student Number ${studentnumber} successful.`, 
                    studEnroll: studEnroll, divOfFees: divOfFees, subjEnrollList: subjEnrollList 
                })
            }

            return studentInfo
        })
    }
    catch (error) {
        res.status(500).send({ message: 'Error Validating Student' })
    }
}

module.exports = {
    addStudEnroll,
    editStudEnroll,
    getStudsEnroll,
    getStudEnroll,
    fullTransaction
}