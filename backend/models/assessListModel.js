"use strict"

module.exports = (sequelize, DataTypes) => {
    let assessList = sequelize.define('enrollstudentassesslist', {
        id: {
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            type: DataTypes.INTEGER(11)
        },
        studentNumber: {
            type: DataTypes.STRING(15)
        },
        StudentStatus: {
            type: DataTypes.STRING(20)
        },
        semester: {
            type: DataTypes.STRING(25)
        },
        schoolyear: {
            type: DataTypes.STRING(25)
        },
        dateAssess: {
            type: DataTypes.DATE
        },
        scholarship: {
            type: DataTypes.STRING
        },
        lateEnroll: {
            type: DataTypes.ENUM('N', 'Y'),
            defaultValue: 'N'
        },
        yearLevel: {
            type: DataTypes.SMALLINT(2),
            defaultValue: 0
        },
        majorCourse: {
            type: DataTypes.STRING
        },
        statusII: {
            type: DataTypes.STRING(15)
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        indexes: [
            {
                name: 'PRIMARY',
                fields: ['id']
            },
            {
                name: 'StudentNumber',
                fields: ['studentNumber']
            },
            {
                name: 'SemAndSY',
                fields: ['semester', 'schoolyear']
            }
        ]
    })


    return assessList
}