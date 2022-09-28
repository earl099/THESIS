"use strict"

const db = require('../config/sequelize');
const studentModel = db.student;

//--- ADD STUDENT ---//
const addStudent = async (req, res) => {
    const {
        studentNumber,
        firstName,
        lastName,
        middleName,
        suffix,
        street,
        barangay,
        municipality,
        province,
        dateOfBirth,
        gender,
        religion,
        citizenship,
        status,
        guardian,
        mobilePhone,
        email,
        yearAdmitted,
        SemesterAdmitted,
        course,
        cardNumber,
        lastupdate,
        highschool,
        curriculumid,
    } = req.body;

    const student = {
        studentNumber: studentNumber,
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
        suffix: suffix,
        street: street,
        barangay: barangay,
        municipality: municipality,
        province: province,
        dateOfBirth: dateOfBirth,
        gender: gender,
        religion: religion,
        citizenship: citizenship,
        status: status,
        guardian: guardian,
        mobilePhone: mobilePhone,
        email: email,
        yearAdmitted: yearAdmitted,
        SemesterAdmitted: SemesterAdmitted,
        course: course,
        cardNumber: cardNumber,
        lastupdate: lastupdate,
        highschool: highschool,
        curriculumid: curriculumid
    }

    try {
        const createdStudent = await studentModel.create(student);
        res.status(201).send({createdStudent: createdStudent, message: 'Student Added.'});
    }
    catch {
        res.status(500).send({ message: 'Student already exists.' });
    }
}

//--- EDIT STUDENT ---//
const editStudent = async (req, res) => {
    const studentNumber = req.params.studentNumber;
    const {
        firstName,
        lastName,
        middleName,
        suffix,
        street,
        barangay,
        municipality,
        province,
        dateOfBirth,
        gender,
        religion,
        citizenship,
        status,
        guardian,
        mobilePhone,
        email,
        yearAdmitted,
        SemesterAdmitted,
        highschool,
    } = req.body;

    const student = {
        firstName,
        lastName,
        middleName,
        suffix,
        street,
        barangay,
        municipality,
        province,
        dateOfBirth,
        gender,
        religion,
        citizenship,
        status,
        guardian,
        mobilePhone,
        email,
        yearAdmitted,
        SemesterAdmitted,
        highschool
    }

    const updatedStudent = await studentModel.update(student, {where: {studentNumber: studentNumber}})

    if(updatedStudent[0] > 0) {
        res.status(200).send({ message: 'Student updated successfully.', updatedStudent: updatedStudent })
    }
    else {
        res.status(500).send({ message: 'Could not update student.' });
    }
}

//--- GET ALL STUDENTS ---//
const getStudents = async (req, res) => {
    //if(!req.query.size || !req.query.page) { return res.status(500).send({ message: 'Page number and page size required.' }); }
    
    // let pageSize = +req.query.size;
    // if(pageSize > 100) {
    //     pageSize = 100;
    // }


    const students = await studentModel.findAll({
        attributes: [
            'studentNumber',
            'firstName',
            'lastName',
            'middleName',
            'suffix',
            'street',
            'barangay',
            'municipality',
            'province',
            'dateOfBirth',
            'gender',
            'religion',
            'citizenship',
            'status',
            'guardian',
            'mobilePhone',
            'email',
            'course'
        ]
    });

    if(students.length > 0) {
        res.status(200).send({ message: 'Students found.', students: students })
    }
    else {
        res.status(404).send({ message: 'Students not found.' });
    }
}

//--- GET A STUDENT ---//
const getStudent = async (req, res) => {
    const studentNumber = req.params.studentNumber;
    const student = await studentModel.findOne({
        attributes: [
            'studentNumber',
            'firstName',
            'lastName',
            'middleName',
            'suffix',
            'street',
            'barangay',
            'municipality',
            'province',
            'dateOfBirth',
            'gender',
            'religion',
            'citizenship',
            'status',
            'guardian',
            'mobilePhone',
            'email',
            'course'
        ],
        where: { studentNumber: studentNumber }
    });

    if(student) {
        res.status(200).send({ message: 'Student found.', student: student });
    }
    else {
        res.status(404).send({ message: 'Student not found.' });
    }
}


module.exports = {
    addStudent,
    editStudent,
    getStudents,
    getStudent
}