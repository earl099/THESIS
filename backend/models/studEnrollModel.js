"use strict"

module.exports = (sequelize, DataTypes) => {
    let studEnroll = sequelize.define('enrollstudentenroll', {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER(11),
            autoIncrement: true,
            allowNull: false,
        },
        studentnumber: {
            type: DataTypes.STRING(9)
        },
        semester: {
            type: DataTypes.STRING(15)
        },
        schoolyear: {
            type: DataTypes.STRING(15)
        },
        edate: {
            type: DataTypes.DATE
        },
        status: {
            type: DataTypes.STRING(15)
        },
        scholarship: {
            type: DataTypes.STRING(150)
        },
        majorCourse: {
            type: DataTypes.STRING
        },
        yearLevel: {
            type: DataTypes.STRING
        },
        statusII: {
            type: DataTypes.STRING
        },
        coursenow: {
            type: DataTypes.STRING(25)
        },
        notuitionenroll: {
            type: DataTypes.STRING(10),
            defaultValue: 'FALSE'
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
                fields: ['id']
            },
            {
                name: 'StudentNumber',
                fields: ['studentnumber']
            },
            {
                name: 'SemAndSY',
                fields: ['semester', 'schoolyear']
            },
            {
                name: 'StudentAndCourse',
                fields: ['studentnumber', 'coursenow', 'schoolyear', 'semester']
            }
        ]
    })

    return studEnroll;
}