"use strict"

module.exports = (sequelize, DataTypes) => {
    let course = sequelize.define('enrollcoursetbl', {
        courseCode: {
            type: DataTypes.STRING
        },
        courseTitle: {
            type: DataTypes.STRING
        },
        courseYear: {
            type: DataTypes.SMALLINT(1),
            defaultValue: 0
        },
        courseCollege: {
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

    return course
}