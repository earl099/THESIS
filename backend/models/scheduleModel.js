"use strict"

module.exports = (sequelize, DataTypes) => {
    let schedule = sequelize.define('enrollscheduletbl', {
        schedcode: {
            type: DataTypes.STRING(50)
        },
        subjectCode: {
            type: DataTypes.STRING(50)
        },
        units: {
            type: DataTypes.STRING(10)
        },
        semester: {
            type: DataTypes.STRING(15)
        },
        schoolyear: {
            type: DataTypes.STRING(15),
            defaultValue: '0'
        },
        slots: {
            type: DataTypes.INTEGER(3)
        },
        subjectype: {
            type: DataTypes.STRING(50)
        },
        section: {
            type: DataTypes.STRING(50)
        },
        instructor: {
            type:DataTypes.STRING(50)
        },
        tuition: {
            type: DataTypes.ENUM('Y', 'N'),
            defaultValue: 'Y'
        },
        graded: {
            type: DataTypes.ENUM('Y', 'N'),
            defaultValue: 'Y'
        },
        gradeddate: {
            type: DataTypes.STRING(25),
            defaultValue: 'N/A'
        },
        timein1: {
            type: DataTypes.STRING(15),
            defaultValue: 'N/A'
        },
        timeout1: {
            type: DataTypes.STRING(15),
            defaultValue: 'N/A'
        },
        day1: {
            type: DataTypes.STRING(15),
            defaultValue: 'N/A'
        },
        room1: {
            type: DataTypes.STRING(15),
            defaultValue: 'N/A'
        },
        timein2: {
            type: DataTypes.STRING(15),
            defaultValue: 'N/A'
        },
        timeout2: {
            type: DataTypes.STRING(15),
            defaultValue: 'N/A'
        },
        day2: {
            type: DataTypes.STRING(15),
            defaultValue: 'N/A'
        },
        room2: {
            type: DataTypes.STRING(15),
            defaultValue: 'N/A'
        },
        timein3: {
            type: DataTypes.STRING(15),
            defaultValue: 'N/A'
        },
        timeout3: {
            type: DataTypes.STRING(15),
            defaultValue: 'N/A'
        },
        day3: {
            type: DataTypes.STRING(15),
            defaultValue: 'N/A'
        },
        room3: {
            type: DataTypes.STRING(15),
            defaultValue: 'N/A'
        },
        timein4: {
            type: DataTypes.STRING(15),
            defaultValue: 'N/A'
        },
        timeout4: {
            type: DataTypes.STRING(15),
            defaultValue: 'N/A'
        },
        day4: {
            type: DataTypes.STRING(15),
            defaultValue: 'N/A'
        },
        room4: {
            type: DataTypes.STRING(15),
            defaultValue: 'N/A'
        },
        ok1: {
            type: DataTypes.ENUM('Y', 'N'),
            defaultValue: 'N'
        },
        ok2: {
            type: DataTypes.ENUM('Y', 'N'),
            defaultValue: 'N'
        },
        ok3: {
            type: DataTypes.ENUM('Y', 'N'),
            defaultValue: 'N'
        },
        ok4: {
            type: DataTypes.ENUM('Y', 'N'),
            defaultValue: 'N'
        },
        oras: {
            type: DataTypes.STRING(10)
        },
        ojt: {
            type: DataTypes.ENUM('Y', 'N'),
            defaultValue: 'N'
        },
        petition: {
            type: DataTypes.ENUM('Y', 'N'),
            defaultValue: 'N'
        },
        thesis: {
            type: DataTypes.ENUM('Y', 'N'),
            defaultValue: 'N'
        },
        labunits: {
            type: DataTypes.STRING(10)
        },
        internet: {
            type: DataTypes.ENUM('Y', 'N'),
            defaultValue: 'N'
        },
        residency: {
            type: DataTypes.ENUM('Y', 'N'),
            defaultValue: 'N'
        },
        encodegrade: {
            type: DataTypes.STRING,
            defaultValue: 'N/A'
        },
        gradingpart: {
            type: DataTypes.ENUM('Y', 'N'),
            defaultValue: 'N'
        },
        id: {
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            type: DataTypes.INTEGER(11)
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
                name: 'SchedCode',
                fields: ['schedcode']
            },
            {
                name: 'SemAndSY',
                fields: ['semester', 'schoolyear']
            },
            {
                name: 'SubjectCode',
                fields: ['subjectCode']
            }
        ],
        
    }
    )

    return schedule;
}