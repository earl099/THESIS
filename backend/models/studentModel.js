"use strict"

module.exports = (sequelize, DataTypes) => {
    let student = sequelize.define('enrollstudentinformation', {
        studentNumber: {
            type: DataTypes.STRING(15),
        },
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        middleName: {
            type: DataTypes.STRING,
        },
        suffix: {
            type: DataTypes.STRING(100)
        },
        street: {
            type: DataTypes.STRING
        },
        barangay: {
            type: DataTypes.STRING
        },
        municipality: {
            type: DataTypes.STRING
        },
        province: {
            type: DataTypes.STRING
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY
        },
        gender: {
            type: DataTypes.STRING(6)
        },
        religion: {
            type: DataTypes.STRING
        },
        citizenship: {
            type: DataTypes.STRING(50)
        },
        status: {
            type: DataTypes.STRING(20)
        },
        guardian: {
            type: DataTypes.STRING
        },
        mobilePhone: {
            type: DataTypes.STRING(20)
        },
        email: {
            type: DataTypes.STRING
        },
        yearAdmitted: {
            type: DataTypes.STRING(25)
        },
        SemesterAdmitted: {
            type: DataTypes.STRING(25)
        },
        course: {
            type: DataTypes.STRING
        },
        cardNumber: {
            type: DataTypes.STRING(100),
        },
        studentincrement: {
            type: DataTypes.INTEGER(15),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        lastupdate: {
            type: DataTypes.STRING(5)
        },
        highschool: {
            type: DataTypes.STRING
        },
        curriculumid: {
            type: DataTypes.INTEGER(5),
            defaultValue: 0
        }
    },
    {
        freezeTableName: true,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        indexes: [
            {
                name: 'PRIMARY',
                fields: ['studentincrement']
            },
            {
                name: 'StudNumber',
                fields: ['studentNumber']
            },
            {
                name: 'AdmissionTerm',
                fields: ['yearAdmitted', 'SemesterAdmitted', 'studentNumber']
            }
            
        ]
    });

    return student;
}