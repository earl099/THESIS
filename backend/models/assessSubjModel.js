"use strict"

module.exports = (sequelize, DataTypes) => {
    let assessSubj = sequelize.define('enrollassesssubjectstbl', {
        studentNumber: {
            type: DataTypes.STRING(25)
        },
        schedcode: {
            type: DataTypes.STRING(25)
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
            }
        ]
    })

    return assessSubj
}
