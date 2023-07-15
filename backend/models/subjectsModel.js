"use strict"

module.exports = (sequelize, DataTypes) => {
    let subjects = sequelize.define('enrollsubjectstbl', {
        subjectcode: {
            type: DataTypes.STRING(50)
        },
        description: {
            type: DataTypes.TEXT
        },
        lectUnits: {
            type: DataTypes.FLOAT(5,2)
        },
        pr1: {
            type: DataTypes.STRING(50)
        },
        pr2: {
            type: DataTypes.STRING(50)
        },
        pr3: {
            type: DataTypes.STRING(50)
        },
        pr4: {
            type: DataTypes.STRING(50)
        },
        pr5: {
            type: DataTypes.STRING(50)
        },
        pr6: {
            type: DataTypes.STRING(50)
        },
        pr7: {
            type: DataTypes.STRING(50)
        },
        pr8: {
            type: DataTypes.STRING(50)
        },
        pr9: {
            type: DataTypes.STRING(50)
        },
        pr10: {
            type: DataTypes.STRING(50)
        },
        subjectTitle: {
            type: DataTypes.STRING
        },
        labunits: {
            type: DataTypes.INTEGER(2)
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
                name: 'SubjectCode',
                fields: ['subjectcode']
            },
            {
                name: 'SubjectTitle',
                fields: ['subjectTitle']
            }
        ]
    })

    return subjects;
}