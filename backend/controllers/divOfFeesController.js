"use strict"

const db = require('../config/sequelize')
const divOfFeesModel = db.divOfFees

//---   ADDING NEW STUDENT'S DIVISION OF FEES ---//
const addFees = async (req, res) => {
    const {
        studentnumber,
        semester,
        schoolyear,
        ansci,
        pansci,
        biosci,
        pbiosci,
        cemds,
        pcemds,
        hrm,
        phrm,
        cropsci,
        pcropsci,
        engineering,
        pengineering,
        physci,
        pphysci,
        vetmed,
        pvetmed,
        speech,
        pspeech,
        english,
        penglish,
        nursing,
        pnursing,
        ccl,
        pccl,
        rle,
        prle,
        internet,
        pinternet,
        nstp,
        pnstp,
        ojt,
        pojt,
        thesis,
        pthesis,
        student,
        pstudent,
        late,
        plate,
        residency,
        presidency,
        foreignstudent,
        pforeignstudent,
        addedsubj,
        paddedsubj,
        petition,
        ppetition,
        tuition,
        ptuition,
        library,
        plibrary,
        medical,
        pmedical,
        publication,
        ppublication,
        registration,
        pregistration,
        guidance,
        pguidance,
        id,
        pid,
        sfdf,
        psfdf,
        srf,
        psrf,
        athletic,
        pathletic,
        scuaa,
        pscuaa,
        deposit,
        pdeposit,
        cspear,
        pcspear,
        edfs,
        pedfs,
        psyc,
        ppsyc,
        trm,
        ptrm,
        fishery,
        pfishery
    } = req.body;

    const divOfFees = {
        studentnumber: studentnumber,
        semester: semester,
        schoolyear: schoolyear,
        ansci: ansci,
        pansci: pansci,
        biosci: biosci,
        pbiosci: pbiosci,
        cemds: cemds,
        pcemds: pcemds,
        hrm: hrm,
        phrm: phrm,
        cropsci: cropsci,
        pcropsci: pcropsci,
        engineering: engineering,
        pengineering: pengineering,
        physci: physci,
        pphysci: pphysci,
        vetmed: vetmed,
        pvetmed: pvetmed,
        speech: speech,
        pspeech: pspeech,
        english: english,
        penglish: penglish,
        nursing: nursing,
        pnursing: pnursing,
        ccl: ccl,
        pccl: pccl,
        rle: rle,
        prle: prle,
        internet: internet,
        pinternet: pinternet,
        nstp: nstp,
        pnstp: pnstp,
        ojt: ojt,
        pojt: pojt,
        thesis: thesis,
        pthesis: pthesis,
        student: student,
        pstudent: pstudent,
        late: late,
        plate: plate,
        residency: residency,
        presidency: presidency,
        foreignstudent: foreignstudent,
        pforeignstudent: pforeignstudent,
        addedsubj: addedsubj,
        paddedsubj: paddedsubj,
        petition: petition,
        ppetition: ppetition,
        tuition: tuition,
        ptuition: ptuition,
        library: library,
        plibrary: plibrary,
        medical: medical,
        pmedical: pmedical,
        publication: publication,
        ppublication: ppublication,
        registration: registration,
        pregistration: pregistration,
        guidance: guidance,
        pguidance: pguidance,
        id: id,
        pid: pid,
        sfdf: sfdf,
        psfdf: psfdf,
        srf: srf,
        psrf: psrf,
        athletic: athletic,
        pathletic: pathletic,
        scuaa: scuaa,
        pscuaa: pscuaa,
        deposit: deposit,
        pdeposit: pdeposit,
        cspear: cspear,
        pcspear: pcspear,
        edfs: edfs,
        pedfs: pedfs,
        psyc: psyc,
        ppsyc: ppsyc,
        trm: trm,
        ptrm: ptrm,
        fishery: fishery,
        pfishery: pfishery
    }

    try {
        const createdDivOfFees = await divOfFeesModel.create(divOfFees)
        res.status(200).send({ message: 'Student\'s division of fees data added.', createdDivOfFees: createdDivOfFees})
    }
    catch {
        res.status(500).send({ message: 'Error adding data.' })
    }
}

//--- GET STUDENT'S FEES ---//
const getFees = async (req, res) => {
    const studentnumber = req.params.studentnumber;
    const semester = req.params.semester;
    const schoolyear = req.params.schoolyear;

    const divOfFees = await divOfFeesModel.findOne({
        attributes: [
            'ansci',
            'biosci',
            'cemds',
            'hrm',
            'cropsci',
            'engineering',
            'physci',
            'vetmed',
            'speech',
            'english',
            'nursing',
            'ccl',
            'rle',
            'internet',
            'nstp',
            'ojt',
            'thesis',
            'student',
            'late',
            'residency',
            'foreignstudent',
            'addedsubj',
            'petition',
            'tuition',
            'library',
            'medical',
            'publication',
            'registration',
            'guidance',
            'id',
            'sfdf',
            'srf',
            'athletic',
            'scuaa',
            'deposit',
            'cspear',
            'edfs',
            'psyc',
            'trm',
            'fishery'
        ],
        where: { studentnumber: studentnumber, semester: semester, schoolyear: schoolyear}
    });

    if(divOfFees) {
        res.status(200).send({ message: 'Student\'s fees found.', divOfFees: divOfFees })
    }
    else {
        res.status(404).send({ message: 'Data not found.' })
    }
}

//--- GET PAID FEES ---//
const getPaidFees = async (req, res) => {
    const studentnumber = req.params.studentnumber;
    const semester = req.params.semester;
    const schoolyear = req.params.schoolyear;

    const divOfFees = await divOfFeesModel.findOne({
        attributes: [
            'pansci',
            'pbiosci',
            'pcemds',
            'phrm',
            'pcropsci',
            'pengineering',
            'pphysci',
            'pvetmed',
            'pspeech',
            'penglish',
            'pnursing',
            'pccl',
            'prle',
            'pinternet',
            'pnstp',
            'pojt',
            'pthesis',
            'pstudent',
            'plate',
            'presidency',
            'pforeignstudent',
            'paddedsubj',
            'ppetition',
            'ptuition',
            'plibrary',
            'pmedical',
            'ppublication',
            'pregistration',
            'pguidance',
            'pid',
            'psfdf',
            'psrf',
            'pathletic',
            'pscuaa',
            'pdeposit',
            'pcspear',
            'pedfs',
            'ppsyc',
            'ptrm',
            'pfishery',
        ],
        where: {
            studentnumber: studentnumber, 
            semester: semester, 
            schoolyear: schoolyear 
        }
    });

    if(divOfFees) {
        res.status(200).send({ message: 'Student\'s paid fees found.', divOfFees: divOfFees })
    }
    else {
        res.status(404).send({ message: 'Data not found.' })
    }
}

//--- EDIT FEES ---//
const editFees = async (req, res) => {
    const studentnumber = req.params.studentnumber;
    const semester = req.params.semester;
    const schoolyear = req.params.schoolyear;

    const {
        ansci,
        biosci,
        cemds,
        hrm,
        cropsci,
        engineering,
        physci,
        vetmed,
        speech,
        english,
        nursing,
        ccl,
        rle,
        internet,
        nstp,
        ojt,
        thesis,
        student,
        late,
        residency,
        foreignstudent,
        addedsubj,
        petition,
        tuition,
        library,
        medical,
        publication,
        registration,
        guidance,
        id,
        sfdf,
        srf,
        athletic,
        scuaa,
        deposit,
        cspear,
        edfs,
        psyc,
        trm,
        fishery,
    } = req.body;

    const divOfFees = {
        ansci,
        biosci,
        cemds,
        hrm,
        cropsci,
        engineering,
        physci,
        vetmed,
        speech,
        english,
        nursing,
        ccl,
        rle,
        internet,
        nstp,
        ojt,
        thesis,
        student,
        late,
        residency,
        foreignstudent,
        addedsubj,
        petition,
        tuition,
        library,
        medical,
        publication,
        registration,
        guidance,
        id,
        sfdf,
        srf,
        athletic,
        scuaa,
        deposit,
        cspear,
        edfs,
        psyc,
        trm,
        fishery,
    }

    const updatedDivOfFees = await divOfFeesModel.update(
        divOfFees, 
        { 
            where: { 
                studentnumber: studentnumber,
                semester: semester,
                schoolyear: schoolyear
            }
        }
    )

    if(updatedDivOfFees[0] > 0) {
        res.status(200).send({ message: 'Student\'s fees updated.', updatedDivOfFees: updatedDivOfFees })
    }
    else {
        res.status(500).send({ message: 'Error updating fees.' })
    }
}

//--- EDIT PAID FEES ---//
const editPaidFees = async (req, res) => {
    const studentnumber = req.params.studentnumber;
    const semester = req.params.semester;
    const schoolyear = req.params.schoolyear;

    const {
        pansci,
        pbiosci,
        pcemds,
        phrm,
        pcropsci,
        pengineering,
        pphysci,
        pvetmed,
        pspeech,
        penglish,
        pnursing,
        pccl,
        prle,
        pinternet,
        pnstp,
        pojt,
        pthesis,
        pstudent,
        plate,
        presidency,
        pforeignstudent,
        paddedsubj,
        ppetition,
        ptuition,
        plibrary,
        pmedical,
        ppublication,
        pregistration,
        pguidance,
        pid,
        psfdf,
        psrf,
        pathletic,
        pscuaa,
        pdeposit,
        pcspear,
        pedfs,
        ppsyc,
        ptrm,
        pfishery,
    } = req.body;

    const divOfFees = {
        pansci,
        pbiosci,
        pcemds,
        phrm,
        pcropsci,
        pengineering,
        pphysci,
        pvetmed,
        pspeech,
        penglish,
        pnursing,
        pccl,
        prle,
        pinternet,
        pnstp,
        pojt,
        pthesis,
        pstudent,
        plate,
        presidency,
        pforeignstudent,
        paddedsubj,
        ppetition,
        ptuition,
        plibrary,
        pmedical,
        ppublication,
        pregistration,
        pguidance,
        pid,
        psfdf,
        psrf,
        pathletic,
        pscuaa,
        pdeposit,
        pcspear,
        pedfs,
        ppsyc,
        ptrm,
        pfishery,
    }

    const updatedDivOfFees = await divOfFeesModel.update(
        divOfFees, 
        { 
            where: { 
                studentnumber: studentnumber, 
                semester: semester, 
                schoolyear: schoolyear 
            }
        }
    )

    if(updatedDivOfFees[0] > 0) {
        res.status(200).send({ message: 'Student\'s paid fees updated.', updatedDivOfFees: updatedDivOfFees })
    }
    else {
        res.status(500).send({ message: 'Error updating paid fees.' })
    }
}

module.exports = {
    addFees,
    getFees,
    getPaidFees,
    editFees,
    editPaidFees
}