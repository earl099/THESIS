"use strict"

module.exports = (sequelize, DataTypes) => {
    let scholarship = sequelize.define('enrollscholarshiptbl', {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER(10).UNSIGNED,
            autoIncrement: true,
            allowNull: false,
            
        },
        scholarship: {
            type: DataTypes.STRING
        },
        srf: {
            type: DataTypes.INTEGER(3)
        },
        sfdf: {
            type: DataTypes.INTEGER(3)
        },
        tuition: {
            type: DataTypes.INTEGER(3)
        },
        lessAll: {
            type: DataTypes.ENUM('Y', 'N'),
            defaultValue: 'N'
        },
        active: {
            type: DataTypes.TINYINT(1),
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

    return scholarship
}