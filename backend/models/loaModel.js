"use strict"

module.exports = (sequelize, DataTypes) => {
    let loa = sequelize.define('enrollloalist', {
        studentnumber: {
            type: DataTypes.STRING(25)
        },
        course: {
            type: DataTypes.STRING(20)
        },
        semester: {
            type: DataTypes.STRING(10)
        },
        schoolyear: {
            type:  DataTypes.STRING(10)
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        encoder: {
            type: DataTypes.STRING(25)
        },
        dateencoded: {
            type: DataTypes.DATE
        },
        id: {
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            type: DataTypes.INTEGER(11)
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
            }
        ]
    })

    return loa
}