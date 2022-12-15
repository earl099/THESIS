"use strict"

module.exports = (sequelize, DataTypes) => {
    let subjEnroll = sequelize.define('enrollsubjectenrolled', {
        studentnumber: {
            type: DataTypes.STRING(15)
        },
        schedcode: {
            type: DataTypes.STRING(15)
        },
        edate: {
            type: DataTypes.DATE
        },
        status: {
            type: DataTypes.STRING(15),
            defaultValue: 'NOT GRADED'
        },
        semester: {
            type: DataTypes.STRING(15)
        },
        schoolyear: {
            type: DataTypes.STRING(15)
        },
        evaluate: {
            type: DataTypes.CHAR(1),
            defaultValue: 'N'
        },
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER(11),
            autoIncrement: true,
            allowNull: false,
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
                name: 'StudNumber',
                fields: ['studentnumber']
            },
            {
                name: 'SchedCode',
                fields: ['schedcode']
            },
            {
                name: 'Semester',
                fields: ['semester']
            },
            {
                name: 'SchoolYear',
                fields: ['schoolyear']
            },
            {
                name: 'load',
                fields: ['schedcode', 'studentnumber', 'schoolyear', 'semester']
            }
        ]
    })

    return subjEnroll;
}