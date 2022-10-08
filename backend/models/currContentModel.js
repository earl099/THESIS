"use strict"

module.exports = (sequelize, DataTypes) => {
    let curriculumContent = sequelize.define('enrollcurriculumcontent', {
        id: {
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            type: DataTypes.INTEGER(15)
        },
        refid: {
            type: DataTypes.INTEGER(15),
            defaultValue: 0
        },
        subjectcode: {
            type: DataTypes.STRING(25),
            defaultValue: 'N/A'
        },
        semester: {
            type: DataTypes.STRING(25),
            defaultValue: 'N/A'
        },
        schoolyear: {
            type: DataTypes.STRING(15),
            defaultValue: 'N/A'
        },
        course: {
            type: DataTypes.STRING(25),
            defaultValue: 'N/A'
        },
        coursemajor: {
            type: DataTypes.STRING(50),
            defaultValue: 'N/A'
        },
        prerequisite: {
            type: DataTypes.STRING(25),
            defaultValue: 'N/A'
        },
        yearlevel: {
            type: DataTypes.INTEGER(1),
            defaultValue: 0
        },
        active: {
            type: DataTypes.INTEGER(1),
            defaultValue: 1
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
            }
        ]
    })

    return curriculumContent;
}