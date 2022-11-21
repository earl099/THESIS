"use strict"

module.exports = (sequelize, DataTypes) => {
    let grades = sequelize.define('enrollgradestbl', {
        subjectcode: {
            type: DataTypes.STRING(25)
        },
        creditsubjectcode: {
            type: DataTypes.STRING(25),
            defaultValue: 'N/A'
        },
        studentnumber: {
            type: DataTypes.STRING(11)
        },
        schedcode: {
            type: DataTypes.STRING(11)
        },
        mygrade: {
            type: DataTypes.STRING(8)
        },
        mygradeedit: {
            type: DataTypes.STRING(30),
            defaultValue: 'N/A'
        },
        mygradeeditdate: {
            type: DataTypes.STRING(30),
            defaultValue: 'N/A'
        },
        makeupgrade: {
            type: DataTypes.STRING(8),
            defaultValue: '-'
        },
        makeupencoder: {
            type: DataTypes.STRING(30),
            defaultValue: 'N/A'
        },
        makeupdate: {
            type: DataTypes.STRING(30),
            defaultValue: 'N/A'
        },
        units: {
            type: DataTypes.DECIMAL(5,2),
            defaultValue: 0.00
        },
        semester: {
            type: DataTypes.STRING(15)
        },
        schoolyear: {
            type: DataTypes.STRING(15)
        },
        graded: {
            type: DataTypes.ENUM('Y', 'N'),
            defaultValue: 'Y'
        },
        wh: {
            type: DataTypes.ENUM('Y', 'N'),
            defaultValue: 'N'
        },
        id: {
            primaryKey: true,
            type: DataTypes.BIGINT(10).UNSIGNED,
            autoIncrement: true,
            allowNull: false,
        },
        encodedtimestamp: {
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
            allowNull: false
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
                name: 'id',
                fields: ['id']
            },
            {
                name: 'fastview',
                fields: ['schedcode', 'studentnumber', 'subjectcode', 'schoolyear', 'semester']
            },
        ]
    })

    return grades;
}