"use strict"

module.exports = (sequelize, DataTypes) => {
    let curriculum = sequelize.define('enrollcurriculum', {
        id: {
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            type: DataTypes.STRING(10)
        },
        course: {
            type: DataTypes.STRING(25),
            defaultValue: 'N/A'
        },
        schoolyear: {
            type: DataTypes.STRING(15),
            defaultValue: 'N/A'
        },
        coursemajor: {
            type: DataTypes.STRING(50),
            defaultValue: 'N/A'
        },
        activecurriculum: {
            type: DataTypes.SMALLINT(1),
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
    });

    return curriculum;
}