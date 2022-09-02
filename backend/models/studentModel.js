"use strict"

module.exports = (sequelize, DataTypes) => {
    let user = sequelize.define('enrollstudentinformation', {
        studentNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        middleName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        suffix: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        street: {
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
            type: DataTypes.STRING,
            allowNull: false,
        },
        religion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        citizenship: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        guardian: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mobilePhone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        yearAdmitted: {
            type: DataTypes.STRING,
            allowNull: false
        },
        semesterAdmitted: {
            type: DataTypes.STRING,
            allowNull: false
        },
        course: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cardNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mobilePhone: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        freezeTableName: true,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        classMethods: {

        }
    })

    return user;
}