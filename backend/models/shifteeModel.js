"use strict"

module.exports = (sequelize, DataTypes) => {
    let shift = sequelize.define('enrollshifttbl', {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER(6),
            autoIncrement: true,
            allowNull: false,
            
        },
        studentnumber: {
            type: DataTypes.STRING(9)
        },
        coursefrom: {
            type: DataTypes.STRING(20)
        },
        courseto: {
            type: DataTypes.STRING(20)
        },
        semester: {
            type: DataTypes.STRING(10)
        },
        schoolyear: {
            type: DataTypes.STRING(10)
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

    return shift;
}