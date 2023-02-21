"use strict"

module.exports = (sequelize, DataTypes) => {
    let college = sequelize.define('enrollcollegetbl', {
        collegeCode: {
            type: DataTypes.STRING
        },
        collegeDescription: {
            type: DataTypes.STRING
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

    return college
}