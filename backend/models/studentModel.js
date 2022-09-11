"use strict"

module.exports = (sequelize, DataTypes) => {
    let student = sequelize.define('enrollstudentinformation', {
        studentNumber: {
            type: DataTypes.STRING(15),
            unique: true,
        },
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        middleName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        suffix: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        street: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        barangay: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        municipality: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        province: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING(6),
            allowNull: false,
        },
        religion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        citizenship: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        guardian: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mobilePhone: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
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
            autoIncrement: true
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
        },
        lrn: {
            type: DataTypes.INTEGER(15)
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        classMethods: {
            
        }
    })

    return student;
}